import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";

export const metadata = {
    title: "Blog",
    description: "All posts",
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-2xl px-6">
                <Nav />
                <main className="py-8">
                    <h1 className="text-2xl font-semibold tracking-tight mb-8">
                        All Posts
                    </h1>
                    {posts.length === 0 ? (
                        <p className="text-muted-foreground text-sm">
                            No posts yet.
                        </p>
                    ) : (
                        <div className="space-y-0">
                            {posts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="group flex items-baseline gap-6 py-3 border-b border-border/40 last:border-0 hover:opacity-80 transition-opacity duration-200"
                                >
                                    <span className="text-sm text-muted-foreground tabular-nums shrink-0 w-32">
                                        {formatDate(post.date)}
                                    </span>
                                    <span className="text-sm text-foreground group-hover:text-foreground/80 transition-colors duration-200">
                                        {post.title}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </div>
    );
}
