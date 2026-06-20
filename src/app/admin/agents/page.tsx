"use client";

import { useState, useEffect } from "react";
import { Users, IndianRupee, Percent, TrendingUp, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAgents, getCommissions } from "@/lib/agent-store";

export default function AdminAgents() {
  const [agents, setAgents] = useState(getAgents());
  const [commissions, setCommissions] = useState(getCommissions());

  function load() {
    setAgents(getAgents());
    setCommissions(getCommissions());
  }

  useEffect(() => { load(); }, []);

  const totalCommissionPaid = commissions.filter((c) => c.status === "paid").reduce((s, c) => s + c.commissionAmount, 0);
  const totalCommissionPending = commissions.filter((c) => c.status === "pending").reduce((s, c) => s + c.commissionAmount, 0);

  const summaryCards = [
    { icon: Users, label: "Total Agents", value: agents.length, color: "text-blue-600 bg-blue-100" },
    { icon: IndianRupee, label: "Commission Paid", value: `₹${totalCommissionPaid.toLocaleString()}`, color: "text-green-600 bg-green-100" },
    { icon: TrendingUp, label: "Commission Pending", value: `₹${totalCommissionPending.toLocaleString()}`, color: "text-amber-600 bg-amber-100" },
    { icon: Percent, label: "Avg Commission Rate", value: agents.length > 0 ? `${(agents.reduce((s, a) => s + a.commissionPercent, 0) / agents.length).toFixed(1)}%` : "0%", color: "text-purple-600 bg-purple-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agent Management</h1>
          <p className="text-muted-foreground">{agents.length} agent(s) registered</p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
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

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Earned</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No agents registered yet
                </TableCell>
              </TableRow>
            ) : (
              agents.map((a) => (
                <TableRow key={a.email}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell className="text-sm">{a.email}</TableCell>
                  <TableCell className="text-sm">{a.phone || "—"}</TableCell>
                  <TableCell className="text-sm">{a.commissionPercent}%</TableCell>
                  <TableCell className="text-sm font-medium">₹{a.totalEarned.toLocaleString()}</TableCell>
                  <TableCell className="text-sm">₹{a.totalPaid.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={a.isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
                      {a.isActive ? "Active" : "Inactive"}
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
