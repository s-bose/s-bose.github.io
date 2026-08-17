"use client";

import { useEffect, useState } from "react";

interface UseActiveIntersectionOptions {
  rootMargin: string;
  threshold?: number;
}

/** Tracks which of the given element ids is currently intersecting the viewport, via one IntersectionObserver per id — the active-heading pattern shared by the nav's scroll-spy and the garden TOC. */
export function useActiveIntersection(
  ids: string[],
  { rootMargin, threshold = 0 }: UseActiveIntersectionOptions,
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const idsKey = ids.join(",");

  useEffect(() => {
    if (ids.length === 0) return;
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin, threshold },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, rootMargin, threshold]);

  return activeId;
}
