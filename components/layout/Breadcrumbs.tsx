import Link from "next/link";
import { breadcrumbJsonLd, type BreadcrumbEntry } from "@/lib/seo/json-ld";

export function Breadcrumbs({ items }: { items: BreadcrumbEntry[] }) {
  const withHome: BreadcrumbEntry[] = [{ name: "Accueil", href: "/" }, ...items];

  return (
    <nav aria-label="Fil d'Ariane" className="py-3 text-sm text-ink-muted">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(withHome)) }}
      />
      <ol className="flex flex-wrap items-center gap-1">
        {withHome.map((item, index) => {
          const isLast = index === withHome.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 ? <span aria-hidden>/</span> : null}
              {isLast ? (
                <span className="text-ink" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-brand">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
