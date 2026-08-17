"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Collapsible } from "radix-ui";
import { ChevronRight, FileText, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { humanize } from "@/lib/garden/slug";
import type { TreeNode } from "@/lib/garden/graph";

const STORAGE_KEY = "garden:explorer";

function loadOpenState(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function Explorer({ tree }: { tree: TreeNode }) {
  const pathname = usePathname();
  const [openState, setOpenState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setOpenState(loadOpenState());
  }, []);

  const toggle = (slug: string, currentlyOpen: boolean) => {
    setOpenState((prev) => {
      const next = { ...prev, [slug]: !currentlyOpen };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <nav aria-label="Garden explorer" className="text-xs">
      <ul className="space-y-0.5">
        {tree.children.map((child) => (
          <TreeItem
            key={child.slug}
            node={child}
            depth={0}
            openState={openState}
            onToggle={toggle}
            pathname={pathname}
          />
        ))}
      </ul>
    </nav>
  );
}

function TreeItem({
  node,
  depth,
  openState,
  onToggle,
  pathname,
}: {
  node: TreeNode;
  depth: number;
  openState: Record<string, boolean>;
  onToggle: (slug: string, currentlyOpen: boolean) => void;
  pathname: string;
}) {
  const isFolder = node.children.length > 0;
  const href = `/garden/${node.slug}`;
  const isActive = pathname === href;

  if (!isFolder) {
    return (
      <li>
        <Link
          href={href}
          style={{ paddingLeft: `${depth * 0.9 + 1.15}rem` }}
          className={cn(
            "flex items-center gap-1.5 py-1 rounded-sm transition-colors truncate",
            isActive
              ? "text-foreground font-medium bg-muted"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
          )}
        >
          <FileText className="size-3 shrink-0" />
          <span className="truncate">{node.title ?? node.name}</span>
        </Link>
      </li>
    );
  }

  const open = node.slug in openState ? openState[node.slug] : pathname.startsWith(href);

  return (
    <li>
      <Collapsible.Root open={open}>
        <div className="flex items-center gap-0.5">
          <Collapsible.Trigger asChild>
            <button
              aria-label={open ? "Collapse folder" : "Expand folder"}
              onClick={() => onToggle(node.slug, open)}
              style={{ marginLeft: `${depth * 0.9}rem` }}
              className="p-0.5 rounded-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ChevronRight className={cn("size-3 transition-transform duration-150", open && "rotate-90")} />
            </button>
          </Collapsible.Trigger>
          {node.title ? (
            <Link
              href={href}
              className={cn(
                "flex-1 flex items-center gap-1.5 py-1 rounded-sm transition-colors truncate",
                isActive
                  ? "text-foreground font-medium bg-muted"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              <Folder className="size-3 shrink-0" />
              <span className="truncate">{node.title}</span>
            </Link>
          ) : (
            <button
              onClick={() => onToggle(node.slug, open)}
              className="flex-1 flex items-center gap-1.5 py-1 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors truncate text-left"
            >
              <Folder className="size-3 shrink-0" />
              <span className="truncate">{humanize(node.name)}</span>
            </button>
          )}
        </div>
        <Collapsible.Content>
          <ul className="space-y-0.5 mt-0.5">
            {node.children.map((child) => (
              <TreeItem
                key={child.slug}
                node={child}
                depth={depth + 1}
                openState={openState}
                onToggle={onToggle}
                pathname={pathname}
              />
            ))}
          </ul>
        </Collapsible.Content>
      </Collapsible.Root>
    </li>
  );
}
