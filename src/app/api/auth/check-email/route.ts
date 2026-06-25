import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/auth-store";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const user = findUserByEmail(email);
    return NextResponse.json({ exists: !!user });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
