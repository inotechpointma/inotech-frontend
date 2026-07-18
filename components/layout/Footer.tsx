import Link from "next/link";
import { siteConfig } from "@/config/site";
import { footerNav } from "@/config/navigation";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer">
      <div className="container footer-main">
        <div className="footer-about">
          <Link className="logo" href="/" style={{ color: "var(--primary-900)" }}>
            <span className="logo-mark">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M8 8h16v16H8z" />
                <path d="M12 13h8M12 18h5" />
              </svg>
            </span>
            <span>{siteConfig.shortName}</span>
          </Link>
          <p>{siteConfig.description}</p>
        </div>

        <div className="footer-col">
          <h3>Catalogue</h3>
          {footerNav.catalogue.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer-col">
          <h3>Services</h3>
          {footerNav.services.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer-col">
          <h3>Nous contacter</h3>
          {siteConfig.phone ? <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>{siteConfig.phone}</a> : null}
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          <span>{siteConfig.address}</span>
          <span>Lundi–Samedi, 9h–18h</span>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {year} {siteConfig.shortName}.ma — commande directe par WhatsApp, sans passerelle de paiement.
        </span>
        <div className="payment-badges" aria-label="Moyens de contact">
          <span className="payment-badge">WhatsApp</span>
          <span className="payment-badge">Sur devis</span>
        </div>
      </div>
    </footer>
  );
}
