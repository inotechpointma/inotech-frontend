"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ title, defaultOpen = false, children, className }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-b border-border/20", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 text-left font-medium"
      >
        {title}
        <span className={cn("transition-transform", open && "rotate-180")}>⌄</span>
      </button>
      {open ? <div className="pb-3">{children}</div> : null}
    </div>
  );
}
