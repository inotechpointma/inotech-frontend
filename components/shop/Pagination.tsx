import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export function Pagination({ currentPage, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1,
  );

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-1">
      {currentPage > 1 ? (
        <Link href={buildHref(currentPage - 1)} className="rounded px-3 py-2 text-sm hover:bg-surface-alt">
          Précédent
        </Link>
      ) : null}

      {pages.map((page, index) => {
        const prevPage = pages[index - 1];
        const showEllipsis = prevPage !== undefined && page - prevPage > 1;
        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis ? <span className="px-1 text-ink-muted">…</span> : null}
            <Link
              href={buildHref(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded text-sm",
                page === currentPage ? "bg-brand text-white" : "hover:bg-surface-alt",
              )}
            >
              {page}
            </Link>
          </span>
        );
      })}

      {currentPage < totalPages ? (
        <Link href={buildHref(currentPage + 1)} className="rounded px-3 py-2 text-sm hover:bg-surface-alt">
          Suivant
        </Link>
      ) : null}
    </nav>
  );
}
