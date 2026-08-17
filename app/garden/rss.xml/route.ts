import { NextResponse } from "next/server";
import { getGardenIndex, recentNotes } from "@/lib/garden";
import { SITE_URL } from "@/lib/garden/config";

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const index = getGardenIndex();
  const notes = recentNotes(index, 30);

  const items = notes
    .map(
      (n) => `
    <item>
      <title>${escapeXml(n.title)}</title>
      <link>${SITE_URL}/garden/${n.slug}</link>
      <guid>${SITE_URL}/garden/${n.slug}</guid>
      <description>${escapeXml(n.description)}</description>
      <pubDate>${new Date(n.date).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Shiladitya Bose — Digital Garden</title>
    <link>${SITE_URL}/garden</link>
    <description>Notes, ideas, and things I'm exploring.</description>${items}
  </channel>
</rss>`;

  return new NextResponse(xml, { headers: { "Content-Type": "application/xml" } });
}
