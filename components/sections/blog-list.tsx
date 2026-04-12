import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { formatDateCompact } from "@/lib/format";
import type { BlogPostMeta } from "@/lib/blog";

interface BlogListProps {
  posts: BlogPostMeta[];
}

export function BlogList({ posts }: BlogListProps) {
  const displayPosts = posts.slice(0, 3);

  return (
    <section className="py-12">
      <p className="text-xs tracking-[0.25em] text-muted-foreground mb-8 uppercase font-semibold">
        Blogs
      </p>
      <div className="space-y-7">
        {displayPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex items-start gap-5 hover:opacity-70 transition-opacity duration-200"
          >
            {post.thumbnail && (
              <div className="relative w-20 h-14 shrink-0 overflow-hidden rounded border border-border">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="flex items-start gap-6 flex-1 min-w-0">
              <span className="text-[11px] text-muted-foreground tabular-nums shrink-0 w-20 pt-0.5">
                {formatDateCompact(post.date)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground leading-snug">
                  {post.title}
                </p>
                {post.description && (
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                )}
                <p className="text-[9px] tracking-[0.18em] text-muted-foreground mt-1.5 uppercase">
                  {String(post.readTime ?? 5).padStart(2, "0")} MIN READ &mdash;{" "}
                  [{post.category ?? "GENERAL"}]
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length > 3 && (
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 mt-8 text-[10px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <ArrowUpRight className="size-3" />
          See all posts
        </Link>
      )}
    </section>
  );
}
