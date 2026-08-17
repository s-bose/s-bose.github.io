/** Display fallback for a raw path segment (folder name, filename) with no title: "dev-fixtures" -> "Dev Fixtures". */
export function humanize(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function slugifySegment(segment: string): string {
  return segment
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics after NFKD decomposition
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function segmentsToSlug(segments: string[]): string {
  return segments.map(slugifySegment).filter(Boolean).join("/");
}

/** Normalizes a path-like key for map lookups: strip extension, lowercase, no leading/trailing slash. */
export function normalizePathKey(raw: string): string {
  return raw
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\.mdx?$/i, "")
    .toLowerCase();
}
