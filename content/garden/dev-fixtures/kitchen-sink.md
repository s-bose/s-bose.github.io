---
title: "Kitchen Sink"
tags: [meta, test]
description: "Regression fixture exercising every garden pipeline feature."
---

Kitchen-sink fixture for the garden markdown pipeline. See the plan's
verification section for what each part of this file is checking.

## Callouts

> [!note] A note callout
> Some note content.

> [!tip] A tip callout
> Some tip content.

> [!warning] A warning callout
> Some warning content.

> [!danger] A danger callout
> Some danger content.

> [!faq]- A foldable callout (collapsed by default)
> This uses the `-` fold marker, so it should render as a closed
> `<details>` with a clickable `<summary>`.

## Inline formatting

Some ==highlighted text== using Obsidian's highlight syntax, plus a
literal HTML tag: <sup>x</sup> (rehype-raw canary — .md raw HTML must
survive rehypeRemoveRaw).

Inline tags: #status-wip and #1 (the numeric one should NOT be styled
as a tag).

## Lists

- [x] Done item
- [ ] Not done item

## Footnote

Here is a sentence with a footnote.[^1]

[^1]: This is the footnote content.

## Table

| Column A | Column B |
| -------- | -------- |
| 1        | 2        |

## Math

Inline math: $E = mc^2$.

Display math:

$$
\int_0^\infty e^{-x}\,dx = 1
$$

## Code

```ts
function add(a: number, b: number) {
  return a + b;
}
```

A literal comparison in prose that must survive `.md` mode untouched:
`if (a < b) { return a; }` — note the raw `<` and `{`/`}`, which would
break MDX parsing in `.mdx` mode but must render as plain text here.

## Wikilinks

- Bare: [[companion]]
- Full path + alias: [[dev-fixtures/companion|Companion]]
- Heading link: [[companion#Background]]

## Transclusion

Full note:

![[companion]]

Section only (should include "Background" but not "Details"):

![[companion#Background]]

