"use client";

import { useT } from "@/lib/i18n/i18n-context";
import { ShieldCheck, MapPin, Clock, Zap } from "lucide-react";

export function HeroSection() {
  const { t } = useT();

  return (
    <section className="relative min-h-[480px] bg-[#030D22] pt-20 pb-44 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#030D22]/90 via-[#030D22]/60 to-transparent lg:w-2/3 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030D22] via-transparent to-transparent z-10" />
          <img
            src="/railbookpro-banner.png"
            alt="Rail Background Banner"
            className="h-full w-full object-cover object-center opacity-85"
          />
        </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl leading-[1.15]">
            {t("app.tagline")}
          </h1>
          <p className="mt-4 text-base text-slate-300 max-w-md">
            {t("app.description")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/10 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4 text-blue-400" /> {t("hero.accuracy")}
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/10 text-xs font-semibold">
              <MapPin className="h-4 w-4 text-[#10B981]" /> {t("hero.live_tracking")}
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/10 text-xs font-semibold">
              <Clock className="h-4 w-4 text-amber-400" /> {t("hero.updates")}
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-md border border-white/10 text-xs font-semibold">
              <Zap className="h-4 w-4 text-cyan-400" /> {t("hero.fast_easy")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
