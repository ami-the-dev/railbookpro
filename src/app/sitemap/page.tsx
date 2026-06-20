"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/i18n-context";

const sections = [
  {
    titleKey: "footer.services",
    links: [
      { href: "/pnr", labelKey: "nav.pnr" },
      { href: "/live-train", labelKey: "nav.live_train" },
      { href: "/search", labelKey: "nav.seats" },
      { href: "/trains", labelKey: "nav.schedule" },
    ],
  },
  {
    titleKey: "sitemap.account",
    links: [
      { href: "/auth/login", labelKey: "nav.login" },
      { href: "/auth/register", labelKey: "nav.register" },
      { href: "/bookings", labelKey: "booking.mybookings" },
    ],
  },
  {
    titleKey: "sitemap.company",
    links: [
      { href: "/about", labelKey: "footer.about" },
      { href: "/contact", labelKey: "footer.contact_us" },
      { href: "/faq", labelKey: "footer.faqs" },
      { href: "/feedback", labelKey: "sitemap.feedback" },
    ],
  },
  {
    titleKey: "sitemap.legal",
    links: [
      { href: "/privacy", labelKey: "footer.privacy" },
      { href: "/terms", labelKey: "footer.terms" },
    ],
  },
];

export default function SitemapPage() {
  const { t } = useT();
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold">{t("sitemap.page_title")}</h1>
          <p className="mt-2 text-slate-300">{t("sitemap.page_subtitle")}</p>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => (
            <div key={section.titleKey}>
              <h3 className="font-bold text-slate-800 mb-3">{t(section.titleKey)}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[#1E5EFF] hover:underline">
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
