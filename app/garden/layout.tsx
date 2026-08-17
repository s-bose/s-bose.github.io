import type { ReactNode } from "react";
import "katex/dist/katex.min.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Explorer } from "@/components/garden/explorer";
import { CommandPalette } from "@/components/garden/command-palette";
import { ReadingProgress } from "@/components/garden/reading-progress";
import { getGardenIndex } from "@/lib/garden";
import { buildTree } from "@/lib/garden/graph";

export default function GardenLayout({ children }: { children: ReactNode }) {
  const index = getGardenIndex();
  const tree = buildTree(index);

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <div className="mx-auto max-w-7xl px-4">
        <Nav />
        <div className="flex items-center justify-between py-4 border-b border-border">
          <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase font-semibold">
            Digital Garden
          </p>
          <CommandPalette />
        </div>
        <div className="flex gap-10 py-8">
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-8 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
              <Explorer tree={tree} />
            </div>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
