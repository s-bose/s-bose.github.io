"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface TabProps {
  label: string;
  children?: ReactNode;
}

// Tab is a marker component — ContentTabs reads its props directly
export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

interface ContentTabsProps {
  children?: ReactNode;
}

export function ContentTabs({ children }: ContentTabsProps) {
  const tabs = Array.isArray(children) ? children : children ? [children] : [];
  const [active, setActive] = useState(0);

  return (
    <div className="my-4 rounded-lg border border-border overflow-hidden">
      <div className="flex border-b border-border bg-muted/40">
        {tabs.map((tab, i) => {
          const label =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (tab as any)?.props?.label ?? `Tab ${i + 1}`;
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`px-4 py-2 text-xs font-semibold transition-colors border-r border-border last:border-r-0 ${
                active === i
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="p-4">{tabs[active]}</div>
    </div>
  );
}
