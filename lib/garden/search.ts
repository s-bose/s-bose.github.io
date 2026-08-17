import MiniSearch, { type Options } from "minisearch";
import type { GardenIndex } from "./types";

export interface SearchDoc {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  description: string;
  plaintext: string;
}

/**
 * Shared between the server route that builds search-index.json and the
 * client command palette that loads it — MiniSearch.loadJSON requires the
 * exact same options used to build the index.
 */
export const SEARCH_OPTIONS: Options<SearchDoc> = {
  fields: ["title", "tags", "description", "plaintext"],
  storeFields: ["title", "slug", "tags", "description"],
  searchOptions: {
    boost: { title: 4, tags: 2, description: 1.5 },
    fuzzy: 0.2,
    prefix: true,
  },
};

export function buildSearchDocs(index: GardenIndex): SearchDoc[] {
  return index.notes.map((n) => ({
    id: n.id,
    title: n.title,
    slug: n.slug,
    tags: n.tags,
    description: n.description,
    plaintext: n.plaintext,
  }));
}

export function createSearchIndex(docs: SearchDoc[]): MiniSearch<SearchDoc> {
  const mini = new MiniSearch<SearchDoc>(SEARCH_OPTIONS);
  mini.addAll(docs);
  return mini;
}
