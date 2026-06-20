"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IndianRupee, TrendingUp, Ticket, Percent, RefreshCw, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAgent, getAgentCommissions, registerAgent } from "@/lib/agent-store";
import type { AgentProfile, CommissionEntry } from "@/lib/agent-store";

export default function AgentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [commissions, setCommissions] = useState<CommissionEntry[]>([]);

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

  const totalPending = commissions.filter((c) => c.status === "pending").reduce((s, c) => s + c.commissionAmount, 0);
  const totalPaid = commissions.filter((c) => c.status === "paid").reduce((s, c) => s + c.commissionAmount, 0);
  const pendingCount = commissions.filter((c) => c.status === "pending").length;

  const cards = [
    { icon: IndianRupee, label: "Total Earned", value: `₹${profile.totalEarned.toLocaleString()}`, color: "text-green-600 bg-green-100" },
    { icon: TrendingUp, label: "Pending", value: `₹${totalPending.toLocaleString()}`, color: "text-amber-600 bg-amber-100" },
    { icon: Ticket, label: "Total Bookings", value: commissions.length, color: "text-blue-600 bg-blue-100" },
    { icon: Percent, label: "Commission Rate", value: `${profile.commissionPercent}%`, color: "text-purple-600 bg-purple-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agent Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile.name}</p>
        </div>
        <Badge variant="outline" className={profile.isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
          {profile.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="p-5">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${card.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className="text-sm text-muted-foreground">{card.label}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Commissions</h2>
          {commissions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No commissions yet. Start booking to earn!</p>
          ) : (
            <div className="space-y-3">
              {commissions.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{c.trainName}</div>
                    <div className="text-xs text-muted-foreground">{c.pnr} · {c.date}</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-bold text-green-600">+₹{c.commissionAmount}</div>
                    <Badge variant="outline" className={c.status === "paid" ? "bg-success/10 text-success text-[10px]" : "bg-warning/10 text-warning text-[10px]"}>
                      {c.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Payout Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pending Payout</span>
              <span className="font-bold text-amber-600">₹{totalPending.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Already Paid</span>
              <span className="font-bold text-green-600">₹{totalPaid.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-sm font-bold">
              <span>Total Earned</span>
              <span>₹{profile.totalEarned.toLocaleString()}</span>
            </div>
            {pendingCount > 0 && (
              <p className="text-xs text-muted-foreground">{pendingCount} commission(s) pending payout</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
