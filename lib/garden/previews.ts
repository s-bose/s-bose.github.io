import type { GardenIndex, GardenNote } from "./types";
import type { LinkPreview } from "@/components/garden/note-content";

/** Preview data for a note's own outgoing links only — see PreviewProvider. */
export function buildLinkPreviews(note: GardenNote, index: GardenIndex): Record<string, LinkPreview> {
  const previews: Record<string, LinkPreview> = {};
  for (const targetId of note.forwardLinks) {
    const target = index.byId.get(targetId);
    if (!target) continue;
    previews[`/garden/${target.slug}`] = {
      title: target.title,
      description: target.description,
      tags: target.tags,
    };
  }
  return previews;
}
