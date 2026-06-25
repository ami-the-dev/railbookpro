import { NextResponse } from "next/server";
import { verifySmtpConfig } from "@/lib/email";

export async function GET() {
  try {
    const result = await verifySmtpConfig();
    return NextResponse.json({ success: true, message: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
