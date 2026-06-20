"use client";

import { useState } from "react";
import Link from "next/link";
import { Train } from "lucide-react";
import { useT } from "@/lib/i18n/i18n-context";

interface TrainInfo {
  number: string;
  name: string;
  station: string;
  platform: string;
  time: string;
  delay: boolean;
  delayMinutes?: number;
  route: string[];
}

const trains: TrainInfo[] = [
  { number: "12951", name: "Mumbai Rajdhani Express", station: "Mumbai CSMT", platform: "PF 03", time: "10:35 AM", delay: false, route: ["NDLS", "CNB", "BPL", "BCT"] },
  { number: "12301", name: "Howrah Rajdhani Express", station: "Howrah Jn", platform: "PF 08", time: "11:20 AM", delay: true, delayMinutes: 25, route: ["NDLS", "CNB", "PNBE", "HWH"] },
  { number: "12615", name: "Grand Trunk Express", station: "Chennai Central", platform: "PF 02", time: "09:45 AM", delay: false, route: ["NDLS", "CNB", "BPL", "SC", "BZA", "MAS"] },
  { number: "12431", name: "Swarn Jayanti Rajdhani", station: "New Delhi", platform: "PF 05", time: "12:15 PM", delay: true, delayMinutes: 10, route: ["NDLS", "CNB", "BZA", "MAS"] },
];

const stationCoords: Record<string, { lat: number; lng: number }> = {
  NDLS: { lat: 28.642, lng: 77.221 },
  CNB: { lat: 26.449, lng: 80.332 },
  BPL: { lat: 23.259, lng: 77.412 },
  SC: { lat: 17.433, lng: 78.501 },
  BZA: { lat: 16.520, lng: 80.618 },
  MAS: { lat: 13.082, lng: 80.275 },
  BCT: { lat: 18.970, lng: 72.819 },
  HWH: { lat: 22.583, lng: 88.344 },
  PNBE: { lat: 25.613, lng: 85.137 },
};

const MIN_LAT = 8;
const MAX_LAT = 36;
const MIN_LNG = 68;
const MAX_LNG = 90;

function toSvgCoord(lat: number, lng: number) {
  return {
    x: ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * 200,
    y: ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * 200,
  };
}

function stationToSvg(code: string) {
  const coord = stationCoords[code];
  if (!coord) return { x: 100, y: 100 };
  return toSvgCoord(coord.lat, coord.lng);
}

function getRouteCenter(routes: string[]) {
  let latSum = 0, lngSum = 0, count = 0;
  for (const code of routes) {
    const c = stationCoords[code];
    if (c) { latSum += c.lat; lngSum += c.lng; count++; }
  }
  return count ? { lat: latSum / count, lng: lngSum / count } : { lat: 20.5, lng: 78.5 };
}

export function LiveTrains() {
  const { t } = useT();
  const [selected, setSelected] = useState(0);
  const train = trains[selected];
  const points = train.route.map(code => stationToSvg(code));
  const center = getRouteCenter(train.route);

  return (
    <section>
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">{t("live.title")}</h3>
            <Link href="/trains" className="text-xs font-bold text-[#0052CC] hover:underline">
              {t("live.view_all")} &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {trains.map((train, i) => (
              <button
                key={train.number}
                onClick={() => setSelected(i)}
                className={`grid grid-cols-1 sm:grid-cols-4 gap-3 rounded border p-4 shadow-xs sm:whitespace-nowrap transition cursor-pointer w-full text-left ${
                  selected === i
                    ? "border-[#0052CC] bg-blue-50"
                    : "border-slate-100 bg-white hover:border-blue-200"
                }`}
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-extrabold text-[#0052CC]">{train.number}</p>
                  <p className="text-xs font-medium text-[#62738C]">{t("train." + train.number + ".station")}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">{t("train." + train.number + ".name")}</p>
                  <p className={`text-xs font-bold ${train.delay ? "text-rose-500" : "text-emerald-600"}`}>{train.delay ? `${t("live.status_delayed")} ${train.delayMinutes} ${t("live.min")}` : t("live.status_on_time")}</p>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between sm:block">
                    <p className="text-xs font-extrabold text-[#0052CC]">{t("live.pf")} {train.platform.replace(/\D/g, '')}</p>
                    <span className="sm:hidden">
                      <span className={`flex items-center gap-1 rounded-full ${train.delay ? "bg-rose-50 border border-rose-100/60" : "bg-emerald-50 border border-emerald-100/60"} px-2.5 py-1 text-[10px] font-extrabold ${train.delay ? "text-rose-500" : "text-emerald-600"}`}>
                        {t("live.badge")}
                        <span className="flex items-end gap-[3px] h-3">
                          <span className="w-[3px] bg-current rounded-sm animate-bounce" style={{ height: '8px', animationDelay: '0ms', animationDuration: '400ms' }} />
                          <span className="w-[3px] bg-current rounded-sm animate-bounce" style={{ height: '12px', animationDelay: '100ms', animationDuration: '500ms' }} />
                          <span className="w-[3px] bg-current rounded-sm animate-bounce" style={{ height: '6px', animationDelay: '200ms', animationDuration: '350ms' }} />
                          <span className="w-[3px] bg-current rounded-sm animate-bounce" style={{ height: '10px', animationDelay: '300ms', animationDuration: '450ms' }} />
                        </span>
                      </span>
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#62738C]">{train.time}</p>
                </div>
                <div className="hidden sm:flex items-start justify-end">
                  <span className={`flex items-center gap-1 rounded-full ${train.delay ? "bg-rose-50 border border-rose-100/60" : "bg-emerald-50 border border-emerald-100/60"} px-2.5 py-1 text-[10px] font-extrabold ${train.delay ? "text-rose-500" : "text-emerald-600"}`}>
                    {t("live.badge")}
                    <span className="flex items-end gap-[3px] h-3">
                      <span className="w-[3px] bg-current rounded-sm animate-bounce" style={{ height: '8px', animationDelay: '0ms', animationDuration: '400ms' }} />
                      <span className="w-[3px] bg-current rounded-sm animate-bounce" style={{ height: '12px', animationDelay: '100ms', animationDuration: '500ms' }} />
                      <span className="w-[3px] bg-current rounded-sm animate-bounce" style={{ height: '6px', animationDelay: '200ms', animationDuration: '350ms' }} />
                      <span className="w-[3px] bg-current rounded-sm animate-bounce" style={{ height: '10px', animationDelay: '300ms', animationDuration: '450ms' }} />
                    </span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="relative h-full min-h-[380px] w-full overflow-hidden rounded-[24px] border border-slate-100 bg-white p-4 flex flex-col justify-between shadow-xs">
            <div className="absolute inset-0 rounded-[24px] overflow-hidden">
              <iframe
                src={`https://www.google.com/maps?q=${center.lat},${center.lng}&output=embed&z=5`}
                className="w-full h-full"
                style={{ filter: "grayscale(0.3) opacity(0.65)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${train.name} Route`}
              />
            </div>

            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-bold text-slate-600 bg-white/95 px-3 py-1.5 rounded-xl shadow-xs border border-slate-50">
                {train.number} &middot; {train.name}
              </span>
              <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-ping" />
            </div>

            <div className="absolute inset-0 z-[5]">
              <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
                {points.length >= 2 && (
                  <polyline
                    points={points.map(p => `${p.x},${p.y}`).join(" ")}
                    stroke="#0052CC"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.6"
                  />
                )}
              </svg>
              {train.route.map((code, i) => {
                const p = points[i];
                const bgColor = train.delay ? "#F43F5E" : "#10B981";
                return (
                  <div
                    key={code}
                    className="absolute flex flex-col items-center gap-0.5"
                    style={{
                      left: `${(p.x / 200) * 100}%`,
                      top: `${(p.y / 200) * 100}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div className="flex items-center justify-center rounded-full p-1.5 shadow-xs" style={{ backgroundColor: bgColor }}>
                      <Train className="h-4 w-4 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-[8px] font-extrabold text-slate-700 bg-white/90 px-1 rounded leading-none">
                      {code}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center z-10 w-full bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 font-bold tracking-wide">
                {train.route[0]} &rarr; {train.route[train.route.length - 1]} &middot; {train.route.length} {t("live.stops")}
              </span>
              <Link href={`/live-train?train=${train.number}`} className="text-[11px] font-extrabold text-[#0052CC] hover:underline">
                {t("live.track_live")} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
