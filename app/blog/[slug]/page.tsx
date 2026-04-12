import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    try {
        const post = getPostBySlug(slug);
        return {
            title: post.title,
            description: post.description,
        };
    } catch {
        return { title: "Post not found" };
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;

    let post;
    try {
        post = getPostBySlug(slug);
    } catch {
        notFound();
    }

    return (
        <article className="w-full">
            <div className="mb-8">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6 group"
                >
                    <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
                    back
                </Link>
                <p className="text-sm text-muted-foreground mb-2">
                    {formatDate(post.date)}
                </p>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    {post.title}
                </h1>
                {post.description && (
                    <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                        {post.description}
                    </p>
                )}
            </div>

            <hr className="border-border mb-8" />

            <div className="prose max-w-none">
                <MDXRemote
                    source={post.content}
                    options={{
                        mdxOptions: {
                            remarkPlugins: [remarkGfm],
                            rehypePlugins: [
                                [
                                    rehypePrettyCode,
                                    {
                                        theme: {
                                            dark: "github-dark",
                                            light: "github-light",
                                        },
                                        keepBackground: false,
                                    },
                                ],
                            ],
                        },
                    }}
                />
            </div>
        </article>
    );
}
