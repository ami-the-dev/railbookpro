"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Train, Clock, Search, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useT } from "@/lib/i18n/i18n-context";

interface TrainInfo {
  number: string;
  name: string;
  from: string;
  to: string;
  fromName: string;
  toName: string;
  dep: string;
  arr: string;
  dur: string;
  days: string[];
  classes: string[];
  stops: number;
}

const allTrains: TrainInfo[] = [
  { number: "12615", name: "Grand Trunk Express", from: "NDLS", to: "MAS", fromName: "New Delhi", toName: "Chennai Central", dep: "06:00", arr: "23:30", dur: "17h 30m", days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes: ["1A","2A","3A","SL","2S"], stops: 6 },
  { number: "12433", name: "Rajdhani Express", from: "NDLS", to: "MAS", fromName: "New Delhi", toName: "Chennai Central", dep: "16:55", arr: "09:55", dur: "17h 00m", days: ["Mon","Wed","Fri"], classes: ["1A","2A","3A"], stops: 4 },
  { number: "12621", name: "Tamil Nadu Express", from: "NDLS", to: "MAS", fromName: "New Delhi", toName: "Chennai Central", dep: "22:30", arr: "15:55", dur: "17h 25m", days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes: ["2A","3A","SL","2S"], stops: 6 },
  { number: "12641", name: "Thirukkural Express", from: "NDLS", to: "MAS", fromName: "New Delhi", toName: "Chennai Central", dep: "21:15", arr: "14:50", dur: "17h 35m", days: ["Mon","Thu","Sat"], classes: ["1A","2A","3A","SL"], stops: 4 },
  { number: "12951", name: "Mumbai Rajdhani Express", from: "BCT", to: "NDLS", fromName: "Mumbai Central", toName: "New Delhi", dep: "16:35", arr: "08:30", dur: "15h 55m", days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes: ["1A","2A","3A"], stops: 5 },
  { number: "12301", name: "Howrah Rajdhani Express", from: "HWH", to: "NDLS", fromName: "Howrah Junction", toName: "New Delhi", dep: "13:05", arr: "05:55", dur: "16h 50m", days: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], classes: ["1A","2A","3A"], stops: 4 },
  { number: "22691", name: "KSR Bengaluru Rajdhani", from: "SBC", to: "NZM", fromName: "Bengaluru City", toName: "Hazrat Nizamuddin", dep: "20:50", arr: "05:55", dur: "33h 05m", days: ["Mon","Thu","Sat"], classes: ["1A","2A","3A"], stops: 8 },
  { number: "12431", name: "Trivandrum Rajdhani", from: "TVC", to: "NZM", fromName: "Thiruvananthapuram", toName: "Hazrat Nizamuddin", dep: "08:10", arr: "05:15", dur: "45h 05m", days: ["Tue","Fri","Sun"], classes: ["1A","2A","3A"], stops: 12 },
];

const dayLabels: Record<string, string> = {
  Mon: "M", Tue: "T", Wed: "W", Thu: "T", Fri: "F", Sat: "S", Sun: "S",
};

const classColors: Record<string, string> = {
  "1A": "bg-purple-200 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200",
  "2A": "bg-blue-200 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200",
  "3A": "bg-cyan-200 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200",
  SL: "bg-green-200 text-green-800 dark:bg-green-900/60 dark:text-green-200",
  "2S": "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

export function TrainsClient() {
  const [search, setSearch] = useState("");
  const { t } = useT();
  const [dayFilter, setDayFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");

  const filtered = useMemo(() => {
    return allTrains.filter((t) => {
      const q = search.toLowerCase();
      if (q && !t.name.toLowerCase().includes(q) && !t.number.includes(q) && !t.fromName.toLowerCase().includes(q) && !t.toName.toLowerCase().includes(q)) return false;
      if (dayFilter && !t.days.includes(dayFilter)) return false;
      if (classFilter && !t.classes.includes(classFilter)) return false;
      return true;
    });
  }, [search, dayFilter, classFilter]);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold">{t("schedule.page_title")}</h1>
          <p className="mt-2 text-slate-300">{t("schedule.page_subtitle")}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 -mt-6 sm:px-6 lg:px-8">
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("schedule.search_placeholder")}
                className="pl-9"
              />
            </div>
            <select value={dayFilter} onChange={(e) => setDayFilter(e.target.value)} className="flex h-9 w-full rounded-[5px] border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-[130px]">
              <option value="">{t("schedule.all_days")}</option>
              {days.map((d) => <option key={d} value={d}>{t("day." + d)}</option>)}
            </select>
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="flex h-9 w-full rounded-[5px] border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-[150px]">
              <option value="">{t("schedule.all_classes")}</option>
              <option value="1A">{t("schedule.class_1a")}</option>
              <option value="2A">{t("schedule.class_2a")}</option>
              <option value="3A">{t("schedule.class_3a")}</option>
              <option value="SL">{t("schedule.class_sl")}</option>
              <option value="2S">{t("schedule.class_2s")}</option>
            </select>
          </div>
        </Card>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-sm text-muted-foreground mb-4">
          {t("schedule.showing_prefix")} {filtered.length} {t("schedule.showing_of")} {allTrains.length} {t("schedule.showing_trains")}
        </div>

        <div className="space-y-3">
          {filtered.map((train) => (
            <Link
              key={train.number}
              href={`/trains/${train.number}/schedule`}
              className="block rounded-[5px] border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-[#1E5EFF]/30 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 lg:w-64 shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[5px] bg-[#1E5EFF]/10 text-[#1E5EFF]">
                    <Train className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">{t("train." + train.number + ".name")}</h3>
                    <span className="font-mono text-xs font-medium text-[#1E5EFF]">{train.number}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-1">
                  <div className="text-center min-w-[80px]">
                    <div className="text-lg font-bold">{train.dep}</div>
                    <div className="text-[11px] text-muted-foreground">{t("station." + train.from)} ({train.from})</div>
                  </div>
                  <div className="flex flex-col items-center flex-1 px-2">
                    <div className="w-full h-px bg-border relative">
                      <ArrowRight className="absolute right-0 -top-2 h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{train.dur} · {train.stops} {t("schedule.stops")}</span>
                  </div>
                  <div className="text-center min-w-[80px]">
                    <div className="text-lg font-bold">{train.arr}</div>
                    <div className="text-[11px] text-muted-foreground">{t("station." + train.to)} ({train.to})</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex gap-1">
                    {days.map((d) => (
                      <span
                        key={d}
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                            train.days.includes(d)
                              ? "bg-[#1E5EFF] text-white"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-400"
                        }`}
                      >
                        {dayLabels[d]}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {train.classes.map((c) => (
                      <span key={c} className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${classColors[c]}`}>
                        {c}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-[#1E5EFF] font-medium flex items-center gap-1 mt-1">
                    {t("schedule.view_schedule")} <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}

              {filtered.length === 0 && (
            <Card className="text-center py-16">
              <Search className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium">{t("schedule.no_results")}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("schedule.no_results_msg")}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
