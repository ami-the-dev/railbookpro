"use client";

import Link from "next/link";
import { FileText, MapPin, Armchair, Calendar } from "lucide-react";
import { useT } from "@/lib/i18n/i18n-context";

const services = [
  { icon: FileText, titleKey: "quick.pnr", descKey: "quick.pnr_desc", href: "/pnr", color: "bg-blue-500", actionKey: "quick.check_now" },
  { icon: MapPin, titleKey: "quick.live", descKey: "quick.live_desc", href: "/live-train", color: "bg-[#10B981]", actionKey: "quick.track_now" },
  { icon: Armchair, titleKey: "quick.seat", descKey: "quick.seat_desc", href: "/search", color: "bg-[#9333EA]", actionKey: "quick.check_now" },
  { icon: Calendar, titleKey: "quick.schedule", descKey: "quick.schedule_desc", href: "/trains", color: "bg-[#FF6B00]", actionKey: "quick.check_now" },
];

export function QuickServices() {
  const { t } = useT();
  return (
    <section>
      <div className="text-center">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{t("quick.title")}</h2>
        <div className="mx-auto mt-1.5 h-0.5 w-10 bg-[#0052CC] rounded-full"></div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ icon: Icon, titleKey, descKey, href, color, actionKey }) => (
          <Link key={titleKey} href={href}
            className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className={`rounded-xl ${color} p-3 text-white shadow-xs`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">{t(titleKey)}</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{t(descKey)}</p>
              <span className="mt-3.5 inline-flex items-center text-xs font-bold text-[#0052CC] group-hover:underline">
                {t(actionKey)} <span className="ml-1">&rarr;</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
