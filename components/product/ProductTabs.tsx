"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type Tab = { id: string; label: string; content: React.ReactNode };

/** Fixed tab structure in code (Description | Specs | Reviews | FAQ); content is 100% from Woo. */
export function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  return (
    <div>
      <div role="tablist" className="flex flex-wrap gap-1 border-b border-border/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "border-b-2 px-4 py-3 text-sm font-medium",
              active === tab.id ? "border-brand text-brand" : "border-transparent text-ink-muted hover:text-ink",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) =>
        tab.id === active ? (
          <div key={tab.id} role="tabpanel" className="py-6">
            {tab.content}
          </div>
        ) : null,
      )}
    </div>
  );
}
