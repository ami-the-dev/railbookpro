"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Ticket, ChevronRight, Train, Search } from "lucide-react";
import { useT } from "@/lib/i18n/i18n-context";

export function SearchCard() {
  const { t } = useT();
  const router = useRouter();
  const [pnr, setPnr] = useState("");
  const [trainInput, setTrainInput] = useState("");

  const handlePnrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnr.length >= 10) {
      router.push(`/pnr?pnr=${pnr}`);
    }
  };

  const handleTrainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trainInput.trim()) {
      router.push(`/live-train?train=${trainInput.trim()}`);
    }
  };

  return (
    <div className="relative mx-auto -mt-32 max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-2xl sm:p-8">
        <div className="relative grid gap-8 md:grid-cols-2 md:divide-x md:divide-slate-100">

          {/* PNR Form */}
          <form onSubmit={handlePnrSubmit} className="flex flex-col justify-between space-y-4 pr-0 md:pr-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-[#0052CC]">
                <FileText className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-base text-slate-900">{t("nav.pnr")}</span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder={t("pnr.placeholder")}
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-11 py-3.5 text-sm font-medium focus:border-blue-500 focus:bg-white focus:outline-none transition"
              />
              <Ticket className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            <button type="submit" className="flex w-full items-center justify-between rounded-xl bg-[#0052CC] px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition">
              <span>{t("booking.checkpnr")}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>

          {/* OR Divider */}
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-100 bg-white p-3 text-[11px] font-extrabold text-slate-400 shadow-md md:block tracking-wider z-20">
            {t("search.or")}
          </div>

          {/* Train Form */}
          <form onSubmit={handleTrainSubmit} className="flex flex-col justify-between space-y-4 pt-6 md:pt-0 md:pl-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-orange-50 p-3 text-[#FF6B00]">
                <Train className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-base text-slate-900">{t("nav.live_train")}</span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder={t("live_train.placeholder")}
                value={trainInput}
                onChange={(e) => setTrainInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-11 py-3.5 text-sm font-medium focus:border-orange-500 focus:bg-white focus:outline-none transition"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            <button type="submit" className="flex w-full items-center justify-between rounded-xl bg-[#FF6B00] px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-orange-600 transition">
              <span>{t("live_train.track")}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
