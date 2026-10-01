import { NextResponse } from "next/server";
import { confirmPayment } from "@/lib/payments";

async function handle(request: Request) {
  const url = new URL(request.url);
  let paymentId = url.searchParams.get("data.id") || url.searchParams.get("id");
  if (request.method === "POST") {
    const body = await request.json().catch(() => ({}));
    if (body?.data?.id) paymentId = String(body.data.id);
  }
  const topic = url.searchParams.get("topic") || url.searchParams.get("type");
  if (topic && topic !== "payment" && topic !== "payment.updated") {
    return NextResponse.json({ ok: true });
  }
  if (paymentId) {
    const result = await confirmPayment(paymentId);
    if (result === "retry") return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export function GET(request: Request) {
  return handle(request);
}

export function POST(request: Request) {
  return handle(request);
}
