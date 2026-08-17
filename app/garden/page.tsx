import type { Metadata } from "next";
import Link from "next/link";
import { getGardenIndex, recentNotes } from "@/lib/garden";
import { compileNote } from "@/lib/garden/mdx";
import { buildLinkPreviews } from "@/lib/garden/previews";
import { Backlinks } from "@/components/garden/backlinks";
import { PreviewProvider } from "@/components/garden/note-content";
import { formatDateCompact } from "@/lib/format";

export const metadata: Metadata = {
  title: "Garden | Shiladitya Bose",
  description: "A digital garden of notes, ideas, and things I'm exploring.",
};

export default async function GardenIndexPage() {
  const index = getGardenIndex();
  const rootNote = index.bySlug.get("");

  if (rootNote) {
    const previews = buildLinkPreviews(rootNote, index);
    return (
      <article className="max-w-3xl">
        <PreviewProvider previews={previews}>
          <div className="prose max-w-none">{await compileNote(rootNote, index)}</div>
        </PreviewProvider>
        <Backlinks backlinks={index.backlinks.get(rootNote.id) ?? []} />
      </article>
    );
  }

  const recent = recentNotes(index, 8);

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">Garden</h1>
        <p className="text-sm text-muted-foreground">
          {index.notes.length} note{index.notes.length === 1 ? "" : "s"}. Paste markdown into{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">content/garden/</code> to grow it.
        </p>
      </div>

      {recent.length > 0 && (
        <div>
          <p className="text-xs tracking-[0.25em] text-muted-foreground mb-4 uppercase font-semibold">
            Recent notes
          </p>
          <div className="divide-y divide-border">
            {recent.map((n) => (
              <Link
                key={n.id}
                href={`/garden/${n.slug}`}
                className="flex items-center justify-between py-3 group"
              >
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                  {n.title}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {formatDateCompact(n.date)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link
        href="/garden/graph"
        className="inline-block text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
      >
        View the full graph →
      </Link>
    </div>
  );
}
