"use client";

import { Card } from "@/components/ui/card";
import { useT } from "@/lib/i18n/i18n-context";

export default function FAQPage() { const { t } = useT();
  const faqKeys = [
    { qKey: "faq.q1", aKey: "faq.a1" },
    { qKey: "faq.q2", aKey: "faq.a2" },
    { qKey: "faq.q3", aKey: "faq.a3" },
    { qKey: "faq.q4", aKey: "faq.a4" },
  ];
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold">{t("faq.page_title")}</h1>
          <p className="mt-2 text-slate-300">{t("faq.page_subtitle")}</p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {faqKeys.map(({ qKey, aKey }) => (
            <Card key={qKey} className="p-6">
              <h3 className="font-bold mb-2">{t(qKey)}</h3>
              <p className="text-sm text-muted-foreground">{t(aKey)}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
