export interface BookingRequest {
  train_number: string;
  train_name: string;
  from_station: string;
  to_station: string;
  date: string;
  class: string;
  quota: string;
  tatkal: boolean;
  passengers: { name: string; age: number; gender: string; berth_pref: string }[];
  payment_method: string;
}

export interface BookingResponse {
  status: boolean;
  pnr: string;
  train_number: string;
  train_name: string;
  from: string;
  to: string;
  travel_date: string;
  class: string;
  quota: string;
  booking_status: string;
  seat: string;
  total_fare: number;
  message: string;
}

const WIREMOCK_URL = process.env.WIREMOCK_URL || process.env.NEXT_PUBLIC_WIREMOCK_URL || "";

async function wiremockFetch(path: string, options?: RequestInit): Promise<Response | null> {
  if (!WIREMOCK_URL) return null;
  try {
    return await fetch(`${WIREMOCK_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    });
  } catch {
    return null;
  }
}

function generateMockPNR(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

const mockBookings: Map<string, BookingResponse> = new Map();

const baseFare: Record<string, number> = { "1A": 2500, "2A": 1500, "3A": 1000, SL: 450, "2S": 200 };
const tatkalCharges: Record<string, number> = { "1A": 400, "2A": 300, "3A": 200, SL: 100, "2S": 50 };

export async function createBooking(req: BookingRequest): Promise<BookingResponse> {
  const wm = await wiremockFetch("/api/book", {
    method: "POST",
    body: JSON.stringify(req),
  });
  if (wm?.ok) return wm.json();

  await new Promise((r) => setTimeout(r, 300));

  const pnr = generateMockPNR();
  const farePerSeat = baseFare[req.class] || 500;
  const tatkalPerSeat = req.tatkal ? (tatkalCharges[req.class] || 100) : 0;
  const total = (farePerSeat + tatkalPerSeat) * req.passengers.length;

  const booking: BookingResponse = {
    status: true,
    pnr,
    train_number: req.train_number,
    train_name: req.train_name,
    from: req.from_station,
    to: req.to_station,
    travel_date: req.date,
    class: req.class,
    quota: req.tatkal ? "TQ" : req.quota,
    booking_status: "CONFIRMED",
    seat: `S4/34-${req.passengers[0]?.berth_pref || "LB"}`,
    total_fare: total,
    message: req.tatkal ? "Tatkal booking confirmed" : "Booking confirmed successfully",
  };

  mockBookings.set(pnr, booking);
  return booking;
}

export async function cancelBooking(pnr: string): Promise<{ status: boolean; refund: number; message: string }> {
  const wm = await wiremockFetch("/api/cancel", {
    method: "POST",
    body: JSON.stringify({ pnr }),
  });
  if (wm?.ok) return wm.json();

  await new Promise((r) => setTimeout(r, 300));

  const booking = mockBookings.get(pnr);
  if (!booking) {
    return { status: false, refund: 0, message: "Booking not found" };
  }

  const refund = Math.round(booking.total_fare * 0.75);
  mockBookings.delete(pnr);

  return { status: true, refund, message: `Booking cancelled. Refund of ₹${refund} initiated.` };
}

export async function getBooking(pnr: string): Promise<BookingResponse | null> {
  const wm = await wiremockFetch(`/api/booking/${pnr}`);
  if (wm?.ok) return wm.json();

  await new Promise((r) => setTimeout(r, 500));
  return mockBookings.get(pnr) || null;
}
