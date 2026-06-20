"use client";

import { useState, useEffect } from "react";
import { Ticket, Users, IndianRupee, TrendingUp, Database, Bell, RefreshCw, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCacheStats } from "@/lib/cache";
import { getNotificationLog } from "@/lib/notifications";

interface DashboardStats {
  totalBookings: number;
  activeUsers: number;
  revenue: number;
  tatkalBookings: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0, activeUsers: 0, revenue: 0, tatkalBookings: 0,
  });
  const [cacheInfo, setCacheInfo] = useState({ size: 0, keys: [] as string[] });
  const [notifications, setNotifications] = useState<{ email: number; sms: number }>({ email: 0, sms: 0 });

  function loadData() {
    const raw = localStorage.getItem("railbookpro_bookings");
    if (raw) {
      const all: Record<string, any[]> = JSON.parse(raw);
      const bookings = Object.values(all).flat();
      setStats({
        totalBookings: bookings.length,
        activeUsers: Object.keys(all).length,
        revenue: bookings.reduce((sum, b) => sum + (b.total_fare || 0), 0),
        tatkalBookings: bookings.filter((b) => b.quota === "TQ").length,
      });
    }
    setCacheInfo(getCacheStats());
    const log = getNotificationLog();
    setNotifications({ email: log.email.length, sms: log.sms.length });
  }

  useEffect(() => { loadData(); }, []);

  const cards = [
    { icon: Ticket, label: "Total Bookings", value: stats.totalBookings, color: "text-blue-600 bg-blue-100" },
    { icon: Users, label: "Active Users", value: stats.activeUsers, color: "text-green-600 bg-green-100" },
    { icon: IndianRupee, label: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, color: "text-purple-600 bg-purple-100" },
    { icon: TrendingUp, label: "Tatkal Bookings", value: stats.tatkalBookings, color: "text-amber-600 bg-amber-100" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your booking platform</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
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
          <h2 className="text-lg font-semibold mb-4">Cache Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cache Engine</span>
              <Badge variant="outline" className="bg-muted text-muted-foreground">
                <Database className="h-3 w-3 mr-1" />
                In-Memory
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cached Entries</span>
              <span className="font-mono">{cacheInfo.size}</span>
            </div>
            {cacheInfo.keys.length > 0 && (
              <div className="text-xs text-muted-foreground max-h-24 overflow-y-auto space-y-1">
                {cacheInfo.keys.map((k) => <div key={k} className="font-mono">{k}</div>)}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Notification Log</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Bell className="h-4 w-4" /> Emails Sent
              </span>
              <span className="font-bold">{notifications.email}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-4 w-4" /> SMS Sent
              </span>
              <span className="font-bold">{notifications.sms}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-sm">IRCTC Connect API</span>
              <Badge variant="outline" className="bg-success/10 text-success ml-auto">Connected</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span className="text-sm">Redis Cache</span>
              <Badge variant="outline" className="ml-auto bg-warning/10 text-warning">
                Not Connected
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-success" />
              <span className="text-sm">Database</span>
              <Badge variant="outline" className="bg-success/10 text-success ml-auto">Operational</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-warning" />
              <span className="text-sm">Payment Gateway</span>
              <Badge variant="outline" className="bg-warning/10 text-warning ml-auto">Sandbox Mode</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
          {stats.totalBookings === 0 ? (
            <div className="flex items-center gap-3 text-muted-foreground">
              <span className="text-sm">No recent activity to display</span>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground space-y-2">
              <p>{stats.totalBookings} bookings across {stats.activeUsers} users</p>
              <p>{stats.tatkalBookings} tatkal bookings ({stats.totalBookings > 0 ? Math.round(stats.tatkalBookings / stats.totalBookings * 100) : 0}% of total)</p>
              <p>{notifications.email + notifications.sms} notifications sent</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
