"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/i18n-context";
import {
  Clock, Train, MapPin, CalendarDays, Bell, BellOff,
  RefreshCw, Loader2, Trash2, AlertCircle, ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  getWaitlist, removeFromWaitlist, toggleAutoCheck,
} from "@/lib/waitlist-store";
import { getWaitlistPrediction, checkAllWaitlisted, checkSinglePNR } from "@/lib/waitlist-checker";
import { toast } from "sonner";
import type { WaitlistEntry } from "@/lib/waitlist-store";

export default function WaitlistPage() {
  const router = useRouter();
  const { t } = useT();
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [checking, setChecking] = useState<string | null>(null);
  const [checkingAll, setCheckingAll] = useState(false);
  const [lastAutoCheck, setLastAutoCheck] = useState("");

  function load() {
    setEntries(getWaitlist());
  }

  useEffect(() => { load(); }, []);

  const handleCheck = useCallback(async (pnr: string) => {
    setChecking(pnr);
    try {
      const { changed, oldStatus, newStatus } = await checkSinglePNR(pnr);
      load();
      if (changed) {
        toast.success(`Status updated: ${oldStatus} → ${newStatus}`);
      } else {
        toast.info("No change in status");
      }
    } catch {
      toast.error("Failed to check PNR");
    } finally {
      setChecking(null);
    }
  }, []);

  const handleCheckAll = useCallback(async () => {
    setCheckingAll(true);
    try {
      const changes = await checkAllWaitlisted();
      load();
      setLastAutoCheck(new Date().toLocaleTimeString());
      if (changes > 0) {
        toast.success(`${changes} booking(s) status changed!`);
      } else {
        toast.info("No status changes detected");
      }
    } catch {
      toast.error("Failed to check all");
    } finally {
      setCheckingAll(false);
    }
  }, []);

  const handleRemove = useCallback((pnr: string) => {
    removeFromWaitlist(pnr);
    load();
    toast.success("Removed from waitlist");
  }, []);

  const handleToggle = useCallback((pnr: string, current: boolean) => {
    toggleAutoCheck(pnr, !current);
    load();
    toast.success(current ? "Auto-check disabled" : "Auto-check enabled");
  }, []);

  const trackedCount = entries.filter((e) => e.autoCheck).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Waitlist Manager</h1>
            <p className="text-sm text-muted-foreground">
              {entries.length > 0
                ? `${entries.length} PNR${entries.length > 1 ? "s" : ""} tracked · ${trackedCount} auto-check${trackedCount !== 1 ? "s" : ""} active`
                : "Track your waitlisted bookings"}
            </p>
          </div>
          {entries.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleCheckAll} disabled={checkingAll}>
              {checkingAll ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Check All
            </Button>
          )}
        </div>

        {lastAutoCheck && (
          <p className="text-xs text-muted-foreground mb-4 text-center">
            Last auto-check: {lastAutoCheck}
          </p>
        )}

        {entries.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-2">{t("waitlist.notracked")}</h2>
            <p className="text-muted-foreground mb-6">
              {t("waitlist.notrackedmsg")}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push("/pnr")}>
                {t("booking.checkpnr")}
              </Button>
              <Button onClick={() => router.push("/bookings")}>
                {t("booking.mybookings")}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => {
              const prediction = getWaitlistPrediction(entry.status);
              return (
                <Card key={entry.pnr} className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${prediction.color} font-medium border-current/20`}>
                        {prediction.label}
                      </Badge>
                      {entry.autoCheck && (
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px]">
                          <Bell className="h-3 w-3 mr-1" />
                          Auto
                        </Badge>
                      )}
                    </div>
                    <span className="font-mono text-sm text-primary">{entry.pnr}</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Train className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{entry.trainName}</div>
                      <div className="text-xs text-muted-foreground">{entry.trainNumber}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {entry.from} → {entry.to}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="h-3 w-3 shrink-0" />
                      {entry.date}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Confirmation Probability</span>
                      <span className={prediction.color + " font-bold"}>{prediction.probability}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          prediction.probability > 70 ? "bg-success" :
                          prediction.probability > 30 ? "bg-warning" : "bg-error"
                        }`}
                        style={{ width: `${prediction.probability}%` }}
                      />
                    </div>
                  </div>

                  <hr className="border-t border-border mb-3" />

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCheck(entry.pnr)}
                      disabled={checking === entry.pnr}
                    >
                      {checking === entry.pnr ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3 mr-1" />
                      )}
                      Check
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggle(entry.pnr, entry.autoCheck)}
                    >
                      {entry.autoCheck ? (
                        <BellOff className="h-3 w-3 mr-1" />
                      ) : (
                        <Bell className="h-3 w-3 mr-1" />
                      )}
                      {entry.autoCheck ? "Stop" : "Auto-track"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error hover:text-error ml-auto"
                      onClick={() => handleRemove(entry.pnr)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
