"use client";

import { createContext, useContext, type AnchorHTMLAttributes, type ImgHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { HoverCard } from "radix-ui";
import { cn } from "@/lib/utils";

export interface LinkPreview {
  title: string;
  description: string;
  tags: string[];
}

const PreviewContext = createContext<Record<string, LinkPreview>>({});

/**
 * Carries hover-card preview data for the current note's outgoing links
 * only — the server page already knows what it links to, so this ships
 * ~200 bytes per link instead of fetching or shipping the whole vault.
 */
export function PreviewProvider({
  previews,
  children,
}: {
  previews: Record<string, LinkPreview>;
  children: ReactNode;
}) {
  return <PreviewContext.Provider value={previews}>{children}</PreviewContext.Provider>;
}

function useLinkPreview(href: string): LinkPreview | undefined {
  const previews = useContext(PreviewContext);
  return previews[href];
}

type NoteLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  "data-wikilink"?: string;
};

/**
 * The `a` override for compiled note MDX. Internal links use next/link;
 * links carrying `data-wikilink` (set by remarkWikilinks) get a Radix
 * hover card if the page supplied a preview for that href via
 * PreviewProvider. Broken wikilinks never reach this component — they
 * render as `<span data-garden-broken>`, styled in globals.css.
 */
export function NoteLink({ href = "", children, className, ...rest }: NoteLinkProps) {
  const isWikilink = rest["data-wikilink"] !== undefined;
  const isInternal = href.startsWith("/") || href.startsWith("#");
  const preview = useLinkPreview(href);

  const linkClassName = cn(
    "underline underline-offset-[3px] decoration-[color-mix(in_oklch,var(--foreground)_40%,transparent)] hover:decoration-foreground transition-colors duration-150",
    isWikilink && "text-primary decoration-primary/40 hover:decoration-primary",
    className,
  );

  const anchor = isInternal ? (
    <Link href={href} className={linkClassName}>
      {children}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
      {children}
    </a>
  );

  if (!isWikilink || !preview) return anchor;

  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>{anchor}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          side="top"
          sideOffset={6}
          className="z-50 w-72 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-lg animate-fade-in"
        >
          <p className="text-sm font-semibold text-foreground mb-1">{preview.title}</p>
          {preview.description && (
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
              {preview.description}
            </p>
          )}
          {preview.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {preview.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono tracking-wide text-muted-foreground border border-border px-1.5 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <HoverCard.Arrow className="fill-popover" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

/**
 * Plain <img>, not next/image: vault attachments have unknown dimensions
 * and images.unoptimized is already set for static export, so next/image
 * buys nothing here while requiring width/height we don't have.
 */
export function NoteImage({ src, alt, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" {...rest} />;
}
