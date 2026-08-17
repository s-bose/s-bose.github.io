import type { GardenIndex, GardenNote } from "./types";
import { parseWikilinkSyntax, resolveAssetTarget, resolveWikilink } from "./resolve";
import { ASSET_URL_PREFIX, STRICT, TRANSCLUSION_MAX_DEPTH } from "./config";

const EMBED_RE = /!\[\[([^[\]]+)\]\]/g;
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i;

function sectionSlice(note: GardenNote, headingText: string): string | null {
  const idx = note.headings.findIndex((h) => h.text.toLowerCase() === headingText.toLowerCase());
  if (idx === -1) return null;
  const start = note.headings[idx].offset;
  const depth = note.headings[idx].depth;
  const next = note.headings.slice(idx + 1).find((h) => h.depth <= depth);
  const end = next ? next.offset : note.raw.length;
  return note.raw.slice(start, end).trimEnd();
}

function fenceFor(body: string): string {
  let longest = 0;
  for (const line of body.split("\n")) {
    const match = line.match(/^:{3,}/);
    if (match) longest = Math.max(longest, match[0].length);
  }
  return ":".repeat(Math.max(4, longest + 1));
}

/**
 * Expands `![[Note]]` / `![[Note#Heading]]` / `![[image.png]]` on the raw
 * markdown string, before compilation — transclusion needs a recursive
 * compile of the target's body, which a remark plugin (a single-pass mdast
 * transform) can't do. Depth-capped and cycle-checked; on any failure the
 * embed degrades to a plain `[[Target]]` link (stripping the `!`) rather
 * than breaking the build.
 */
export function expandTransclusions(
  source: string,
  note: GardenNote,
  index: GardenIndex,
  depth = 0,
  seen: Set<string> = new Set([note.id]),
): string {
  return source.replace(EMBED_RE, (full, inner: string) => {
    const parsed = parseWikilinkSyntax(full);
    if (!parsed) return full;

    const degrade = (reason: string) => {
      const message = `[garden] transclusion of "${parsed.target}" from "${note.id}" degraded: ${reason}`;
      if (STRICT) throw new Error(message);
      console.warn(message);
      return `[[${inner}]]`;
    };

    // Image/attachment embed — no recursive compile needed.
    if (IMAGE_EXT_RE.test(parsed.target)) {
      const resolved = resolveAssetTarget(index, note.id, parsed.target);
      if (!resolved) return degrade("attachment not found in vault");
      return `![](${ASSET_URL_PREFIX}/${resolved})`;
    }

    if (depth >= TRANSCLUSION_MAX_DEPTH) return degrade(`max depth ${TRANSCLUSION_MAX_DEPTH} exceeded`);

    const resolution = resolveWikilink(index, note.id, parsed.target);
    if (!resolution.ok) return degrade("target note not found");
    if (seen.has(resolution.id)) return degrade("cyclic transclusion");

    const targetNote = index.byId.get(resolution.id);
    if (!targetNote) return degrade("target note not found");

    let body: string;
    if (parsed.heading) {
      const slice = sectionSlice(targetNote, parsed.heading);
      if (slice === null) return degrade(`heading "${parsed.heading}" not found`);
      body = slice;
    } else {
      body = targetNote.raw;
    }

    const expandedBody = expandTransclusions(
      body,
      targetNote,
      index,
      depth + 1,
      new Set([...seen, resolution.id]),
    );

    const fence = fenceFor(expandedBody);
    const title = parsed.alias ?? resolution.title;
    return `${fence}embed{href="/garden/${resolution.slug}" title="${title.replace(/"/g, "&quot;")}"}\n${expandedBody}\n${fence}`;
  });
}
