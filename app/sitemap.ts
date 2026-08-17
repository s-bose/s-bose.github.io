import type { MetadataRoute } from "next";
import { getGardenIndex } from "@/lib/garden";
import { SITE_URL } from "@/lib/garden/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const index = getGardenIndex();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now },
    { url: `${SITE_URL}/projects`, lastModified: now },
    { url: `${SITE_URL}/experience`, lastModified: now },
    { url: `${SITE_URL}/garden`, lastModified: now },
    { url: `${SITE_URL}/garden/graph`, lastModified: now },
  ];

  const noteRoutes: MetadataRoute.Sitemap = index.notes
    .filter((n) => n.slug !== "")
    .map((n) => ({
      url: `${SITE_URL}/garden/${n.slug}`,
      lastModified: new Date(n.modified),
    }));

  return [...staticRoutes, ...noteRoutes];
}
