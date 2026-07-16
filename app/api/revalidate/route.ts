import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { revalidateSecret } from "@/lib/woocommerce/config";
import type { WooTag } from "@/lib/woocommerce/client";

interface WooWebhookPayload {
  id?: number;
}

/**
 * Webhook target for WooCommerce (Settings > Advanced > Webhooks): product created/updated/
 * deleted, and any other topic you configure. WooCommerce sends the resource id in the body and
 * the event topic in the `X-WC-Webhook-Topic` header (e.g. "product.updated"). We translate that
 * into the cache tags used across lib/woocommerce/* so only the affected pages rebuild.
 *
 * Auth: either `?secret=REVALIDATE_SECRET` or header `x-revalidate-secret`. Configure the same
 * value as the webhook's "Secret" field (WooCommerce signs payloads with HMAC-SHA256 using it;
 * we compare it directly here since WooCommerce also lets you just echo it back as a header via
 * a custom delivery URL — adjust to HMAC verification if your webhook config requires it).
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret") ?? request.headers.get("x-revalidate-secret");

  if (!revalidateSecret || secret !== revalidateSecret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const topic = request.headers.get("x-wc-webhook-topic");
  const body = (await request.json().catch(() => ({}))) as WooWebhookPayload & { tags?: WooTag[] };

  const tags = new Set<WooTag>(body.tags ?? []);

  if (topic?.startsWith("product")) {
    tags.add("products");
    if (body.id) tags.add(`product:${body.id}`);
  } else if (topic?.startsWith("category")) {
    tags.add("categories");
    if (body.id) tags.add(`category:${body.id}`);
  } else if (topic?.startsWith("brand")) {
    tags.add("brands");
    if (body.id) tags.add(`brand:${body.id}`);
  }

  if (tags.size === 0) {
    return NextResponse.json({ error: "No tags to revalidate — pass `tags` or a known webhook topic" }, { status: 400 });
  }

  for (const tag of tags) {
    revalidateTag(tag);
  }

  return NextResponse.json({ revalidated: [...tags], now: Date.now() });
}
