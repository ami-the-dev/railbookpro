import { NextResponse } from "next/server";
import { createBooking } from "@/lib/api/booking";
import type { BookingRequest } from "@/lib/api/booking";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const bookingReq: BookingRequest = { ...body, tatkal: true, quota: body.quota || "TQ" };
    const result = await createBooking(bookingReq);
    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Tatkal booking failed" }, { status: 500 });
  }
}
