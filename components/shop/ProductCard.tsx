import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ProductPrice } from "@/components/product/ProductPrice";
import { WishlistButton } from "@/components/shop/WishlistButton";
import { productHref } from "@/lib/utils/slug";
import type { WCProduct } from "@/lib/woocommerce/types";

export function ProductCard({ product }: { product: WCProduct }) {
  const image = product.images[0];
  const brand = product.brands?.[0];
  const regular = Number(product.regular_price);
  const current = Number(product.price);
  const percentOff = regular > 0 && current < regular ? Math.round(((regular - current) / regular) * 100) : null;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border/15 bg-surface">
      <div className="relative aspect-square overflow-hidden bg-surface-alt">
        <Link href={productHref(product.slug)} className="block h-full w-full">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt || product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain p-4 transition-transform group-hover:scale-105"
            />
          ) : null}
        </Link>

        <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1">
          {product.on_sale ? <Badge tone="sale">{percentOff ? `-${percentOff}%` : "Promo"}</Badge> : null}
          {product.stock_status !== "instock" ? <Badge tone="outofstock">Rupture</Badge> : null}
        </div>

        <WishlistButton
          className="absolute right-2 top-2"
          item={{ id: product.id, slug: product.slug, name: product.name, price: product.price, image: image?.src ?? null }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        {brand ? <span className="text-xs uppercase tracking-wide text-ink-muted">{brand.name}</span> : null}

        <Link href={productHref(product.slug)} className="line-clamp-2 text-sm font-medium hover:text-brand">
          {product.name}
        </Link>

        {product.average_rating !== "0.00" ? (
          <div className="text-xs text-ink-muted" aria-label={`Note ${product.average_rating} sur 5`}>
            {"★".repeat(Math.round(Number(product.average_rating)))}
            {"☆".repeat(5 - Math.round(Number(product.average_rating)))}
            <span className="ml-1">({product.rating_count})</span>
          </div>
        ) : null}

        <div className="mt-auto pt-2">
          <ProductPrice price={product.price} regularPrice={product.regular_price} onSale={product.on_sale} />
        </div>
      </div>
    </article>
  );
}
