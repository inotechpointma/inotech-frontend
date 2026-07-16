import Link from "next/link";
import { siteConfig } from "@/config/site";
import { footerNav } from "@/config/navigation";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border/20 bg-surface-alt">
      <div className="container grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="text-lg font-bold text-brand">
            {siteConfig.name}
          </Link>
          <p className="mt-3 text-sm text-ink-muted">{siteConfig.description}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">Boutique</h3>
          <ul className="space-y-2 text-sm text-ink-muted">
            {footerNav.shop.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">Société</h3>
          <ul className="space-y-2 text-sm text-ink-muted">
            {footerNav.company.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">Contact</h3>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li>{siteConfig.contactEmail}</li>
            {siteConfig.whatsappNumber ? (
              <li>
                <a href={`https://wa.me/${siteConfig.whatsappNumber}`} className="hover:text-brand">
                  WhatsApp
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/20 py-4">
        <div className="container text-center text-xs text-ink-muted">
          © {year} {siteConfig.name}. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
