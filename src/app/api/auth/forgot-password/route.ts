import { NextResponse } from "next/server";
import { createResetToken } from "@/lib/auth-store";
import { sendResetPasswordEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const token = createResetToken(email);
    if (!token) {
      return NextResponse.json({ error: "Email not registered. Please create an account first." }, { status: 404 });
    }
    console.log(`[ForgotPassword] Reset token for ${email}: ${token}`);
    try {
      await sendResetPasswordEmail(email, token);
      return NextResponse.json({ message: "Password reset link has been sent to your email" });
    } catch (emailError) {
      console.error(`[ForgotPassword] Failed to send email to ${email}:`, emailError);
      const msg = emailError instanceof Error ? emailError.message : String(emailError);
      return NextResponse.json({
        error: "Failed to send email. Check SMTP configuration in .env.local",
        detail: msg,
      }, { status: 500 });
    }
  } catch (err) {
    console.error("[ForgotPassword] Uncaught error:", err instanceof Error ? err.stack : err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
