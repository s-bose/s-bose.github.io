import { NextResponse } from "next/server";
import { getGardenIndex } from "@/lib/garden";
import { buildGraphData } from "@/lib/garden/graph";

// Route Handlers render to a static file under output:"export"
// (app/garden/graph.json/route.ts -> out/garden/graph.json).
export const dynamic = "force-static";

export async function GET() {
  const index = getGardenIndex();
  return NextResponse.json(buildGraphData(index));
}
