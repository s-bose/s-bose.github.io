import type { GardenIndex, GraphData, GraphLink, GraphNode } from "./types";
import { STRICT } from "./config";

/**
 * Hand-curated additions to the graph: site routes (which have no vault
 * note to derive from) and deliberate cross-links a wikilink can't express
 * — e.g. tying a note to a project page. Everything else in the graph is
 * derived automatically from `content/garden/**` below; this is for the
 * connections you choose to maintain by hand.
 *
 * Node ids here are namespaced `site:<path>` so they can never collide
 * with a vault note id. To link a note to a site page, add an edge with
 * `source` set to the note's id (its slug, e.g. "notes/metaprogramming")
 * — unknown ids are dropped with a warning below, not a build failure, so
 * this is safe to extend incrementally.
 */
const overlayNodes: GraphNode[] = [
  { id: "site:/", label: "Home", url: "/", group: "site" },
  { id: "site:/projects", label: "Projects", url: "/projects", group: "site" },
  { id: "site:/experience", label: "Experience", url: "/experience", group: "site" },
];

const overlayLinks: GraphLink[] = [
  { source: "site:/", target: "site:/projects" },
  { source: "site:/", target: "site:/experience" },
];

function degreeMap(nodes: GraphNode[], links: GraphLink[]): Map<string, number> {
  const deg = new Map<string, number>();
  nodes.forEach((n) => deg.set(n.id, 0));
  links.forEach((l) => {
    deg.set(l.source, (deg.get(l.source) ?? 0) + 1);
    deg.set(l.target, (deg.get(l.target) ?? 0) + 1);
  });
  return deg;
}

// Keyed by index identity, not content — a rebuilt index (dev-mode content
// edit) is a new object, so this never serves stale graph data.
const graphCache = new WeakMap<GardenIndex, GraphData>();

/** Merges the vault-derived graph with the hand-curated overlay above. Every note page, the graph page, and graph.json call this with the same index — cached so it's computed once per index build instead of once per page. */
export function buildGraphData(index: GardenIndex): GraphData {
  const cached = graphCache.get(index);
  if (cached) return cached;

  const derivedNodes: GraphNode[] = index.notes.map((n) => ({
    id: n.id,
    label: n.title,
    url: `/garden/${n.slug}`,
    group: n.slug.includes("/") ? n.slug.split("/")[0] : "root",
    tags: n.tags,
  }));

  const derivedLinks: GraphLink[] = [];
  for (const note of index.notes) {
    for (const target of note.forwardLinks) {
      derivedLinks.push({ source: note.id, target });
    }
  }

  // Derived nodes win on id collision (shouldn't happen given the "site:" namespace).
  const nodeMap = new Map<string, GraphNode>();
  for (const n of [...overlayNodes, ...derivedNodes]) nodeMap.set(n.id, n);

  const validIds = new Set(nodeMap.keys());
  const links: GraphLink[] = [];
  const seenPairs = new Set<string>();
  for (const link of [...overlayLinks, ...derivedLinks]) {
    if (!validIds.has(link.source) || !validIds.has(link.target)) {
      const message = `[garden] dropping graph edge with unknown endpoint: ${link.source} -> ${link.target}`;
      if (STRICT) throw new Error(message);
      console.warn(message);
      continue;
    }
    const key = link.source < link.target ? `${link.source}|${link.target}` : `${link.target}|${link.source}`;
    if (seenPairs.has(key)) continue;
    seenPairs.add(key);
    links.push(link);
  }

  const nodes = [...nodeMap.values()];
  const deg = degreeMap(nodes, links);
  const result = { nodes: nodes.map((n) => ({ ...n, degree: deg.get(n.id) ?? 0 })), links };
  graphCache.set(index, result);
  return result;
}

const adjacencyCache = new WeakMap<GraphData, Map<string, Set<string>>>();

function buildAdjacency(graph: GraphData): Map<string, Set<string>> {
  const cached = adjacencyCache.get(graph);
  if (cached) return cached;

  const adjacency = new Map<string, Set<string>>();
  graph.nodes.forEach((n) => adjacency.set(n.id, new Set()));
  graph.links.forEach((l) => {
    adjacency.get(l.source)?.add(l.target);
    adjacency.get(l.target)?.add(l.source);
  });
  adjacencyCache.set(graph, adjacency);
  return adjacency;
}

/** BFS neighborhood of `id` up to `depth` hops, capped at `cap` nodes total. Every note page rebuilds this for its own note, so the adjacency map (not the BFS itself, which is already cheap) is cached per graph. */
export function neighborhood(
  graph: GraphData,
  id: string,
  depth = 2,
  cap = 80,
): GraphData {
  const adjacency = buildAdjacency(graph);

  const visited = new Set<string>([id]);
  let frontier = new Set<string>([id]);
  for (let d = 0; d < depth && visited.size < cap; d++) {
    const next = new Set<string>();
    frontier.forEach((cur) => {
      adjacency.get(cur)?.forEach((neighbor) => {
        if (!visited.has(neighbor) && visited.size + next.size < cap) {
          next.add(neighbor);
        }
      });
    });
    next.forEach((n) => visited.add(n));
    frontier = next;
  }

  const nodes = graph.nodes.filter((n) => visited.has(n.id));
  const links = graph.links.filter((l) => visited.has(l.source) && visited.has(l.target));
  return { nodes, links };
}

// ─── tree (folder-nested view of the index, for the explorer sidebar) ───

export interface TreeNode {
  name: string;
  slug: string;
  title: string | null;
  children: TreeNode[];
}

const treeCache = new WeakMap<GardenIndex, TreeNode>();

/** GardenLayout wraps every /garden/* page, so this runs once per rendered page — cached per index build since the result only depends on the index. */
export function buildTree(index: GardenIndex): TreeNode {
  const cached = treeCache.get(index);
  if (cached) return cached;

  const root: TreeNode = { name: "", slug: "", title: null, children: [] };

  function ensure(parent: TreeNode, segments: string[], slugPrefix: string): TreeNode {
    if (segments.length === 0) return parent;
    const [head, ...rest] = segments;
    const slug = slugPrefix ? `${slugPrefix}/${head}` : head;
    let child = parent.children.find((c) => c.name === head);
    if (!child) {
      child = { name: head, slug, title: null, children: [] };
      parent.children.push(child);
    }
    return ensure(child, rest, slug);
  }

  for (const note of index.notes) {
    const segments = note.slug.split("/").filter(Boolean);
    if (segments.length === 0) {
      root.title = note.title;
      continue;
    }
    const node = ensure(root, segments, "");
    node.title = note.title;
  }

  const sortTree = (node: TreeNode) => {
    node.children.sort((a, b) => {
      const aIsFolder = a.children.length > 0;
      const bIsFolder = b.children.length > 0;
      if (aIsFolder !== bIsFolder) return aIsFolder ? -1 : 1;
      return (a.title ?? a.name).localeCompare(b.title ?? b.name);
    });
    node.children.forEach(sortTree);
  };
  sortTree(root);

  treeCache.set(index, root);
  return root;
}
