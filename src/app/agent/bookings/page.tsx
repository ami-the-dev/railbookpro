"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Search, IndianRupee, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAgentCommissions, getAgent, registerAgent } from "@/lib/agent-store";
import type { CommissionEntry, AgentProfile } from "@/lib/agent-store";

export default function AgentBookings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [commissions, setCommissions] = useState<CommissionEntry[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/auth/login"); return; }
    if (status !== "authenticated" || !session?.user?.email) return;
    let p = getAgent(session.user.email);
    if (!p) {
      p = registerAgent(session.user.email, session.user.name || "Agent", "");
    }
    setProfile(p);
    setCommissions(getAgentCommissions(session.user.email));
  }, [status, session, router]);

  if (!profile) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const filtered = search
    ? commissions.filter((c) =>
        c.pnr.includes(search) || c.trainName.toLowerCase().includes(search.toLowerCase())
      )
    : commissions;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Bookings & Commissions</h1>
          <p className="text-muted-foreground">{commissions.length} total bookings</p>
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
              <TableHead>Date</TableHead>
              <TableHead>Fare</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-sm">{c.pnr}</TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{c.trainName}</div>
                  </TableCell>
                  <TableCell className="text-sm">{c.date}</TableCell>
                  <TableCell className="text-sm">₹{c.bookingFare}</TableCell>
                  <TableCell className="text-sm font-medium text-green-600">+₹{c.commissionAmount}</TableCell>
                  <TableCell className="text-sm">{c.commissionPercent}%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={c.status === "paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}>
                      {c.status}
                    </Badge>
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
