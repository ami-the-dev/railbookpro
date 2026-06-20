"use client";

import { useState, useEffect } from "react";
import { Search, ArrowUpDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cancelBooking } from "@/lib/api/booking";
import { toast } from "sonner";
import type { BookingResponse } from "@/lib/api/booking";

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("railbookpro_bookings");
    if (!raw) return;
    const all: Record<string, BookingResponse[]> = JSON.parse(raw);
    setBookings(Object.values(all).flat());
  }, []);

  const filtered = search
    ? bookings.filter((b) =>
        b.pnr.includes(search) || b.train_name.toLowerCase().includes(search.toLowerCase())
      )
    : bookings;

  async function handleCancel(pnr: string) {
    if (!confirm("Cancel this booking?")) return;
    const res = await cancelBooking(pnr);
    if (res.status) {
      const raw = localStorage.getItem("railbookpro_bookings");
      if (raw) {
        const all: Record<string, BookingResponse[]> = JSON.parse(raw);
        for (const email of Object.keys(all)) {
          all[email] = all[email].filter((b) => b.pnr !== pnr);
        }
        localStorage.setItem("railbookpro_bookings", JSON.stringify(all));
      }
      setBookings((prev) => prev.filter((b) => b.pnr !== pnr));
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">{bookings.length} total bookings</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by PNR or train..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PNR</TableHead>
              <TableHead>Train</TableHead>
              <TableHead>Journey</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Fare</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((b) => (
                <TableRow key={b.pnr}>
                  <TableCell className="font-mono">{b.pnr}</TableCell>
                  <TableCell>
                    <div className="font-medium">{b.train_name}</div>
                    <div className="text-xs text-muted-foreground">{b.train_number}</div>
                  </TableCell>
                  <TableCell>{b.from} → {b.to}</TableCell>
                  <TableCell>{b.travel_date}</TableCell>
                  <TableCell><Badge variant="outline">{b.class}</Badge></TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-success/10 text-success">{b.booking_status}</Badge>
                  </TableCell>
                  <TableCell>₹{b.total_fare}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCancel(b.pnr)}
                      className="text-error hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
