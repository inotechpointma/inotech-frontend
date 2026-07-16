import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/woocommerce/products";
import { formatPrice } from "@/lib/utils/format-price";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#DC191B", fontWeight: 700 }}>iNoTech</div>
        <div style={{ fontSize: 56, fontWeight: 700, marginTop: 24, color: "#1e1e20", maxWidth: 1000 }}>
          {product?.name ?? "Produit"}
        </div>
        {product ? (
          <div style={{ fontSize: 40, marginTop: 24, color: "#DC191B", fontWeight: 700 }}>
            {formatPrice(product.price)}
          </div>
        ) : null}
      </div>
    ),
    size,
  );
}
