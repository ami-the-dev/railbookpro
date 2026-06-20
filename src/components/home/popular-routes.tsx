"use client";

import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";
import { useT } from "@/lib/i18n/i18n-context";

const routes = [
  { from: "Delhi", to: "Mumbai", slugFrom: "delhi", slugTo: "mumbai", duration: "16h 35m", trains: 24, delayMinutes: 12, delayColor: "text-[#FF6B00]" },
  { from: "Patna", to: "Delhi", slugFrom: "patna", slugTo: "delhi", duration: "11h 20m", trains: 18, delayMinutes: 8, delayColor: "text-[#10B981]" },
  { from: "Kolkata", to: "Chennai", slugFrom: "kolkata", slugTo: "chennai", duration: "23h 45m", trains: 20, delayMinutes: 15, delayColor: "text-[#FF6B00]" },
  { from: "Bangalore", to: "Hyderabad", slugFrom: "bangalore", slugTo: "hyderabad", duration: "09h 30m", trains: 16, delayMinutes: 5, delayColor: "text-[#10B981]" },
];

export function PopularRoutes() {
  const { t } = useT();
  return (
    <section>
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{t("search.popularroutes")}</h2>
        <div className="mx-auto mt-1.5 h-0.5 w-10 bg-[#0052CC] rounded-full"></div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {routes.map(({ from, to, slugFrom, slugTo, duration, trains: trainCount, delayMinutes, delayColor }) => (
          <Link key={`${from}-${to}`} href={`/search?from=${slugFrom}&to=${slugTo}`} className="block rounded-2xl border border-slate-100 bg-white p-5 shadow-xs hover:border-slate-200 transition cursor-pointer">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <span className="font-extrabold text-sm text-slate-800">{t("city." + slugFrom)}</span>
              <ArrowLeftRight className="h-3.5 w-3.5 text-[#0052CC]" strokeWidth={3} />
              <span className="font-extrabold text-sm text-slate-800">{t("city." + slugTo)}</span>
            </div>
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-slate-400 font-medium">{t("route.duration")}</span>
                  <span className="font-bold text-slate-700">{duration}</span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-slate-400 font-medium">{t("route.trains")}</span>
                  <span className="font-bold text-slate-700">{trainCount}</span>
                </div>
              </div>
              <div className="flex justify-between border-t border-dashed border-slate-100 pt-2.5">
                <span className="text-slate-400 font-medium">{t("route.avg_delay")}</span>
                <span className={`font-extrabold ${delayColor}`}>{delayMinutes} {t("live.min")}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
