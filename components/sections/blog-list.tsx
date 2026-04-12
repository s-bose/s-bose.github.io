import Link from "next/link";
import { formatDateCompact } from "@/lib/format";
import type { BlogPostMeta } from "@/lib/blog";

interface BlogListProps {
  posts: BlogPostMeta[];
}

export function BlogList({ posts }: BlogListProps) {
  return (
    <section className="py-12">
      <p className="text-[9px] tracking-[0.2em] text-muted-foreground mb-8 uppercase">
        Latest Intelligence
      </p>
      <div className="space-y-7">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex items-start gap-8 hover:opacity-70 transition-opacity duration-200"
          >
            <span className="text-[11px] text-muted-foreground tabular-nums shrink-0 w-20 pt-0.5">
              {formatDateCompact(post.date)}
            </span>
            <div>
              <p className="text-sm font-bold text-foreground leading-snug">
                {post.title}
              </p>
              <p className="text-[9px] tracking-[0.18em] text-muted-foreground mt-1.5 uppercase">
                {String(post.readTime ?? 5).padStart(2, "0")} MIN READ &mdash;{" "}
                [{post.category ?? "GENERAL"}]
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
