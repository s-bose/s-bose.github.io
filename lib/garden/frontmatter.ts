import matter from "gray-matter";
import { humanize } from "./slug";

export interface ParsedFrontmatter {
  data: Record<string, unknown>;
  content: string;
}

export function parseFrontmatter(raw: string): ParsedFrontmatter {
  const { data, content } = matter(raw);
  return { data, content };
}

export function deriveTitle(
  data: Record<string, unknown>,
  content: string,
  basename: string,
): string {
  if (typeof data.title === "string" && data.title.trim()) return data.title.trim();
  const h1 = content.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  return humanize(basename);
}

/** Accepts a YAML list or a comma-separated string — both are common in hand-edited frontmatter. */
export function normalizeList(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

export function isExcluded(data: Record<string, unknown>): boolean {
  if (data.draft === true) return true;
  if (data.publish === false) return true;
  return false;
}

export function deriveDescription(data: Record<string, unknown>, plaintext: string): string {
  if (typeof data.description === "string" && data.description.trim()) {
    return data.description.trim();
  }
  const trimmed = plaintext.trim().replace(/\s+/g, " ");
  return trimmed.length > 180 ? `${trimmed.slice(0, 180).trimEnd()}…` : trimmed;
}

function readDateField(data: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (value instanceof Date) return value.toISOString();
  }
  return null;
}

/**
 * Dates come from frontmatter, stamped by hand in the note itself — no git
 * history involved. Accepts a few common Obsidian/vault key spellings.
 * Falls back to file mtime only when the note has no date frontmatter at
 * all, so a fresh paste still renders instead of erroring.
 */
export function deriveDates(
  data: Record<string, unknown>,
  mtimeIso: string,
): { date: string; modified: string } {
  const created = readDateField(data, ["date", "created", "date-created"]);
  const modified = readDateField(data, ["modified", "updated", "lastmod", "date-modified"]);

  return {
    date: created ?? modified ?? mtimeIso,
    modified: modified ?? created ?? mtimeIso,
  };
}
