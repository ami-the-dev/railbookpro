"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, TrendingUp, Ticket, Zap } from "lucide-react";
import type { BookingResponse } from "@/lib/api/booking";

export default function AdminReports() {
  const [bookings, setBookings] = useState<BookingResponse[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("railbookpro_bookings");
    if (!raw) return;
    const all: Record<string, BookingResponse[]> = JSON.parse(raw);
    setBookings(Object.values(all).flat());
  }, []);

  const totalRevenue = bookings.reduce((s, b) => s + (b.total_fare || 0), 0);
  const tatkalCount = bookings.filter((b) => b.quota === "TQ").length;
  const tatkalRevenue = bookings.filter((b) => b.quota === "TQ").reduce((s, b) => s + (b.total_fare || 0), 0);
  const avgFare = bookings.length > 0 ? Math.round(totalRevenue / bookings.length) : 0;

  const classDistribution = bookings.reduce((acc: Record<string, number>, b) => {
    acc[b.class] = (acc[b.class] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground">Booking insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">₹{avgFare.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Avg. Fare per Booking</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">{tatkalCount}</div>
              <div className="text-sm text-muted-foreground">Tatkal Bookings</div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <div className="text-sm text-muted-foreground">Total Bookings</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Class Distribution</h2>
          {Object.keys(classDistribution).length === 0 ? (
            <p className="text-sm text-muted-foreground">No data available</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(classDistribution)
                .sort(([, a], [, b]) => b - a)
                .map(([cls, count]) => {
                  const pct = Math.round((count / bookings.length) * 100);
                  return (
                    <div key={cls} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{cls}</span>
                        <span className="text-muted-foreground">{count} ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Tatkal Revenue</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tatkal Revenue</span>
              <span className="font-bold">₹{tatkalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Regular Revenue</span>
              <span className="font-bold">₹{(totalRevenue - tatkalRevenue).toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-sm font-bold">
              <span>Total Revenue</span>
              <span>₹{totalRevenue.toLocaleString()}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden mt-2">
              <div
                className="h-full rounded-full bg-tertiary"
                style={{ width: `${totalRevenue > 0 ? (tatkalRevenue / totalRevenue) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Tatkal share: {totalRevenue > 0 ? Math.round((tatkalRevenue / totalRevenue) * 100) : 0}%
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
