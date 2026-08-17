import type { PluggableList } from "unified";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";

import type { GardenIndex, GardenNote } from "./types";
import { expandTransclusions } from "./transclude";
import {
  remarkAdmonitions,
  remarkAssets,
  remarkCallouts,
  remarkEmbed,
  remarkHighlight,
  remarkStripComments,
  remarkTags,
  remarkWikilinks,
} from "./remark";
import { ContentTabs, Tab } from "@/components/mdx/content-tabs";
import { NoteLink, NoteImage } from "@/components/garden/note-content";

const mdxComponents = {
  ContentTabs,
  Tab,
  a: NoteLink,
  img: NoteImage,
};

const rehypePrettyCodeOptions = {
  theme: { dark: "github-dark", light: "github-light" },
  keepBackground: false,
};

/**
 * Compiles one note's markdown into React. Runs outside Turbopack (via
 * next-mdx-remote/rsc in this server component's caller) specifically
 * because remarkWikilinks and remarkAssets are factories closing over the
 * index — non-serializable plugin options Turbopack's Rust MDX loader
 * can't accept.
 */
export async function compileNote(note: GardenNote, index: GardenIndex) {
  const expanded = expandTransclusions(note.raw, note, index);

  const remarkPlugins: PluggableList = [
    remarkStripComments,
    remarkGfm,
    remarkMath,
    remarkDirective,
    remarkCallouts,
    remarkAdmonitions,
    remarkEmbed,
    remarkHighlight,
    [remarkWikilinks, { index, fromId: note.id }],
    remarkTags,
    [remarkAssets, { index, fromId: note.id }],
  ];

  if (note.format === "md") {
    // format:"md" makes @mdx-js/mdx append rehypeRemoveRaw after user
    // rehype plugins, deleting raw HTML with no error. rehype-raw must run
    // FIRST so raw nodes become real elements before the stripper sees them.
    return (
      <MDXRemote
        source={expanded}
        components={mdxComponents}
        options={{
          mdxOptions: {
            format: "md",
            remarkPlugins,
            rehypePlugins: [
              rehypeRaw,
              rehypeSlug,
              [rehypePrettyCode, rehypePrettyCodeOptions],
              rehypeKatex,
            ],
          },
        }}
      />
    );
  }

  return (
    <MDXRemote
      source={expanded}
      components={mdxComponents}
      options={{
        mdxOptions: {
          format: "mdx",
          remarkPlugins,
          rehypePlugins: [rehypeSlug, [rehypePrettyCode, rehypePrettyCodeOptions], rehypeKatex],
        },
        // next-mdx-remote@6 defaults blockJS:true, which strips MDX
        // expressions AND JSX attribute values that are expressions
        // (e.g. style={{...}}). Vault .mdx content needs those to work.
        blockJS: false,
        blockDangerousJS: true,
      }}
    />
  );
}
