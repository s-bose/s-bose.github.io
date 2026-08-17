#!/usr/bin/env node
// Mirrors every non-markdown file under content/garden/ into
// public/garden/_assets/<same relative path>, so wikilink/markdown image
// and attachment references resolve as static files under output:"export".
// Runs before both `dev` and `next` (pnpm doesn't run npm's `pre*` script
// hooks, so this is chained explicitly in package.json instead).
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const VAULT_DIR = path.join(ROOT, "content/garden");
const OUTPUT_DIR = path.join(ROOT, "public/garden/_assets");
const IGNORED_DIR_NAMES = new Set(["templates", "private", ".obsidian", ".git"]);
const MARKDOWN_EXTENSIONS = new Set([".md", ".mdx"]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORED_DIR_NAMES.has(entry.name.toLowerCase())) continue;
      walk(full, out);
      continue;
    }
    if (MARKDOWN_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) continue;
    out.push(full);
  }
  return out;
}

function syncFile(srcAbs) {
  const rel = path.relative(VAULT_DIR, srcAbs);
  const destAbs = path.join(OUTPUT_DIR, rel);
  const srcStat = fs.statSync(srcAbs);

  let needsCopy = true;
  if (fs.existsSync(destAbs)) {
    const destStat = fs.statSync(destAbs);
    needsCopy = destStat.mtimeMs < srcStat.mtimeMs || destStat.size !== srcStat.size;
  }

  if (needsCopy) {
    fs.mkdirSync(path.dirname(destAbs), { recursive: true });
    fs.copyFileSync(srcAbs, destAbs);
  }
  return rel;
}

function pruneStale(keepRelPaths) {
  if (!fs.existsSync(OUTPUT_DIR)) return;
  const keep = new Set(keepRelPaths);

  function walkOutput(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkOutput(full);
        if (fs.readdirSync(full).length === 0) fs.rmdirSync(full);
        continue;
      }
      const rel = path.relative(OUTPUT_DIR, full);
      if (!keep.has(rel)) fs.rmSync(full);
    }
  }
  walkOutput(OUTPUT_DIR);
}

const files = walk(VAULT_DIR);
const copied = files.map(syncFile);
pruneStale(copied);

console.log(`[garden] synced ${copied.length} asset(s) to public/garden/_assets`);
