import Link from "next/link";
import type { GardenBacklink } from "@/lib/garden/types";

export function Backlinks({ backlinks }: { backlinks: GardenBacklink[] }) {
  return (
    <section className="mt-12 pt-8 border-t border-border">
      <p className="text-xs tracking-[0.25em] text-muted-foreground mb-6 uppercase font-semibold">
        Mentioned by
      </p>
      {backlinks.length === 0 ? (
        <p className="text-sm text-muted-foreground">No backlinks yet.</p>
      ) : (
        <div className="divide-y divide-border">
          {backlinks.map((b) => (
            <Link
              key={b.id}
              href={`/garden/${b.slug}`}
              className="block py-3 group"
            >
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {b.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {b.excerpt}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
