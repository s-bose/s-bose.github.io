import type { Metadata } from "next";
import { GlobalGraph } from "@/components/garden/graph-view";

export const metadata: Metadata = {
  title: "Graph | Garden",
  description: "The full graph of the digital garden.",
};

export default function GardenGraphPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] min-h-[420px]">
      <p className="text-xs tracking-[0.25em] text-muted-foreground mb-4 uppercase font-semibold">
        Full graph
      </p>
      <div className="flex-1 rounded-lg border border-border overflow-hidden">
        <GlobalGraph />
      </div>
    </div>
  );
}
