import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGardenIndex } from "@/lib/garden";
import { compileNote } from "@/lib/garden/mdx";
import { buildGraphData, neighborhood } from "@/lib/garden/graph";
import { buildLinkPreviews } from "@/lib/garden/previews";
import { LOCAL_GRAPH_CAP, LOCAL_GRAPH_DEPTH } from "@/lib/garden/config";
import { Breadcrumbs } from "@/components/garden/breadcrumbs";
import { Backlinks } from "@/components/garden/backlinks";
import { TableOfContents } from "@/components/garden/toc";
import { LocalGraph } from "@/components/garden/graph-view";
import { PreviewProvider } from "@/components/garden/note-content";
import { formatDate } from "@/lib/format";

export const dynamicParams = false;

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const index = getGardenIndex();
  return index.notes.filter((n) => n.slug !== "").map((n) => ({ slug: n.slug.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const index = getGardenIndex();
  const note = index.bySlug.get(slug.join("/"));
  if (!note) return { title: "Not found" };
  return {
    title: `${note.title} | Garden`,
    description: note.description,
    keywords: note.tags,
  };
}

export default async function GardenNotePage({ params }: Props) {
  const { slug } = await params;
  const index = getGardenIndex();
  const note = index.bySlug.get(slug.join("/"));
  if (!note) notFound();

  const previews = buildLinkPreviews(note, index);
  const graph = buildGraphData(index);
  const localGraphData = neighborhood(graph, note.id, LOCAL_GRAPH_DEPTH, LOCAL_GRAPH_CAP);
  const backlinks = index.backlinks.get(note.id) ?? [];

  return (
    <div className="flex gap-10">
      <article className="flex-1 min-w-0 max-w-3xl">
        <Breadcrumbs slug={note.slug} index={index} />

        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{note.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
            <span>{formatDate(note.date)}</span>
            <span aria-hidden>·</span>
            <span>{note.readTime} min read</span>
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] tracking-wide border border-border px-1.5 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <PreviewProvider previews={previews}>
          <div className="prose max-w-none">{await compileNote(note, index)}</div>
        </PreviewProvider>

        <Backlinks backlinks={backlinks} />
      </article>

      <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-8 space-y-8 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
          <TableOfContents headings={note.headings} />
          <div>
            <p className="text-xs tracking-[0.25em] text-muted-foreground mb-3 uppercase font-semibold">
              Local graph
            </p>
            <LocalGraph data={localGraphData} activeId={note.id} />
          </div>
        </div>
      </aside>
    </div>
  );
}
