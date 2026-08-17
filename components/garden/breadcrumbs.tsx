import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { humanize } from "@/lib/garden/slug";
import type { GardenIndex } from "@/lib/garden/types";

export function Breadcrumbs({ slug, index }: { slug: string; index: GardenIndex }) {
  if (!slug) return null; // hidden on the garden root

  const segments = slug.split("/");
  const crumbs = segments.map((_, i) => {
    const prefixSlug = segments.slice(0, i + 1).join("/");
    const note = index.bySlug.get(prefixSlug);
    return {
      slug: prefixSlug,
      label: note?.title ?? humanize(segments[i]),
      isNote: Boolean(note),
    };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center flex-wrap gap-1.5 text-xs text-muted-foreground">
      <Link href="/garden" className="hover:text-foreground transition-colors">
        Garden
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={crumb.slug} className="flex items-center gap-1.5">
          <ChevronRight className="size-3" />
          {i === crumbs.length - 1 || !crumb.isNote ? (
            <span className={i === crumbs.length - 1 ? "text-foreground" : ""}>{crumb.label}</span>
          ) : (
            <Link href={`/garden/${crumb.slug}`} className="hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
