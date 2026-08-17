import { visit } from "unist-util-visit";
import { slug as slugifyHeading } from "github-slugger";
import type { Blockquote, Image, Link, Paragraph, Parent, PhrasingContent, Root, Text } from "mdast";
import { ASSET_URL_PREFIX } from "./config";
import { parseWikilinkSyntax, resolveAssetTarget, resolveWikilink } from "./resolve";
import type { GardenIndex } from "./types";

/** Strips Obsidian `%%comment%%` spans from text nodes before anything else runs. */
export function remarkStripComments() {
  return (tree: Root) => {
    visit(tree, "text", (node) => {
      node.value = node.value.replace(/%%[\s\S]*?%%/g, "");
    });
  };
}

const ADMONITION_TYPES = ["note", "tip", "warning", "danger", "info"];

/**
 * Legacy `:::note ... :::` directive syntax, recovered from the deleted
 * blog pipeline (git show 'eaf6738^:app/blog/[slug]/page.tsx'). Kept for
 * .mdx notes hand-authored with the old syntax; Obsidian vault content
 * uses `> [!note]` instead — see remarkCallouts.
 */
export function remarkAdmonitions() {
  return (tree: Root) => {
    // containerDirective nodes come from remark-directive; not in the base mdast type set.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, "containerDirective", (node: any) => {
      const type: string = node.name;
      if (!ADMONITION_TYPES.includes(type)) return;
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      node.data = {
        ...node.data,
        hName: "div",
        hProperties: {
          ...node.data?.hProperties,
          "data-admonition-name": type,
          "data-admonition-label": label,
          role: "note",
        },
      };
    });
  };
}

/**
 * Turns the `::::embed{href="…" title="…"} … ::::` directives emitted by
 * transclude.ts into a labeled <aside> wrapping the transcluded content.
 */
export function remarkEmbed() {
  return (tree: Root) => {
    // containerDirective comes from remark-directive; not in the base mdast type set.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, "containerDirective", (node: any) => {
      if (node.name !== "embed") return;
      const href: string = node.attributes?.href ?? "#";
      const title: string = node.attributes?.title ?? "";

      node.children.unshift({
        type: "paragraph",
        data: { hName: "a", hProperties: { href, "data-garden-embed-title": "" } },
        children: [{ type: "text", value: title }],
      });

      node.data = {
        ...node.data,
        hName: "aside",
        hProperties: { ...node.data?.hProperties, "data-garden-embed": "" },
      };
    });
  };
}

const HIGHLIGHT_RE = /==([^=\n]+)==/g;

/** Obsidian `==highlight==` → <mark>highlight</mark>. */
export function remarkHighlight() {
  return (tree: Root) => {
    visit(tree, "text", (node: Text, index, parent) => {
      if (index === undefined || !parent) return;
      HIGHLIGHT_RE.lastIndex = 0;
      if (!HIGHLIGHT_RE.test(node.value)) return;
      HIGHLIGHT_RE.lastIndex = 0;

      const replacement: PhrasingContent[] = [];
      let lastEnd = 0;
      let match: RegExpExecArray | null;
      while ((match = HIGHLIGHT_RE.exec(node.value))) {
        const [full, inner] = match;
        if (match.index > lastEnd) {
          replacement.push({ type: "text", value: node.value.slice(lastEnd, match.index) });
        }
        replacement.push({
          type: "text",
          value: inner,
          data: { hName: "mark" },
        } as Text);
        lastEnd = match.index + full.length;
      }
      if (lastEnd < node.value.length) {
        replacement.push({ type: "text", value: node.value.slice(lastEnd) });
      }

      (parent as Parent).children.splice(index, 1, ...replacement);
      return index + replacement.length;
    });
  };
}

const TAG_RE = /(^|[\s(])#([\p{L}\d_][\p{L}\d_/-]*)/gu;

/**
 * Cosmetic only: wraps inline `#tag` occurrences in prose with a styled
 * span. Tag *extraction* for the index (search, graph node tags) happens
 * separately during indexing via a raw-text scan — see lib/garden/index.ts
 * — so this plugin never needs to feed data back anywhere.
 *
 * Skips pure-numeric matches (`#1`) and text already inside a link's
 * visible label (checked via immediate parent only, not full ancestry —
 * a `#tag` nested inside emphasis inside a link is not caught, which is
 * an acceptable gap for this content).
 */
export function remarkTags() {
  return (tree: Root) => {
    visit(tree, "text", (node: Text, idx, parent) => {
      if (idx === undefined || !parent || (parent as Parent).type === "link") return;
      TAG_RE.lastIndex = 0;
      if (!TAG_RE.test(node.value)) return;
      TAG_RE.lastIndex = 0;

      const replacement: PhrasingContent[] = [];
      let lastEnd = 0;
      let matched = false;
      let match: RegExpExecArray | null;
      while ((match = TAG_RE.exec(node.value))) {
        const [full, lead, tag] = match;
        const start = match.index + lead.length;
        if (start > lastEnd) {
          replacement.push({ type: "text", value: node.value.slice(lastEnd, start) });
        }
        if (/^\d+$/.test(tag)) {
          replacement.push({ type: "text", value: `#${tag}` });
        } else {
          matched = true;
          replacement.push({
            type: "text",
            value: `#${tag}`,
            data: { hName: "span", hProperties: { "data-garden-tag": tag } },
          } as Text);
        }
        lastEnd = match.index + full.length;
      }
      if (!matched) return;
      if (lastEnd < node.value.length) {
        replacement.push({ type: "text", value: node.value.slice(lastEnd) });
      }

      (parent as Parent).children.splice(idx, 1, ...replacement);
      return idx + replacement.length;
    });
  };
}

// No `m`/`s` flags: matched against just the first line below, not the
// whole (possibly multi-line) text node value.
const CALLOUT_RE = /^\[!(\w+)\]([+-])?\s*(.*)$/;

const CALLOUT_TYPE_MAP: Record<string, "note" | "tip" | "warning" | "danger"> = {
  note: "note",
  abstract: "note",
  summary: "note",
  tldr: "note",
  info: "note",
  todo: "note",
  question: "note",
  help: "note",
  faq: "note",
  example: "note",
  quote: "note",
  cite: "note",
  tip: "tip",
  hint: "tip",
  important: "tip",
  success: "tip",
  check: "tip",
  done: "tip",
  warning: "warning",
  caution: "warning",
  attention: "warning",
  failure: "danger",
  fail: "danger",
  missing: "danger",
  danger: "danger",
  error: "danger",
  bug: "danger",
};

/** Transforms Obsidian `> [!note] Title` blockquotes into the same DOM shape remarkAdmonitions produces. */
export function remarkCallouts() {
  return (tree: Root) => {
    visit(tree, "blockquote", (node: Blockquote) => {
      const firstChild = node.children[0];
      if (!firstChild || firstChild.type !== "paragraph") return;
      const paragraph = firstChild as Paragraph;
      const firstText = paragraph.children[0];
      if (!firstText || firstText.type !== "text") return;

      // A blockquote's lines with no blank line between them collapse into
      // ONE text node whose value contains embedded "\n"s (e.g. the title
      // line plus the callout body) — match the marker against the first
      // line only, not the whole multi-line value.
      const value = (firstText as Text).value;
      const newlineIndex = value.indexOf("\n");
      const firstLine = newlineIndex === -1 ? value : value.slice(0, newlineIndex);
      const restOfValue = newlineIndex === -1 ? "" : value.slice(newlineIndex);

      const match = firstLine.match(CALLOUT_RE);
      if (!match) return;

      const [, rawType, fold, titleText] = match;
      const mapped = CALLOUT_TYPE_MAP[rawType.toLowerCase()];
      if (!mapped) return;

      const label = titleText.trim() || rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase();

      const remainderOfFirstLine = firstLine.slice(match[0].length).replace(/^\s+/, "");
      const newValue = (remainderOfFirstLine + restOfValue).replace(/^\n+/, "");

      if (newValue) {
        (firstText as Text).value = newValue;
      } else {
        paragraph.children.shift();
        if (paragraph.children.length === 0) {
          node.children.shift();
        }
      }

      const isFoldable = fold === "+" || fold === "-";

      if (isFoldable) {
        // <details> needs a real <summary> child for the native disclosure
        // widget to be clickable — a CSS ::before label (used below for the
        // non-foldable case) isn't part of the interactive element.
        node.children.unshift({
          type: "paragraph",
          data: { hName: "summary" },
          children: [{ type: "text", value: label }],
        });
        node.data = {
          ...node.data,
          hName: "details",
          hProperties: {
            ...node.data?.hProperties,
            "data-admonition-name": mapped,
            ...(fold === "+" ? { open: true } : {}),
            role: "note",
          },
        };
        return;
      }

      node.data = {
        ...node.data,
        hName: "div",
        hProperties: {
          ...node.data?.hProperties,
          "data-admonition-name": mapped,
          "data-admonition-label": label,
          role: "note",
        },
      };
    });
  };
}

export interface RemarkWikilinksOptions {
  index: GardenIndex;
  fromId: string;
}

const WIKILINK_RE = /\[\[([^[\]]+)\]\]/g;

/**
 * Handles `[[Note]]`, `[[Note|alias]]`, `[[Note#Heading]]`, `[[#Heading]]`.
 * `![[Note]]` embeds are expanded before this runs (see transclude.ts) —
 * anything reaching this plugin is a plain link. Operates on mdast `text`
 * nodes, which exist identically under both `format: "md"` and
 * `format: "mdx"`, and never enters `code`/`inlineCode` (they're leaf
 * nodes with a `value`, not `text`-node children) — wikilinks inside
 * fenced blocks are left alone.
 */
export function remarkWikilinks(options: RemarkWikilinksOptions) {
  const { index, fromId } = options;

  function findHeadingId(noteId: string, headingText: string): string {
    const note = index.byId.get(noteId);
    const match = note?.headings.find((h) => h.text.toLowerCase() === headingText.toLowerCase());
    return match?.id ?? slugifyHeading(headingText);
  }

  function buildNode(full: string): PhrasingContent {
    const parsed = parseWikilinkSyntax(full);
    if (!parsed) return { type: "text", value: full };

    // Same-page anchor: [[#Heading]]
    if (!parsed.target && parsed.heading) {
      const id = findHeadingId(fromId, parsed.heading);
      const link: Link = {
        type: "link",
        url: `#${id}`,
        children: [{ type: "text", value: parsed.alias ?? parsed.heading }],
      };
      return link;
    }

    const resolution = resolveWikilink(index, fromId, parsed.target);
    if (!resolution.ok) {
      return {
        type: "text",
        value: parsed.alias ?? parsed.target,
        data: {
          hName: "span",
          hProperties: {
            "data-garden-broken": "",
            title: `Unresolved: ${parsed.target}`,
          },
        },
      } as Text;
    }

    let url = `/garden/${resolution.slug}`;
    if (parsed.heading) {
      url += `#${findHeadingId(resolution.id, parsed.heading)}`;
    }

    const link: Link = {
      type: "link",
      url,
      children: [{ type: "text", value: parsed.alias ?? resolution.title }],
      data: { hProperties: { "data-wikilink": "" } },
    };
    return link;
  }

  return (tree: Root) => {
    visit(tree, "text", (node: Text, index_, parent) => {
      if (index_ === undefined || !parent) return;
      WIKILINK_RE.lastIndex = 0;
      if (!WIKILINK_RE.test(node.value)) return;
      WIKILINK_RE.lastIndex = 0;

      const replacement: PhrasingContent[] = [];
      let lastEnd = 0;
      let match: RegExpExecArray | null;
      while ((match = WIKILINK_RE.exec(node.value))) {
        const [full] = match;
        if (match.index > lastEnd) {
          replacement.push({ type: "text", value: node.value.slice(lastEnd, match.index) });
        }
        replacement.push(buildNode(full));
        lastEnd = match.index + full.length;
      }
      if (lastEnd < node.value.length) {
        replacement.push({ type: "text", value: node.value.slice(lastEnd) });
      }

      (parent as Parent).children.splice(index_, 1, ...replacement);
      return index_ + replacement.length;
    });
  };
}

export interface RemarkAssetsOptions {
  index: GardenIndex;
  fromId: string;
}

function isRewritableAssetUrl(url: string): boolean {
  if (!url) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return false; // has a scheme: http:, mailto:, data:, ...
  if (url.startsWith("/") || url.startsWith("#")) return false;
  return true;
}

/**
 * Rewrites relative attachment paths (images, PDFs, etc.) to their served
 * URL, resolving vault-wide via resolveAssetTarget — the same rule
 * transclude.ts uses for `![[embed]]` syntax, since Obsidian's default
 * attachment location is the vault root, not "next to the note". A target
 * that doesn't resolve anywhere in the vault is left untouched (so it 404s
 * visibly rather than silently pointing at a made-up path). Note-to-note
 * wikilinks are handled separately by remarkWikilinks and never reach here.
 */
export function remarkAssets(options: RemarkAssetsOptions) {
  const { index, fromId } = options;

  function rewrite(url: string): string | null {
    const resolved = resolveAssetTarget(index, fromId, decodeURIComponent(url));
    return resolved ? `${ASSET_URL_PREFIX}/${resolved}` : null;
  }

  return (tree: Root) => {
    visit(tree, "image", (node: Image) => {
      if (!isRewritableAssetUrl(node.url)) return;
      const rewritten = rewrite(node.url);
      if (rewritten) node.url = rewritten;
    });
    visit(tree, "link", (node: Link) => {
      const looksLikeAttachment =
        isRewritableAssetUrl(node.url) && /\.\w{2,5}$/.test(node.url) && !/\.mdx?$/i.test(node.url);
      if (!looksLikeAttachment) return;
      const rewritten = rewrite(node.url);
      if (rewritten) node.url = rewritten;
    });
  };
}
