import type { GardenIndex } from "./types";
import { normalizePathKey } from "./slug";

export interface WikilinkResolution {
  ok: true;
  id: string;
  slug: string;
  title: string;
}

export interface WikilinkUnresolved {
  ok: false;
  target: string;
}

function shortestWins(ids: string[]): string | undefined {
  if (ids.length === 0) return undefined;
  return [...ids].sort((a, b) => {
    const depthA = a.split("/").length;
    const depthB = b.split("/").length;
    if (depthA !== depthB) return depthA - depthB;
    if (a.length !== b.length) return a.length - b.length;
    return a.localeCompare(b);
  })[0];
}

/**
 * Resolves a bare wikilink target (heading/alias/embed markers already
 * stripped by the caller) against the vault index. Order: exact path →
 * path relative to the source note → alias → basename → title, with
 * shortest-path-wins tie-breaking (mirrors `markdownLinkResolution: shortest`).
 *
 * Called from both the indexer (building the forward-link graph) and the
 * render-time wikilink remark plugin — they MUST use this same function or
 * the graph and the rendered links can disagree.
 */
export function resolveWikilink(
  index: GardenIndex,
  fromId: string,
  rawTarget: string,
): WikilinkResolution | WikilinkUnresolved {
  const target = normalizePathKey(rawTarget);
  if (!target) return { ok: false, target: rawTarget };

  let id: string | undefined = index.byPath.get(target);

  if (!id) {
    const fromDir = fromId.includes("/") ? fromId.slice(0, fromId.lastIndexOf("/")) : "";
    const joined = normalizePathKey(fromDir ? `${fromDir}/${target}` : target);
    id = index.byPath.get(joined);
  }

  if (!id) {
    id = shortestWins(index.byAlias.get(target) ?? []);
  }

  if (!id) {
    const base = target.includes("/") ? target.slice(target.lastIndexOf("/") + 1) : target;
    id = shortestWins(index.byBasename.get(base) ?? []);
  }

  if (!id) {
    id = shortestWins(index.byTitle.get(target) ?? []);
  }

  if (!id) return { ok: false, target: rawTarget };

  const note = index.byId.get(id);
  if (!note) return { ok: false, target: rawTarget };

  return { ok: true, id: note.id, slug: note.slug, title: note.title };
}

/**
 * Resolves an attachment reference to its served URL. Obsidian's default
 * attachment location is the vault root (not "next to the note"), so
 * embeds/images are usually bare filenames — try the path relative to the
 * source note first (predictable when it *is* colocated), then fall back
 * to a vault-wide filename search, matching Obsidian's own resolution.
 * Returns null if the attachment isn't in the vault at all.
 */
export function resolveAssetTarget(index: GardenIndex, fromId: string, target: string): string | null {
  const decoded = decodeURIComponent(target).replace(/^\/+/, "");
  const fromDir = fromId.includes("/") ? fromId.slice(0, fromId.lastIndexOf("/")) : "";
  const relative = normalizePathKey(fromDir ? `${fromDir}/${decoded}` : decoded);

  if (index.assetPaths.has(relative)) return relative;

  const basename = decoded.includes("/") ? decoded.slice(decoded.lastIndexOf("/") + 1) : decoded;
  const found = index.assetsByBasename.get(basename.toLowerCase());
  return found ?? null;
}

export interface ParsedWikilink {
  embed: boolean;
  target: string;
  heading?: string;
  blockId?: string;
  alias?: string;
}

/**
 * Splits the inner text of `[[Target#Heading|alias]]` (or `![[Target]]`)
 * into its parts. Shared by the indexer's forward-link scan and the
 * `remarkWikilinks` plugin so both agree on what a wikilink means.
 */
export function parseWikilinkSyntax(match: string): ParsedWikilink | null {
  const embed = match.startsWith("!");
  const inner = match.slice(embed ? 3 : 2, -2); // strip [[ ]] or ![[ ]]
  if (!inner.trim()) return null;

  const [beforeAlias, aliasPart] = splitOnce(inner, "|");
  const alias = aliasPart?.trim() || undefined;

  const hashIndex = beforeAlias.indexOf("#");
  const target = (hashIndex === -1 ? beforeAlias : beforeAlias.slice(0, hashIndex)).trim();
  const fragment = hashIndex === -1 ? undefined : beforeAlias.slice(hashIndex + 1).trim();

  if (!target && !fragment) return null;

  let heading: string | undefined;
  let blockId: string | undefined;
  if (fragment?.startsWith("^")) {
    blockId = fragment.slice(1) || undefined;
  } else {
    heading = fragment || undefined;
  }

  return { embed, target, heading, blockId, alias };
}

function splitOnce(s: string, sep: string): [string, string | undefined] {
  const i = s.indexOf(sep);
  if (i === -1) return [s, undefined];
  return [s.slice(0, i), s.slice(i + sep.length)];
}
