"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils/cn";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right" | "bottom";
  title?: string;
  children: React.ReactNode;
}

export function Drawer({ open, onClose, side = "right", title, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const panelSide =
    side === "left"
      ? "left-0 top-0 h-full w-[85%] max-w-sm animate-in slide-in-from-left"
      : side === "bottom"
        ? "bottom-0 left-0 w-full max-h-[85%] rounded-t-lg animate-in slide-in-from-bottom"
        : "right-0 top-0 h-full w-[85%] max-w-sm animate-in slide-in-from-right";

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <button
        aria-label="Fermer"
        className="absolute inset-0 bg-ink/40"
        onClick={onClose}
      />
      <div className={cn("absolute flex flex-col bg-surface shadow-card", panelSide)}>
        {title ? (
          <div className="flex items-center justify-between border-b border-border/20 px-4 py-3">
            <h2 className="font-semibold">{title}</h2>
            <button onClick={onClose} aria-label="Fermer" className="p-1 text-ink-muted">
              ✕
            </button>
          </div>
        ) : null}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
