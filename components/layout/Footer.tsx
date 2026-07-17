import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { footerNav } from "@/config/navigation";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border/20 bg-surface-alt">
      <div className="container grid grid-cols-2 gap-8 py-12 md:grid-cols-5">
        <div className="col-span-2 md:col-span-2">
          <Link href="/" className="flex items-center">
            <Image src="/logo-dark.svg" alt={siteConfig.shortName} width={140} height={35} className="h-8 w-auto" />
          </Link>
          <p className="mt-3 max-w-xs text-sm text-ink-muted">{siteConfig.description}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-heading font-semibold">Qui sommes-nous ?</h3>
          <ul className="space-y-2 text-sm text-ink-muted">
            {footerNav.about.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-heading font-semibold">Acheter</h3>
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
          <h3 className="mb-3 text-sm font-heading font-semibold">Contact</h3>
          <ul className="space-y-2 text-sm text-ink-muted">
            <li>Adresse : {siteConfig.address}</li>
            <li>
              Email :{" "}
              <a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-brand">
                {siteConfig.contactEmail}
              </a>
            </li>
            {siteConfig.phone ? (
              <li>
                Téléphone :{" "}
                <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="hover:text-brand">
                  {siteConfig.phone}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/20 py-6">
        <div className="container flex flex-col items-center justify-between gap-3 text-xs text-ink-muted sm:flex-row">
          <div className="flex items-center gap-2">
            <span aria-hidden>🔒</span>
            Paiement 100% sécurisé — commande directe par WhatsApp, sans CB.
          </div>
          <span>
            {siteConfig.shortName} © {year}
          </span>
        </div>
      </div>
    </footer>
  );
}
