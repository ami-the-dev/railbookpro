"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Train, MapPin, Clock, Gauge, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getTrainDetails } from "@/lib/api/irctc";
import type { TrainDetail, RouteStop } from "@/lib/api/irctc";
import { useT } from "@/lib/i18n/i18n-context";



const mockLiveData: Record<string, { currentStationIndex: number; delay: number; speed: number; lastUpdated: string }> = {
  "12615": { currentStationIndex: 3, delay: 12, speed: 82, lastUpdated: "2 mins ago" },
  "12433": { currentStationIndex: 2, delay: 0, speed: 95, lastUpdated: "1 min ago" },
  "12621": { currentStationIndex: 4, delay: 5, speed: 78, lastUpdated: "3 mins ago" },
  "12641": { currentStationIndex: 1, delay: 22, speed: 65, lastUpdated: "just now" },
  "12951": { currentStationIndex: 2, delay: 0, speed: 91, lastUpdated: "30 secs ago" },
  "12301": { currentStationIndex: 3, delay: 25, speed: 72, lastUpdated: "5 mins ago" },
  "22691": { currentStationIndex: 1, delay: 8, speed: 85, lastUpdated: "2 mins ago" },
  "12431": { currentStationIndex: 2, delay: 10, speed: 88, lastUpdated: "1 min ago" },
};

function getDelayColor(minutes: number): string {
  if (minutes === 0) return "text-emerald-600 bg-emerald-50";
  if (minutes <= 15) return "text-amber-600 bg-amber-50";
  return "text-rose-600 bg-rose-50";
}

function getTrainProgress(route: RouteStop[], currentIndex: number): number {
  if (!route || route.length < 2) return 0;
  return Math.round((currentIndex / (route.length - 1)) * 100);
}

export function LiveTrainClient() {
  const { t } = useT();
  const searchParams = useSearchParams();
  const [trainInput, setTrainInput] = useState(searchParams?.get("train") || "");
  const [trainData, setTrainData] = useState<TrainDetail | null>(null);
  const [liveInfo, setLiveInfo] = useState<typeof mockLiveData[string] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function searchTrain(num?: string) {
    const query = num || trainInput;
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const result = await getTrainDetails(query.trim());
      if (result) {
        setTrainData(result as TrainDetail);
        setLiveInfo(mockLiveData[query.trim()] || {
          currentStationIndex: Math.floor(Math.random() * 3) + 1,
          delay: Math.floor(Math.random() * 30),
          speed: Math.floor(Math.random() * 40) + 60,
          lastUpdated: "1 min ago",
        });
      } else {
        setTrainData(null);
        setLiveInfo(null);
      }
    } catch {
      setTrainData(null);
      setLiveInfo(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initial = searchParams?.get("train");
    if (initial) {
      setTrainInput(initial);
      searchTrain(initial);
    }
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 text-emerald-400 px-4 py-1.5 text-sm font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {t("live.badge")}
          </div>
          <h1 className="text-3xl font-bold">{t("live_train.page_title")}</h1>
          <p className="mt-2 text-slate-300 max-w-xl mx-auto">
            {t("live_train.page_subtitle")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 -mt-6 sm:px-6 lg:px-8">
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={trainInput}
                onChange={(e) => setTrainInput(e.target.value)}
                placeholder={t("live_train.placeholder")}
                className="pl-9"
                onKeyDown={(e) => e.key === "Enter" && searchTrain()}
              />
            </div>
            <Button onClick={() => searchTrain()} disabled={loading} className="w-full sm:w-auto">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {t("live_train.track")}
            </Button>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {["12615", "12433", "12621", "12641"].map((num) => (
              <button
                key={num}
                onClick={() => { setTrainInput(num); searchTrain(num); }}
                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:border-[#1E5EFF] hover:text-[#1E5EFF] transition"
              >
                {num}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {!searched && !loading && (
          <Card className="text-center py-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Train className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold">{t("live_train.empty_title")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("live_train.empty_desc")}</p>
          </Card>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#1E5EFF]" />
          </div>
        )}

        {!loading && searched && !trainData && (
          <Card className="text-center py-16">
            <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-3" />
            <h2 className="text-lg font-semibold">{t("live_train.not_found")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("live_train.not_found_msg")} &quot;{trainInput}&quot;</p>
          </Card>
        )}

        {!loading && trainData && liveInfo && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[5px] bg-[#1E5EFF]/10 text-[#1E5EFF]">
                    <Train className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{t("train." + trainData.train_number + ".name")}</h2>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                      <span className="font-mono font-medium text-[#1E5EFF]">{trainData.train_number}</span>
                      <span className="text-muted-foreground/40">|</span>
                      <span>{t("station." + trainData.from_station)} &rarr; {t("station." + trainData.to_station)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`rounded-full px-4 py-1.5 text-sm font-bold ${getDelayColor(liveInfo.delay)}`}>
                    {liveInfo.delay === 0 ? t("live_train.on_time") : `${t("live_train.delayed")} ${liveInfo.delay} ${t("live_train.min")}`}
                  </div>
                  <Button variant="outline" size="icon" onClick={() => searchTrain()} title={t("live_train.refresh")}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-[5px] bg-muted p-3 text-center">
                  <MapPin className="h-4 w-4 text-[#1E5EFF] mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">{t("live_train.current_station")}</div>
                  <div className="text-sm font-bold mt-0.5">
                    {trainData.route[liveInfo.currentStationIndex]?.station_code || "-"}
                  </div>
                </div>
                <div className="rounded-[5px] bg-muted p-3 text-center">
                  <Gauge className="h-4 w-4 text-[#1E5EFF] mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">{t("live_train.speed")}</div>
                  <div className="text-sm font-bold mt-0.5">{liveInfo.speed} {t("live_train.kmh")}</div>
                </div>
                <div className="rounded-[5px] bg-muted p-3 text-center">
                  <Clock className="h-4 w-4 text-[#1E5EFF] mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">{t("live_train.journey_progress")}</div>
                  <div className="text-sm font-bold mt-0.5">{getTrainProgress(trainData.route, liveInfo.currentStationIndex)}%</div>
                </div>
                <div className="rounded-[5px] bg-muted p-3 text-center">
                  <RefreshCw className="h-4 w-4 text-[#1E5EFF] mx-auto mb-1" />
                  <div className="text-xs text-muted-foreground">{t("live_train.last_updated")}</div>
                  <div className="text-sm font-bold mt-0.5">{liveInfo.lastUpdated}</div>
                </div>
              </div>

              {liveInfo.delay > 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-[5px] bg-warning/10 px-4 py-2.5 text-sm text-warning">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {t("live_train.delay_warning")} {liveInfo.delay} {t("live_train.min")}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">{t("live_train.route_map")}</h3>
                <div className="text-xs text-muted-foreground">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#1E5EFF] mr-1" /> {t("live_train.current_position")}
                </div>
              </div>
              <div className="space-y-0">
                {trainData.route.map((stop, i) => {
                  const isCurrent = i === liveInfo.currentStationIndex;
                  const isPast = i < liveInfo.currentStationIndex;
                  return (
                    <div key={stop.station_code + i}>
                      <div className="flex items-center gap-4 py-2.5">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              isCurrent
                                ? "bg-[#1E5EFF] border-[#1E5EFF] ring-4 ring-[#1E5EFF]/20"
                                : isPast
                                ? "bg-emerald-500 border-emerald-500"
                                : "bg-background border-border"
                            }`}
                          />
                          {i < trainData.route.length - 1 && (
                            <div className={`w-0.5 h-8 ${isPast ? "bg-emerald-500" : "bg-border"}`} />
                          )}
                        </div>
                        <div className={`flex-1 grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center ${isCurrent ? "bg-[#1E5EFF]/5 -mx-3 px-3 py-2 rounded-[5px]" : ""}`}>
                          <div>
                            <div className={`font-medium ${isCurrent ? "text-[#1E5EFF]" : ""}`}>
                              {t("station." + stop.station_code)}
                              {isCurrent && <span className="ml-2 text-[10px] font-bold text-emerald-600">● {t("live_train.here")}</span>}
                            </div>
                            <div className={`text-xs ${isCurrent ? "text-[#1E5EFF]/70" : "text-muted-foreground"}`}>
                              {stop.station_code}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-mono">{stop.arrival}</div>
                            <div className="text-[10px] text-muted-foreground">{t("live_train.arr")}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-mono">{stop.departure}</div>
                            <div className="text-[10px] text-muted-foreground">{t("live_train.dep")}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">{stop.distance} {t("live_train.km")}</div>
                            <div className="text-[10px] text-muted-foreground">{t("live_train.day")} {stop.day}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
