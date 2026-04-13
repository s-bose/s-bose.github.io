import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkFrontmatter from "remark-frontmatter";
import remarkDirective from "remark-directive";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeKatex from "rehype-katex";
import { visit } from "unist-util-visit";
import { ContentTabs, Tab } from "@/components/mdx/content-tabs";

const ADMONITION_TYPES = ["note", "tip", "warning", "danger", "info"];

function remarkAdmonitions() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (tree: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    visit(tree, "containerDirective", (node: any) => {
      const type: string = node.name;
      if (!ADMONITION_TYPES.includes(type)) return;
      const label = type.charAt(0).toUpperCase() + type.slice(1);
      node.data = {
        ...node.data,
        hName: "div",
        hProperties: {
          ...node.data?.hProperties,
          "data-admonition-name": type,
          "data-admonition-label": label,
          role: "note",
        },
      };
    });
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mdxOptions: Record<string, any> = {
  remarkPlugins: [
    remarkGfm,
    remarkMath,
    remarkFrontmatter,
    remarkDirective,
    remarkAdmonitions,
  ],
  rehypePlugins: [
    [
      rehypePrettyCode,
      {
        theme: { dark: "github-dark", light: "github-light" },
        keepBackground: false,
      },
    ],
    rehypeKatex,
  ],
};

const components = { ContentTabs, Tab };

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
          options={{ mdxOptions } as never}
          components={components}
        />
      </div>
    </article>
  );
}
