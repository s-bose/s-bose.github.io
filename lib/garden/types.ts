export interface GardenHeading {
  depth: number;
  text: string;
  id: string;
  /** Character offset of the heading's start in `GardenNote.raw` — used by transclude.ts to slice sections. */
  offset: number;
}

export interface GardenNote {
  /** Vault-relative path without extension, e.g. "notes/metaprogramming". Also the graph node id. */
  id: string;
  /** URL slug — identical to `id` except the root index note, which slugs to "". */
  slug: string;
  filePath: string;
  format: "md" | "mdx";
  title: string;
  description: string;
  tags: string[];
  aliases: string[];
  date: string;
  modified: string;
  readTime: number;
  headings: GardenHeading[];
  /** Markdown body with frontmatter stripped, transclusions NOT yet expanded. */
  raw: string;
  plaintext: string;
  /** Resolved note ids this note links to (via wikilinks or ordinary markdown links). */
  forwardLinks: string[];
  /** Raw unresolved wikilink targets, for the build report. */
  brokenLinks: string[];
}

export interface GardenBacklink {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
}

export interface GardenIndex {
  notes: GardenNote[];
  byId: Map<string, GardenNote>;
  bySlug: Map<string, GardenNote>;
  /** normalized vault-relative path (no extension, lowercased) -> note id */
  byPath: Map<string, string>;
  /** lowercased filename stem -> note ids sharing that basename */
  byBasename: Map<string, string[]>;
  /** lowercased frontmatter title -> note ids sharing that title */
  byTitle: Map<string, string[]>;
  /** lowercased alias -> note ids declaring that alias */
  byAlias: Map<string, string[]>;
  backlinks: Map<string, GardenBacklink[]>;
  tagsToNotes: Map<string, string[]>;
  brokenLinks: { from: string; target: string }[];
  /** lowercased attachment filename -> vault-relative path (posix, from VAULT_DIR). Obsidian embeds reference attachments vault-wide, not relative to the note. */
  assetsByBasename: Map<string, string>;
  /** Every real vault-relative asset path (posix, lowercased), for exact-path resolution before falling back to assetsByBasename. */
  assetPaths: Set<string>;
}

export type GraphNodeGroup = string;

export interface GraphNode {
  id: string;
  label: string;
  url: string;
  group: GraphNodeGroup;
  tags?: string[];
  degree?: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
