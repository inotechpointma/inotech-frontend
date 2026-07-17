"use client";

import { useEffect, useState } from "react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut de la page"
      className="fixed bottom-5 left-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-ink/80 text-white shadow-lg hover:bg-ink"
    >
      <span aria-hidden>↑</span>
    </button>
  );
}
