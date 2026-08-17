"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import type { GraphData as GardenGraphData } from "@/lib/garden/types";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-muted/30 rounded-lg" />,
});

interface GraphColors {
  node: string;
  nodeActive: string;
  link: string;
  label: string;
}

// Dedicated hex vars (app/globals.css) rather than reading --foreground /
// oklch() directly: canvas oklch() support isn't universal, and one bad
// color value silently paints nothing rather than erroring.
function readGraphColors(): GraphColors {
  if (typeof window === "undefined") {
    return { node: "#7c6f64", nodeActive: "#458588", link: "#d5c4a1", label: "#3c3836" };
  }
  const styles = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
  return {
    node: read("--garden-graph-node", "#7c6f64"),
    nodeActive: read("--garden-graph-node-active", "#458588"),
    link: read("--garden-graph-link", "#d5c4a1"),
    label: read("--garden-graph-label", "#3c3836"),
  };
}

export interface GraphViewProps {
  data: GardenGraphData;
  activeId?: string;
  height?: number | string;
  cooldownTicks?: number;
  showLabelsAtZoom?: number;
}

export function GraphView({
  data,
  activeId,
  height = "100%",
  cooldownTicks,
  showLabelsAtZoom = 1.2,
}: GraphViewProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [colors, setColors] = useState<GraphColors>(readGraphColors);

  useEffect(() => {
    setColors(readGraphColors());
  }, [resolvedTheme]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height: h } = entry.contentRect;
      setSize({ width, height: h });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // force-graph mutates whatever nodes/links objects it's handed (writes
  // x/y/vx/vy/index onto nodes, rewrites link.source/target from ids to
  // object refs). Cloning on every data change keeps our source data and
  // React's prop identity intact instead of getting corrupted in place.
  const clonedData = useMemo(() => structuredClone(data), [data]);

  return (
    <div ref={containerRef} style={{ height }} className="w-full">
      {size.width > 0 && size.height > 0 && (
        <ForceGraph2D
          graphData={clonedData}
          width={size.width}
          height={size.height}
          cooldownTicks={cooldownTicks}
          backgroundColor="rgba(0,0,0,0)"
          linkColor={() => colors.link}
          linkWidth={1}
          nodeRelSize={4}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const isActive = node.id === activeId;
            const radius = isActive ? 5 : 3.5;
            const x = node.x ?? 0;
            const y = node.y ?? 0;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = isActive ? colors.nodeActive : colors.node;
            ctx.fill();

            if (globalScale > showLabelsAtZoom) {
              const label = (node.label as string | undefined) ?? String(node.id ?? "");
              ctx.font = `${10 / globalScale}px sans-serif`;
              ctx.textAlign = "center";
              ctx.textBaseline = "top";
              ctx.fillStyle = colors.label;
              ctx.fillText(label, x, y + radius + 2);
            }
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            const x = node.x ?? 0;
            const y = node.y ?? 0;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI, false);
            ctx.fill();
          }}
          onNodeClick={(node) => {
            const url = node.url as string | undefined;
            if (url) router.push(url);
          }}
        />
      )}
    </div>
  );
}

export function LocalGraph({ data, activeId }: { data: GardenGraphData; activeId: string }) {
  return (
    <div className="h-56 rounded-lg border border-border overflow-hidden">
      <GraphView data={data} activeId={activeId} cooldownTicks={80} />
    </div>
  );
}

/** Fetches the pre-built graph.json rather than shipping it inline — keeps the note's initial payload small. */
export function GlobalGraph() {
  const [data, setData] = useState<GardenGraphData | null>(null);

  useEffect(() => {
    fetch("/garden/graph.json")
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ nodes: [], links: [] }));
  }, []);

  if (!data) {
    return <div className="h-full w-full animate-pulse bg-muted/30 rounded-lg" />;
  }

  return <GraphView data={data} />;
}
