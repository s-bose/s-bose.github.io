import { NextResponse } from "next/server";
import { getGardenIndex } from "@/lib/garden";
import { buildSearchDocs, createSearchIndex } from "@/lib/garden/search";

export const dynamic = "force-static";

export async function GET() {
  const index = getGardenIndex();
  const mini = createSearchIndex(buildSearchDocs(index));
  // JSON.stringify invokes MiniSearch's toJSON(); the client loads this
  // back with MiniSearch.loadJSON using the same SEARCH_OPTIONS.
  return new NextResponse(JSON.stringify(mini), {
    headers: { "Content-Type": "application/json" },
  });
}
