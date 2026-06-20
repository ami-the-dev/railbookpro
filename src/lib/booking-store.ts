import type { BookingResponse } from "@/lib/api/booking";

const STORAGE_KEY = "railbookpro_bookings";

export function getUserBookings(userEmail: string): BookingResponse[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const all: Record<string, BookingResponse[]> = JSON.parse(raw);
  return all[userEmail] || [];
}

export function saveUserBooking(userEmail: string, booking: BookingResponse): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(STORAGE_KEY);
  const all: Record<string, BookingResponse[]> = raw ? JSON.parse(raw) : {};
  if (!all[userEmail]) all[userEmail] = [];
  all[userEmail].push(booking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function removeUserBooking(userEmail: string, pnr: string): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const all: Record<string, BookingResponse[]> = JSON.parse(raw);
  if (all[userEmail]) {
    all[userEmail] = all[userEmail].filter((b) => b.pnr !== pnr);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
}
