"use client";

import Link from "next/link";
import { Train, Globe, MessageCircle, Camera, Video, Phone, Mail, Headphones } from "lucide-react";
import { useT } from "@/lib/i18n/i18n-context";

export function Footer() {
  const { t } = useT();
  return (
    <footer className="bg-[#030D22] text-slate-400 text-xs border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 text-white">
            <div className="rounded-xl bg-[#0052CC] p-1.5">
              <Train className="h-5 w-5" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-white">RailBookPro</span>
          </div>
          <p className="leading-relaxed max-w-sm text-slate-400">
            {t("footer.description")}
          </p>
          <div className="flex gap-3 pt-1">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full text-white hover:bg-[#0052CC] transition"><Globe className="h-4 w-4" /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full text-white hover:bg-sky-400 transition"><MessageCircle className="h-4 w-4" /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full text-white hover:bg-pink-600 transition"><Camera className="h-4 w-4" /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full text-white hover:bg-red-600 transition"><Video className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 text-sm tracking-wide">{t("footer.services")}</h4>
          <ul className="space-y-2.5 font-medium">
            <li><Link href="/pnr" className="hover:text-white transition">{t("nav.pnr")}</Link></li>
            <li><Link href="/live-train" className="hover:text-white transition">{t("nav.live_train")}</Link></li>
            <li><Link href="/search" className="hover:text-white transition">{t("nav.seats")}</Link></li>
            <li><Link href="/trains" className="hover:text-white transition">{t("nav.schedule")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 text-sm tracking-wide">{t("footer.useful_links")}</h4>
          <ul className="space-y-2.5 font-medium">
            <li><Link href="/about" className="hover:text-white transition">{t("footer.about")}</Link></li>
            <li><Link href="/faq" className="hover:text-white transition">{t("footer.faqs")}</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition">{t("footer.privacy")}</Link></li>
            <li><Link href="/terms" className="hover:text-white transition">{t("footer.terms")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 text-sm tracking-wide">{t("footer.contact_us")}</h4>
          <ul className="space-y-3 font-medium">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-blue-500 shrink-0" /> {t("footer.phone")}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-500 shrink-0" /> {t("footer.email")}</li>
            <li className="flex items-center gap-2"><Headphones className="h-4 w-4 text-blue-500 shrink-0" /> {t("footer.support")}</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-slate-800/40 text-center py-6 text-[11px] text-slate-500 font-medium">
        {t("footer.copyright")}
      </div>
    </footer>
  );
}
