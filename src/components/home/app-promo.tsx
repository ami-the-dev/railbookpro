"use client";

import { Smartphone } from "lucide-react";
import { useT } from "@/lib/i18n/i18n-context";

export function AppPromo() {
  const { t } = useT();
  return (
    <section>
      <div className="rounded-[24px] bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-100/40 p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-10">

        <div className="flex flex-col sm:flex-row gap-8 items-center w-full lg:w-auto">
          <div className="flex gap-4 shrink-0">
            <div className="relative h-44 w-24 bg-slate-900 rounded-[20px] border-[3px] border-slate-800 shadow-xl p-1.5 flex flex-col justify-between">
              <div className="h-1 w-6 bg-slate-800 rounded-full mx-auto"></div>
              <div className="bg-[#0052CC] h-full w-full rounded-xl mt-1 p-1 text-[5px] text-white font-bold">
                RailBookPro App
                <div className="bg-white/10 h-10 w-full rounded-md mt-2"></div>
              </div>
            </div>
            <div className="relative h-44 w-24 bg-slate-900 rounded-[20px] border-[3px] border-slate-800 shadow-xl p-1.5 flex flex-col justify-between -translate-y-3">
              <div className="h-1 w-6 bg-slate-800 rounded-full mx-auto"></div>
              <div className="bg-slate-50 h-full w-full rounded-xl mt-1 p-1 text-[5px] text-slate-800 font-bold border border-slate-100">
                Live Map Track
                <div className="bg-emerald-500/10 h-12 w-full rounded-md mt-2"></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900"><span className="text-[#0052CC]">RailBookPro</span> {t("app.heading")}</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">{t("app.desc")}</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-bold text-slate-600">
              <li className="flex items-center gap-1.5"><span className="text-[#0052CC]">🎯</span> {t("app.feature_pnr")}</li>
              <li className="flex items-center gap-1.5"><span className="text-[#0052CC]">🪑</span> {t("app.feature_seat")}</li>
              <li className="flex items-center gap-1.5"><span className="text-[#0052CC]">📋</span> {t("app.feature_schedule")}</li>
              <li className="flex items-center gap-1.5"><span className="text-[#0052CC]">🔔</span> {t("app.feature_alerts")}</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs shrink-0 w-full sm:w-auto justify-center">
          <div className="text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-slate-50 rounded border border-slate-200 p-1 flex flex-wrap gap-0.5">
              <div className="w-3 h-3 bg-slate-900"></div><div className="w-3 h-3 bg-slate-900"></div><div className="w-3 h-3 bg-slate-100"></div><div className="w-3 h-3 bg-slate-900"></div>
              <div className="w-3 h-3 bg-slate-100"></div><div className="w-3 h-3 bg-slate-900"></div><div className="w-3 h-3 bg-slate-900"></div><div className="w-3 h-3 bg-slate-100"></div>
            </div>
            <span className="text-[10px] text-slate-400 font-bold mt-1.5 block">{t("app.scan")}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2">
              <Smartphone className="h-4 w-4" /> {t("app.google_play")}
            </a>
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2">
              <Smartphone className="h-4 w-4" /> {t("app.app_store")}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
