"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Train, MapPin, CalendarDays, IndianRupee, Loader2, AlertCircle, ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n/i18n-context";
import { getBooking } from "@/lib/api/booking";
import type { BookingResponse } from "@/lib/api/booking";

interface Props {
  pnr: string;
}

export function BookingConfirmClient({ pnr }: Props) {
  const router = useRouter();
  const { t } = useT();
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pnr) {
      setError(t("booking.no_pnr"));
      setLoading(false);
      return;
    }
    getBooking(pnr).then((result) => {
      if (result) {
        setBooking(result);
      } else {
        setError(t("booking.notfoundmsg"));
      }
    }).catch(() => {
      setError(t("booking.load_failed"));
    }).finally(() => {
      setLoading(false);
    });
  }, [pnr]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-12">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">{t("booking.notfound")}</h1>
        <p className="text-muted-foreground">{error || t("booking.notfoundmsg")}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => router.push("/")}>{t("booking.gohome")}</Button>
          <Button onClick={() => router.push("/bookings")}>{t("booking.mybookings")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 py-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{t("booking.confirmed")}</h1>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <Check className="h-8 w-8" />
        </div>
        <p className="text-success font-medium">{t("booking.success_msg")}</p>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-sm px-3 py-1">
            {booking.booking_status}
          </Badge>
          <span className="font-mono text-sm text-muted-foreground">{t("booking.pnr")}</span>
        </div>
        <div className="text-center">
          <span className="font-mono text-3xl font-bold tracking-wider text-primary">{booking.pnr}</span>
        </div>

        <hr className="border-t border-border" />

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Train className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-semibold text-base">{booking.train_name}</div>
            <div className="text-sm text-muted-foreground">{booking.train_number}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">{t("booking.journey")}</div>
              <div className="font-medium">{booking.from} → {booking.to}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">{t("booking.date")}</div>
              <div className="font-medium">{booking.travel_date}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <IndianRupee className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <div className="text-xs text-muted-foreground">{t("booking.totalfare")}</div>
              <div className="font-medium text-lg">₹{booking.total_fare}</div>
            </div>
          </div>
        </div>

        <hr className="border-t border-border" />

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{booking.class}</Badge>
          <Badge variant="outline">{booking.quota}</Badge>
          <Badge variant="outline">{booking.seat}</Badge>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          {booking.message}
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="flex-1" onClick={() => window.print()}>
          <Download className="h-4 w-4 mr-2" />
          {t("booking.download")}
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => router.push(`/pnr?pnr=${booking.pnr}`)}>
          {t("booking.checkpnr")}
        </Button>
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="ghost" onClick={() => router.push("/")}>{t("booking.backhome")}</Button>
        <Button onClick={() => router.push("/bookings")}>{t("booking.mybookings")}</Button>
      </div>
    </div>
  );
}
