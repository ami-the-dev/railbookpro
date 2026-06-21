import { NextResponse } from "next/server";
import { createResetToken } from "@/lib/auth-store";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const token = createResetToken(email);
    if (token) {
      console.log(`[ForgotPassword] Reset token for ${email}: ${token}`);
    }
    return NextResponse.json({ message: "If the email exists, a reset link has been sent" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
