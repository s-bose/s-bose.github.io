import path from "path";

export const SITE_URL = "https://s-bose.github.io";

export const VAULT_DIR = path.join(process.cwd(), "content/garden");
export const ASSET_OUTPUT_DIR = path.join(process.cwd(), "public/garden/_assets");
export const ASSET_URL_PREFIX = "/garden/_assets";

export const MARKDOWN_EXTENSIONS = [".md", ".mdx"] as const;

/** Directory names skipped entirely by the vault walker, matching Quartz's ignorePatterns. */
export const IGNORED_DIR_NAMES = new Set(["templates", "private", ".obsidian", ".git"]);

/** Slugs reserved by static routes — a note that would collide gets suffixed instead. */
export const RESERVED_SLUGS = new Set(["graph", "rss.xml", "search-index.json", "_assets"]);

/** When set, the indexer throws on collisions/broken links instead of warning. Set in CI. */
export const STRICT = process.env.GARDEN_STRICT === "1";

export const TRANSCLUSION_MAX_DEPTH = 3;
export const LOCAL_GRAPH_DEPTH = 2;
export const LOCAL_GRAPH_CAP = 80;
