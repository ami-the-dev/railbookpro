"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Train, MapPin, CalendarDays, Clock, IndianRupee, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { getUserBookings, removeUserBooking } from "@/lib/booking-store";
import { cancelBooking } from "@/lib/api/booking";
import { sendCancellationConfirmation } from "@/lib/notifications";
import { toast } from "sonner";
import type { BookingResponse } from "@/lib/api/booking";

export default function BookingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && session?.user?.email) {
      setBookings(getUserBookings(session.user.email));
    }
  }, [status, session, router]);

  async function handleCancel(pnr: string) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(pnr);
    try {
      const result = await cancelBooking(pnr);
      if (result.status && session?.user?.email) {
        const cancelled = bookings.find((b) => b.pnr === pnr);
        removeUserBooking(session.user.email, pnr);
        setBookings((prev) => prev.filter((b) => b.pnr !== pnr));
        if (cancelled) {
          sendCancellationConfirmation(session.user.email, "", {
            pnr: cancelled.pnr,
            train_name: cancelled.train_name,
            refund: result.refund,
          });
        }
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Cancellation failed");
    } finally {
      setCancelling(null);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">My Bookings</h1>
            <p className="text-muted-foreground text-sm">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-2">No bookings yet</h2>
            <p className="text-muted-foreground mb-6">Search trains and book your first ticket</p>
            <Button onClick={() => router.push("/")}>Search Trains</Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.pnr} className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-sm px-3 py-1">
                    {booking.booking_status}
                  </Badge>
                  <span className="font-mono text-sm text-primary">{booking.pnr}</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Train className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{booking.train_name}</div>
                    <div className="text-sm text-muted-foreground">{booking.train_number}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {booking.from} → {booking.to}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    {booking.travel_date}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IndianRupee className="h-4 w-4" />
                    ₹{booking.total_fare}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{booking.class}</Badge>
                  <Badge variant="outline">{booking.quota}</Badge>
                  <Badge variant="outline">{booking.seat}</Badge>
                </div>
                <hr className="border-t border-border my-4" />
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/pnr?pnr=${booking.pnr}`)}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    Check PNR
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-error border-error/20 hover:bg-error/5"
                    onClick={() => handleCancel(booking.pnr)}
                    disabled={cancelling === booking.pnr}
                  >
                    {cancelling === booking.pnr ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-1" />
                    )}
                    Cancel
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
