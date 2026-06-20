"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Train, MapPin, Clock, CalendarDays, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTrainDetails } from "@/lib/api/irctc";
import type { TrainDetail } from "@/lib/api/irctc";
import { useT } from "@/lib/i18n/i18n-context";

interface Props {
  trainNo: string;
}

export function ScheduleClient({ trainNo }: Props) {
  const router = useRouter();
  const { t } = useT();
  const [data, setData] = useState<TrainDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const result = await getTrainDetails(trainNo);
      setData(result as TrainDetail);
      setLoading(false);
    }
    fetch();
  }, [trainNo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        {t("schedule.not_found")} {trainNo}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t("train." + data.train_number + ".name")}</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Train className="h-4 w-4" />
            {data.train_number} | {t("station." + data.from_station)} → {t("station." + data.to_station)}
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t("schedule.duration_label")} <strong>{data.duration}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t("schedule.runs_on")} {data.running_days?.join(", ") || t("schedule.all_days_small")}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">{t("schedule.route_title")}</h2>
        <div className="space-y-0">
          {data.route.map((stop, i) => (
            <div key={stop.station_code + i}>
              <div className="flex items-center gap-4 py-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${i === 0 || i === data.route.length - 1 ? "bg-primary" : "bg-muted-foreground/40"}`} />
                  {i < data.route.length - 1 && <div className="w-0.5 h-8 bg-border" />}
                </div>
                <div className="flex-1 grid grid-cols-[1fr_auto_auto] gap-4 items-center">
                  <div>
                    <div className="font-medium">{t("station." + stop.station_code)}</div>
                    <div className="text-sm text-muted-foreground">{stop.station_code}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono">{stop.arrival}</div>
                    <div className="text-xs text-muted-foreground">{t("live_train.arr")}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono">{stop.departure}</div>
                    <div className="text-xs text-muted-foreground">{t("live_train.dep")}</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {t("live_train.day")} {stop.day}
                </Badge>
              </div>
              {i < data.route.length - 1 && (
                <div className="ml-1.5 pl-11 text-xs text-muted-foreground">
                  {stop.distance} {t("live_train.km")}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
