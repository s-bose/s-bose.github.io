"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import MiniSearch from "minisearch";
import { Search } from "lucide-react";
import { SEARCH_OPTIONS, type SearchDoc } from "@/lib/garden/search";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mini, setMini] = useState<MiniSearch<SearchDoc> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevQuery, setPrevQuery] = useState(query);
  const fetchingRef = useRef(false);
  const loading = open && !mini;

  // Reset the active result on every query change — done during render
  // (React's documented pattern for "adjusting state on a prop/state
  // change") rather than in an effect, so it doesn't cost an extra commit.
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveIndex(0);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open || mini || fetchingRef.current) return;
    fetchingRef.current = true;
    fetch("/garden/search-index.json")
      .then((res) => res.text())
      .then((json) => setMini(MiniSearch.loadJSON<SearchDoc>(json, SEARCH_OPTIONS)))
      .finally(() => {
        fetchingRef.current = false;
      });
  }, [open, mini]);

  const results = mini && query.trim() ? mini.search(query).slice(0, 8) : [];

  const navigate = useCallback(
    (slug: string) => {
      setOpen(false);
      setQuery("");
      router.push(`/garden/${slug}`);
    },
    [router],
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          aria-label="Search the garden"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-2.5 py-1.5 transition-colors"
        >
          <Search className="size-3.5" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline text-[10px] font-mono border border-border rounded px-1 py-0.5">
            ⌘K
          </kbd>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content
          className="fixed left-1/2 top-24 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-lg border border-border bg-popover shadow-xl animate-fade-up"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            }
            if (e.key === "Enter" && results[activeIndex]) {
              navigate(results[activeIndex].slug);
            }
          }}
        >
          <Dialog.Title className="sr-only">Search the garden</Dialog.Title>
          <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={loading ? "Loading index…" : "Search notes…"}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-80 overflow-y-auto p-1.5">
            {results.length === 0 && query.trim() && (
              <p className="px-3 py-6 text-center text-xs text-muted-foreground">No results.</p>
            )}
            {results.map((r, i) => (
              <button
                key={r.id}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => navigate(r.slug)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md transition-colors",
                  i === activeIndex ? "bg-muted" : "hover:bg-muted/60",
                )}
              >
                <p className="text-sm font-medium text-foreground truncate">{r.title}</p>
                {r.description ? (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{r.description}</p>
                ) : null}
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
