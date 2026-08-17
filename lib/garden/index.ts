import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { toString as mdastToString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import type { Heading, Root as MdastRoot } from "mdast";

import type { GardenBacklink, GardenHeading, GardenIndex, GardenNote } from "./types";
import {
  IGNORED_DIR_NAMES,
  MARKDOWN_EXTENSIONS,
  RESERVED_SLUGS,
  STRICT,
  VAULT_DIR,
} from "./config";
import {
  deriveDates,
  deriveDescription,
  deriveTitle,
  isExcluded,
  normalizeList,
  parseFrontmatter,
} from "./frontmatter";
import { segmentsToSlug } from "./slug";
import { parseWikilinkSyntax, resolveAssetTarget, resolveWikilink } from "./resolve";

// ─── vault walking ──────────────────────────────────────────────────────

interface WalkedFile {
  absPath: string;
  /** Path segments relative to VAULT_DIR, without extension (raw, not slugified). */
  segments: string[];
  format: "md" | "mdx";
  mtimeMs: number;
  size: number;
}

interface WalkedAsset {
  absPath: string;
  /** Vault-relative path (posix separators) from VAULT_DIR, including extension. */
  relPath: string;
}

interface VaultWalk {
  mdFiles: WalkedFile[];
  /**
   * Every non-markdown file in the vault. Obsidian resolves
   * `![[attachment.png]]` embeds vault-wide by filename (its default
   * attachment location is the vault root, not "next to the note"), so
   * assets need the same kind of basename lookup notes get via byBasename
   * — see assetsByBasename in buildIndex and resolveAssetTarget in resolve.ts.
   */
  assets: WalkedAsset[];
}

function isMarkdownExt(ext: string): boolean {
  return (MARKDOWN_EXTENSIONS as readonly string[]).includes(ext);
}

/** Single recursive pass collecting both notes and attachments, so the vault tree is only read off disk once. */
function walkVault(dir: string, segmentsSoFar: string[] = []): VaultWalk {
  if (!fs.existsSync(dir)) return { mdFiles: [], assets: [] };
  const mdFiles: WalkedFile[] = [];
  const assets: WalkedAsset[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;

    if (entry.isDirectory()) {
      if (IGNORED_DIR_NAMES.has(entry.name.toLowerCase())) continue;
      const nested = walkVault(path.join(dir, entry.name), [...segmentsSoFar, entry.name]);
      mdFiles.push(...nested.mdFiles);
      assets.push(...nested.assets);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    const absPath = path.join(dir, entry.name);

    if (isMarkdownExt(ext)) {
      const stat = fs.statSync(absPath);
      mdFiles.push({
        absPath,
        segments: [...segmentsSoFar, entry.name.slice(0, -ext.length)],
        format: ext === ".mdx" ? "mdx" : "md",
        mtimeMs: stat.mtimeMs,
        size: stat.size,
      });
    } else {
      assets.push({ absPath, relPath: [...segmentsSoFar, entry.name].join("/") });
    }
  }

  return { mdFiles, assets };
}

function fingerprint(files: WalkedFile[]): string {
  return files
    .map((f) => `${f.absPath}:${f.mtimeMs}:${f.size}`)
    .sort()
    .join("|");
}

// ─── id / slug derivation ───────────────────────────────────────────────

function deriveIdAndSlug(segments: string[]): { id: string; slug: string; isIndex: boolean } {
  const isIndex = segments[segments.length - 1].toLowerCase() === "index";
  const effective = isIndex ? segments.slice(0, -1) : segments;
  return { id: effective.join("/"), slug: segmentsToSlug(effective), isIndex };
}

interface CollisionEntry {
  file: WalkedFile;
  id: string;
  slug: string;
  isIndex: boolean;
}

/**
 * Resolves slug collisions (e.g. content/projects.md vs
 * content/projects/index.md both slugging to "projects") and reserved-slug
 * clashes (a note that would otherwise claim /garden/graph). A folder's
 * index.md wins a collision; everyone else gets a `-2`, `-3`, ... suffix.
 * Reserved slugs are never handed out bare, even to a lone claimant.
 */
function resolveCollisions(entries: CollisionEntry[]): Map<WalkedFile, { id: string; slug: string }> {
  const bySlug = new Map<string, CollisionEntry[]>();
  for (const e of entries) {
    const group = bySlug.get(e.slug) ?? [];
    group.push(e);
    bySlug.set(e.slug, group);
  }

  const result = new Map<WalkedFile, { id: string; slug: string }>();

  for (const [slug, group] of bySlug) {
    const reserved = RESERVED_SLUGS.has(slug);
    const sorted = [...group].sort((a, b) => {
      if (a.isIndex !== b.isIndex) return a.isIndex ? -1 : 1;
      if (a.file.segments.length !== b.file.segments.length) {
        return a.file.segments.length - b.file.segments.length;
      }
      return a.file.absPath.localeCompare(b.file.absPath);
    });

    let counter = 2;
    sorted.forEach((entry, i) => {
      const keepsBare = !reserved && i === 0;
      const finalSlug = keepsBare ? slug : `${slug}-${counter++}`;

      if (group.length > 1 || reserved) {
        const kind = reserved ? "reserved" : "collision";
        const message = `[garden] slug ${kind} "${slug}": ${entry.file.absPath} -> "${finalSlug}"${keepsBare ? " (kept)" : ""}`;
        if (STRICT) throw new Error(message);
        console.warn(message);
      }

      result.set(entry.file, { id: finalSlug, slug: finalSlug });
    });
  }

  return result;
}

// ─── structure extraction (headings, plaintext) ─────────────────────────

const structureProcessor = unified().use(remarkParse).use(remarkGfm);

function extractStructure(body: string): { headings: GardenHeading[]; rawPlaintext: string } {
  const tree = structureProcessor.parse(body) as MdastRoot;
  const slugger = new GithubSlugger();
  const headings: GardenHeading[] = [];

  visit(tree, "heading", (node: Heading) => {
    const text = mdastToString(node).trim();
    if (!text) return;
    headings.push({
      depth: node.depth,
      text,
      id: slugger.slug(text),
      offset: node.position?.start.offset ?? 0,
    });
  });

  return { headings, rawPlaintext: mdastToString(tree) };
}

function stripFences(body: string): string {
  return body.replace(/```[\s\S]*?```/g, "").replace(/~~~[\s\S]*?~~~/g, "");
}

/** Renders literal `[[...]]` wikilink syntax down to display text — used for search/description, never for compilation. */
function cleanWikilinkSyntax(text: string): string {
  return text.replace(/!?\[\[([^[\]]+)\]\]/g, (full) => {
    const parsed = parseWikilinkSyntax(full);
    if (!parsed) return "";
    return parsed.alias ?? parsed.target;
  });
}

function calcReadTime(plaintext: string): number {
  return Math.max(1, Math.round(plaintext.trim().split(/\s+/).length / 200));
}

// ─── forward links + backlink excerpts ──────────────────────────────────

interface ScannedWikilink {
  target: string;
  index: number;
  length: number;
}

const ATTACHMENT_TARGET_RE = /\.[a-zA-Z0-9]{2,5}$/;

/** A wikilink target with a non-markdown file extension is an attachment reference, not a note reference — validated separately against assetPaths/assetsByBasename. */
function looksLikeAttachment(target: string): boolean {
  return ATTACHMENT_TARGET_RE.test(target) && !/\.mdx?$/i.test(target);
}

function scanWikilinks(bodyWithoutFences: string): ScannedWikilink[] {
  const out: ScannedWikilink[] = [];
  const re = /!?\[\[([^[\]]+)\]\]/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(bodyWithoutFences))) {
    const parsed = parseWikilinkSyntax(match[0]);
    if (parsed?.target) out.push({ target: parsed.target, index: match.index, length: match[0].length });
  }
  return out;
}

function pushBucket<T>(map: Map<string, T[]>, key: string, value: T): void {
  const bucket = map.get(key);
  if (bucket) bucket.push(value);
  else map.set(key, [value]);
}

function excerptAround(text: string, index: number, length: number, radius = 150): string {
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + length + radius);
  const cleaned = cleanWikilinkSyntax(text.slice(start, end)).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${cleaned}${end < text.length ? "…" : ""}`;
}

// ─── main build ──────────────────────────────────────────────────────────

function buildIndex(files: WalkedFile[], assets: WalkedAsset[]): GardenIndex {
  // Pass A — read + parse frontmatter + extract structure for every surviving file.
  const collisionEntries: CollisionEntry[] = [];
  const perFile = new Map<
    WalkedFile,
    {
      data: Record<string, unknown>;
      body: string;
      title: string;
      tags: string[];
      aliases: string[];
      headings: GardenHeading[];
      rawPlaintext: string;
      cleanPlaintext: string;
    }
  >();

  for (const file of files) {
    const raw = fs.readFileSync(file.absPath, "utf8");
    const { data, content: body } = parseFrontmatter(raw);
    if (isExcluded(data)) continue;

    const rawBasename = file.segments[file.segments.length - 1];
    const isIndexFile = rawBasename.toLowerCase() === "index";
    const basenameForFallback = isIndexFile
      ? (file.segments.length > 1 ? file.segments[file.segments.length - 2] : "garden")
      : rawBasename;

    const { headings, rawPlaintext } = extractStructure(body);
    const title = deriveTitle(data, body, basenameForFallback);
    const tags = normalizeList(data.tags);
    const aliases = normalizeList(data.aliases);

    perFile.set(file, {
      data,
      body,
      title,
      tags,
      aliases,
      headings,
      rawPlaintext,
      cleanPlaintext: cleanWikilinkSyntax(rawPlaintext),
    });

    const { id, slug, isIndex } = deriveIdAndSlug(file.segments);
    collisionEntries.push({ file, id, slug, isIndex });
  }

  // Pass B — resolve slug collisions and reserved-slug clashes.
  const finalIds = resolveCollisions(collisionEntries);

  // Pass C — build notes + lookup maps (everything resolveWikilink needs).
  const notes: GardenNote[] = [];
  const byId = new Map<string, GardenNote>();
  const bySlug = new Map<string, GardenNote>();
  const byPath = new Map<string, string>();
  const byBasename = new Map<string, string[]>();
  const byTitle = new Map<string, string[]>();
  const byAlias = new Map<string, string[]>();
  const tagsToNotes = new Map<string, string[]>();

  for (const file of files) {
    const parsed = perFile.get(file);
    const ids = finalIds.get(file);
    if (!parsed || !ids) continue; // excluded in Pass A

    const { date, modified } = deriveDates(parsed.data, new Date(file.mtimeMs).toISOString());
    const description = deriveDescription(parsed.data, parsed.cleanPlaintext);

    const note: GardenNote = {
      id: ids.id,
      slug: ids.slug,
      filePath: file.absPath,
      format: file.format,
      title: parsed.title,
      description,
      tags: parsed.tags,
      aliases: parsed.aliases,
      date,
      modified,
      readTime: calcReadTime(parsed.cleanPlaintext),
      headings: parsed.headings,
      raw: parsed.body,
      plaintext: parsed.cleanPlaintext,
      forwardLinks: [],
      brokenLinks: [],
    };

    notes.push(note);
    byId.set(note.id, note);
    bySlug.set(note.slug, note);
    byPath.set(ids.id.toLowerCase(), note.id);

    const basenameKey = note.id.includes("/") ? note.id.slice(note.id.lastIndexOf("/") + 1) : note.id;
    pushBucket(byBasename, basenameKey, note.id);
    pushBucket(byTitle, note.title.toLowerCase(), note.id);

    for (const alias of note.aliases) {
      pushBucket(byAlias, alias.toLowerCase(), note.id);
    }

    for (const tag of note.tags) {
      pushBucket(tagsToNotes, tag, note.id);
    }
  }

  // Attachments — collected separately from notes so image/file embeds
  // aren't misreported as broken NOTE links when they're really just
  // unresolved attachments (or vice versa: a valid vault-wide attachment
  // that only fails a naive relative-to-note lookup).
  const assetsByBasename = new Map<string, string>();
  const assetPaths = new Set<string>();
  for (const asset of assets) {
    const relKey = asset.relPath.toLowerCase();
    assetPaths.add(relKey);
    const basename = asset.relPath.includes("/") ? asset.relPath.slice(asset.relPath.lastIndexOf("/") + 1) : asset.relPath;
    const basenameKey = basename.toLowerCase();
    if (!assetsByBasename.has(basenameKey)) assetsByBasename.set(basenameKey, asset.relPath);
  }

  const partialIndex: GardenIndex = {
    notes,
    byId,
    bySlug,
    byPath,
    byBasename,
    byTitle,
    byAlias,
    backlinks: new Map(),
    tagsToNotes,
    brokenLinks: [],
    assetsByBasename,
    assetPaths,
  };

  // Pass D — resolve each note's own wikilinks against the now-complete maps.
  const backlinks = new Map<string, GardenBacklink[]>();
  const brokenLinks: { from: string; target: string }[] = [];
  const brokenAssets: { from: string; target: string }[] = [];

  for (const note of notes) {
    const scanned = scanWikilinks(stripFences(note.raw));
    const seenTargets = new Set<string>();

    for (const link of scanned) {
      if (looksLikeAttachment(link.target)) {
        if (!resolveAssetTarget(partialIndex, note.id, link.target)) {
          brokenAssets.push({ from: note.id, target: link.target });
        }
        continue;
      }

      const resolution = resolveWikilink(partialIndex, note.id, link.target);
      if (!resolution.ok) {
        if (!note.brokenLinks.includes(link.target)) note.brokenLinks.push(link.target);
        brokenLinks.push({ from: note.id, target: link.target });
        continue;
      }

      if (!note.forwardLinks.includes(resolution.id)) note.forwardLinks.push(resolution.id);

      const pairKey = resolution.id;
      if (seenTargets.has(pairKey)) continue; // one backlink entry per (source, target) pair
      seenTargets.add(pairKey);

      const excerpt = excerptAround(stripFences(note.raw), link.index, link.length);
      const list = backlinks.get(resolution.id) ?? [];
      list.push({ id: note.id, title: note.title, slug: note.slug, excerpt });
      backlinks.set(resolution.id, list);
    }
  }

  if (STRICT && (brokenLinks.length > 0 || brokenAssets.length > 0)) {
    const linkSummary = brokenLinks.map((b) => `  ${b.from} -> [[${b.target}]]`).join("\n");
    const assetSummary = brokenAssets.map((b) => `  ${b.from} -> [[${b.target}]]`).join("\n");
    throw new Error(
      `[garden] ${brokenLinks.length} broken wikilink(s), ${brokenAssets.length} broken attachment(s):\n${linkSummary}\n${assetSummary}`,
    );
  }
  if (!STRICT) {
    for (const b of brokenLinks) {
      console.warn(`[garden] unresolved wikilink in "${b.from}": [[${b.target}]]`);
    }
    for (const b of brokenAssets) {
      console.warn(`[garden] unresolved attachment in "${b.from}": [[${b.target}]]`);
    }
  }

  return { ...partialIndex, backlinks, brokenLinks };
}

// ─── module-scope singleton ──────────────────────────────────────────────

let cached: GardenIndex | null = null;
let cachedFingerprint = "";

/**
 * The garden's single source of truth — one mdast parse per note, reused
 * by every consumer (note pages, backlinks, graph, search, tags). In
 * production the index is built once per server-render worker and never
 * revalidated; in dev, a cheap path+mtime+size fingerprint rebuilds it
 * whenever a vault file changes so `next dev` reflects edits without a
 * restart.
 */
export function getGardenIndex(): GardenIndex {
  if (process.env.NODE_ENV === "production" && cached) return cached;

  const { mdFiles, assets } = walkVault(VAULT_DIR);

  const fp = fingerprint(mdFiles);
  if (cached && fp === cachedFingerprint) return cached;

  cached = buildIndex(mdFiles, assets);
  cachedFingerprint = fp;
  return cached;
}

/** Notes sorted newest-first by date, capped to `n` — shared by the garden landing page and the RSS feed. */
export function recentNotes(index: GardenIndex, n: number): GardenNote[] {
  return [...index.notes].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, n);
}
