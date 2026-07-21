import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/shop/ProductCard";
import type { WCProduct } from "@/lib/woocommerce/types";

export interface CampaignPanelContent {
  eyebrow?: string;
  title?: string;
  description?: string;
  cta?: { label: string; href: string };
  image?: { src: string; alt: string };
}

const DEFAULT_CAMPAIGN: CampaignPanelContent = {
  title: "Découvrez notre sélection de produits performants.",
  description:
    "Une sélection de produits performants pour chaque usage, soigneusement choisis pour répondre à vos besoins.",
  cta: { label: "Explorer les produits", href: "/shop" },
  image: { src: "/hero/default-campaign.svg", alt: "Campaign image" }
};

/**
 * #popular section: editorial campaign panel (static/props, per brief) beside a real product
 * grid — capped to 6 cards to match the design system's "Popular product grid" pattern.
 */
export function CampaignSection({
  id,
  title,
  subtitle,
  products,
  campaign = DEFAULT_CAMPAIGN,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  products: WCProduct[];
  campaign?: CampaignPanelContent;
}) {
  if (products.length === 0) return null;

  return (
    <section className="section" id={id}>
      <div className="container merch-grid">
        
          <article className="campaign-panel">
            {campaign.eyebrow && <span className="eyebrow">{campaign.eyebrow}</span>}
            <h2>{campaign.title}</h2>
            <p>{campaign.description}</p>
            {campaign.cta && (
              <Link className="btn btn-primary" href={campaign.cta.href}>
                {campaign.cta.label}
              </Link>
            )}
            {campaign.image && (
              <Image src={campaign.image.src} alt={campaign.image.alt} width={600} height={400} />
            )}
          </article>

        <div className="tab-shell">
          <div className="section-title-row">
            <div>
              <h2>{title}</h2>
              {subtitle ? <p>{subtitle}</p> : null}
            </div>
          </div>
          <div className="popular-grid">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
