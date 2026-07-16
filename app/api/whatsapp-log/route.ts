import { NextRequest, NextResponse } from "next/server";

interface WhatsAppLogBody {
  productName?: string;
  sku?: string;
}

/**
 * Fire-and-forget analytics hook for WhatsApp inquiry clicks (see WhatsAppButton.tsx).
 * Logs server-side only; swap the console.log for your analytics/CRM sink of choice.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as WhatsAppLogBody;

  if (!body.productName) {
    return NextResponse.json({ error: "productName is required" }, { status: 400 });
  }

  console.log("[whatsapp-inquiry]", {
    productName: body.productName,
    sku: body.sku ?? null,
    date: new Date().toISOString(),
  });

  return new NextResponse(null, { status: 204 });
}
