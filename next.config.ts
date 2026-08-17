import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Committed explicitly: actions/configure-pages only recognizes
  // next.config.{js,cjs,mjs} and otherwise overwrites this file with a
  // blank one on every CI run, silently discarding everything below.
  // See .github/workflows/nextjs.yml for the other half of this fix.
  output: "export",
  // Pin the workspace root — a stray package-lock.json in the home directory
  // otherwise wins the automatic lockfile-based root detection.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    // Static export has no image optimization server.
    unoptimized: true,
  },
};

export default nextConfig;
