import { NextResponse } from "next/server";
import { createUser } from "@/lib/auth-store";

export async function POST(req: Request) {
  try {
    const { name, email, phone, password, role } = await req.json();
    if (!name || !email || !phone || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    const user = createUser(name, email, phone, password, role || "user");
    if (!user) {
      return NextResponse.json({ message: "Email or phone already registered" }, { status: 409 });
    }
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
