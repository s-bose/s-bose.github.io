"use client";

import { cn } from "@/lib/utils";
import { useActiveIntersection } from "@/hooks/use-active-intersection";
import type { GardenHeading } from "@/lib/garden/types";

export function TableOfContents({ headings }: { headings: GardenHeading[] }) {
  const items = headings.filter((h) => h.depth >= 2 && h.depth <= 3);
  const activeId = useActiveIntersection(
    items.map((h) => h.id),
    { rootMargin: "-10% 0px -70% 0px" },
  );

  if (items.length === 0) return null;

  return (
    <nav aria-label="On this page">
      <p className="text-xs tracking-[0.25em] text-muted-foreground mb-4 uppercase font-semibold">
        On this page
      </p>
      <ul className="space-y-2 text-xs">
        {items.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.depth - 2) * 0.75}rem` }}>
            <a
              href={`#${h.id}`}
              className={cn(
                "block transition-colors duration-150 leading-relaxed",
                activeId === h.id ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
