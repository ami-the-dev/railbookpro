"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Search, Train, MapPin, CalendarDays, User, Trash2, Loader2, Clock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPNRStatus } from "@/lib/api/irctc";
import { cancelBooking } from "@/lib/api/booking";
import { removeUserBooking } from "@/lib/booking-store";
import { sendCancellationConfirmation } from "@/lib/notifications";
import { addToWaitlist, getWaitlist } from "@/lib/waitlist-store";
import { toast } from "sonner";
import { useT } from "@/lib/i18n/i18n-context";

interface Props {
  initialPNR: string;
}

const statusColors: Record<string, string> = {
  CNF: "bg-success/10 text-success border-success/20",
  RAC: "bg-warning/10 text-warning border-warning/20",
  WL: "bg-error/10 text-error border-error/20",
  CAN: "bg-muted text-muted-foreground border-border",
};

export function PNRStatusClient({ initialPNR }: Props) {
  const { t } = useT();
  const { data: session } = useSession();
  const [pnr, setPnr] = useState(initialPNR);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pnr || pnr.length < 10) {
      toast.error(t("pnr.invalid"));
      return;
    }
    setLoading(true);
    try {
      const data = await getPNRStatus(pnr);
      setResult(data);
    } catch {
      toast.error(t("pnr.fetch_failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold">{t("pnr.title")}</h1>
          <p className="mt-2 text-slate-300 max-w-xl mx-auto">
            {t("pnr.subtitle")}
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                placeholder={t("pnr.placeholder")}
                className="h-12 text-lg font-mono"
                maxLength={10}
              />
            </div>
            <Button type="submit" className="h-12 w-full sm:w-auto px-6" disabled={loading}>
              <Search className="h-5 w-5 mr-2" />
              {loading ? t("pnr.checking") : t("pnr.check")}
            </Button>
          </form>

          {result && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={`text-base px-4 py-1.5 ${
                    statusColors[result.booking_status] || ""
                  }`}
                >
                  {result.booking_status}
                </Badge>
                <span className="font-mono text-lg font-bold text-primary">
                  {result.pnr}
                </span>
              </div>
              <hr className="border-t border-border" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Train className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">{t("pnr.train")}</div>
                    <div className="font-medium">
                      {result.train_name} ({result.train_number})
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">{t("pnr.date")}</div>
                    <div className="font-medium">{result.date_of_journey}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">{t("pnr.from_to")}</div>
                    <div className="font-medium">
                      {result.from_station} → {result.to_station}
                    </div>
                  </div>
                </div>
              </div>
              <hr className="border-t border-border" />
              <div>
                <h3 className="font-medium mb-3">{t("pnr.passengers")}</h3>
                <div className="space-y-2">
                  {result.passengers?.map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{t("pnr.passenger")} {p.no}</span>
                      </div>
                      <Badge variant="outline" className={statusColors[p.current_status] || ""}>
                        {p.current_status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <hr className="border-t border-border" />
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const already = getWaitlist().some((e) => e.pnr === result.pnr);
                    if (already) {
                      toast.info(t("pnr.already_waitlist"));
                      return;
                    }
                    addToWaitlist({
                      pnr: result.pnr,
                      trainNumber: result.train_number,
                      trainName: result.train_name,
                      from: result.from_station,
                      to: result.to_station,
                      date: result.date_of_journey,
                      status: result.current_status || result.booking_status,
                      lastChecked: new Date().toISOString(),
                      autoCheck: true,
                      notified: false,
                    });
                    toast.success(t("pnr.added_waitlist"));
                  }}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  {t("pnr.trackwaitlist")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-error border-error/20 hover:bg-error/5"
                  onClick={async () => {
                    if (!confirm(t("pnr.cancel_confirm"))) return;
                    setCancelling(true);
                    try {
                      const res = await cancelBooking(result.pnr);
                      if (res.status && session?.user?.email) {
                        removeUserBooking(session.user.email, result.pnr);
                        sendCancellationConfirmation(session.user.email, "", {
                          pnr: result.pnr,
                          train_name: result.train_name,
                          refund: res.refund,
                        });
                        toast.success(res.message);
                        setResult(null);
                        setPnr("");
                      } else {
                        toast.error(res.message);
                      }
                    } catch {
                      toast.error(t("pnr.cancel_failed"));
                    } finally {
                      setCancelling(false);
                    }
                  }}
                  disabled={cancelling}
                >
                  {cancelling ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-1" />
                  )}
                  {t("pnr.cancel")}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
