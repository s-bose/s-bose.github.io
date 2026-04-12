import fs from "fs";
import path from "path";
import matter from "gray-matter";
export { formatDate } from "@/lib/format";

const contentDir = path.join(process.cwd(), "content/blog");

function calcReadTime(content: string): number {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description?: string;
  category?: string;
  thumbnail?: string;
  readTime?: number;
  content: string;
}

export type BlogPostMeta = Omit<BlogPost, "content">;

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(contentDir)) return [];
  const files = fs.readdirSync(contentDir);
  return files
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const fullPath = path.join(contentDir, file);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        description: data.description ?? "",
        category: data.category ?? "GENERAL",
        thumbnail: data.thumbnail ?? undefined,
        readTime: calcReadTime(content),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost {
  const fullPath = path.join(contentDir, `${slug}.mdx`);
  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContent);
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    description: data.description ?? "",
    category: data.category ?? "GENERAL",
    thumbnail: data.thumbnail ?? undefined,
    readTime: calcReadTime(content),
    content,
  };
}
