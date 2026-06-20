"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, CalendarDays, Loader2, IndianRupee, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { searchTrains, checkAvailability } from "@/lib/api/irctc";
import { useT } from "@/lib/i18n/i18n-context";
import { stationLabel } from "@/lib/i18n/utils";

interface Props {
  from: string;
  to: string;
  date: string;
  coachClass: string;
}

interface ClassAvail {
  class: string;
  available: number;
  fare: number;
  status: string;
}

interface TrainInfo {
  train_number: string;
  train_name: string;
  from_station: string;
  to_station: string;
  departure: string;
  arrival: string;
  duration: string;
  classes: string[];
  availability: ClassAvail[];
}

const statusColors: Record<string, string> = {
  AVAIL: "text-emerald-600 bg-emerald-50 border-emerald-200",
  RAC: "text-amber-600 bg-amber-50 border-amber-200",
  WL: "text-rose-600 bg-rose-50 border-rose-200",
};

async function fetchAvailability(trainNo: string, from: string, to: string, date: string, classes: string[]) {
  const results = await Promise.allSettled(
    classes.map((cls) => checkAvailability(trainNo, from, to, date, cls, "GN"))
  );
  return results.map((r, i) => {
    if (r.status === "fulfilled" && r.value) {
      return {
        class: classes[i],
        available: r.value.available,
        fare: r.value.fare,
        status: r.value.status,
      };
    }
    return { class: classes[i], available: 0, fare: 0, status: "NA" };
  });
}

const classOrder = ["1A", "2A", "3A", "SL", "2S"];

export function SearchResultsClient({ from, to, date }: Props) {
  const router = useRouter();
  const [trains, setTrains] = useState<TrainInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useT();

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      const results = await searchTrains(from, to);
      const withAvail = await Promise.all(
        results.map(async (t: any) => {
          const avail = await fetchAvailability(t.train_number, from, to, date, t.classes);
          const sorted = classOrder.filter((c) => t.classes.includes(c)).map((c) => avail.find((a) => a.class === c)!).filter(Boolean);
          return { ...t, availability: sorted };
        })
      );
      setTrains(withAvail);
      setLoading(false);
    }
    fetchAll();
  }, [from, to, date, router]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{stationLabel(t, from)} → {stationLabel(t, to)}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {from} → {to}
            </span>
            {date && (
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : trains.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          {t("search.no_results")}
        </div>
      ) : (
        <div className="space-y-4">
          {trains.map((train) => (
            <Card key={train.train_number} className="p-4 md:p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-base md:text-lg truncate">{t("train." + train.train_number + ".name")}</h3>
                    <Badge variant="outline" className="shrink-0 text-xs font-mono">{train.train_number}</Badge>
                  </div>
                  <div className="flex items-center gap-4 md:gap-8 mt-2">
                    <div className="text-center">
                      <div className="text-lg md:text-xl font-bold">{train.departure}</div>
                      <div className="text-[11px] text-muted-foreground">{from}</div>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-16 md:w-20 h-px bg-border relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                          <ArrowLeft className="h-3 w-3 text-muted-foreground rotate-180" />
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{train.duration}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-lg md:text-xl font-bold">{train.arrival}</div>
                      <div className="text-[11px] text-muted-foreground">{to}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-4 flex-1 min-w-0">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">{t("search.seat_availability")}</div>
                  <div className="flex flex-wrap gap-2">
                    {train.availability.map((a) => (
                      <div
                        key={a.class}
                        className={`flex items-center gap-2 rounded-[5px] border px-3 py-1.5 ${
                          a.available > 10 ? "bg-emerald-50/50 border-emerald-200" :
                          a.available > 0 ? "bg-amber-50/50 border-amber-200" :
                          "bg-rose-50/50 border-rose-200"
                        }`}
                      >
                        <span className={`text-xs font-bold ${
                          a.available > 10 ? "text-emerald-600" :
                          a.available > 0 ? "text-amber-600" : "text-rose-600"
                        }`}>{a.class}</span>
                        <span className="text-[10px] text-muted-foreground">|</span>
                        <span className="text-[10px] text-muted-foreground">{t("schedule.class_" + a.class.toLowerCase())}</span>
                        <span className="text-[10px] text-muted-foreground">|</span>
                        {a.available > 0 ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <X className="h-3 w-3 text-rose-500" />
                        )}
                        <span className={`text-xs font-bold ${
                          a.available > 10 ? "text-emerald-600" :
                          a.available > 0 ? "text-amber-600" : "text-rose-600"
                        }`}>
                          {a.available > 0 ? `${a.available}` : t("search.full")}
                        </span>
                        <span className="text-[10px] text-muted-foreground">|</span>
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <IndianRupee className="h-2.5 w-2.5" />{a.fare}
                        </span>
                      </div>
                    ))}
                    <Link
                      href={`/trains/${train.train_number}/seats?from=${from}&to=${to}&date=${date}`}
                      className="flex items-center justify-center rounded-[5px] border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                    >
                      {t("search.seat_layout")}
                    </Link>
                    <Link
                      href={`/trains/${train.train_number}/schedule`}
                      className="flex items-center justify-center rounded-[5px] border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                    >
                      {t("search.schedule")}
                    </Link>
                    <Link
                      href={`/trains/${train.train_number}?from=${from}&to=${to}&date=${date}`}
                      className="flex items-center justify-center rounded-[5px] bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors"
                    >
                      {t("search.book_now")}
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
