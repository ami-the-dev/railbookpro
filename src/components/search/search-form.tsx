"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useT } from "@/lib/i18n/i18n-context";
import { Search, ArrowRightLeft, MapPin } from "lucide-react";

const popularRoutes = [
  { from: "New Delhi", to: "Mumbai" },
  { from: "Howrah", to: "New Delhi" },
  { from: "Chennai", to: "Bangalore" },
  { from: "Mumbai", to: "Ahmedabad" },
  { from: "Pune", to: "Mumbai" },
  { from: "Sealdah", to: "New Delhi" },
];

const travelClasses = [
  { value: "all" },
  { value: "sl" },
  { value: "3a" },
  { value: "2a" },
  { value: "1a" },
  { value: "cc" },
  { value: "2s" },
  { value: "gen" },
];

export function SearchForm({ showHeading }: { showHeading?: boolean }) {
  const { t } = useT();
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [coachClass, setCoachClass] = useState("all");

  const swapStations = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (date) params.set("date", date);
    if (coachClass !== "all") params.set("class", coachClass);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {showHeading && (
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">{t("search.book_title")}</h1>
          <p className="mt-1 text-sm text-slate-500">{t("search.book_subtitle")}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="from">{t("search.from")}</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="from"
                placeholder={t("search.selectstation")}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="to">{t("search.to")}</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="to"
                placeholder={t("search.selectstation")}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="date">{t("search.date")}</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="class">{t("search.class")}</Label>
            <select
              id="class"
              value={coachClass}
              onChange={(e) => setCoachClass(e.target.value)}
              className="flex h-9 w-full rounded-[5px] border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {travelClasses.map(({ value }) => (
                <option key={value} value={value}>
                  {t("search.class_" + value)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full gap-2">
              <Search className="h-4 w-4" />
              {t("search.searchtrains")}
            </Button>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-xs font-medium text-muted-foreground">
            {t("search.popularroutes")}
          </p>
          <div className="flex flex-wrap gap-2">
            {popularRoutes.map((route) => (
              <button
                key={`${route.from}-${route.to}`}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  setFrom(route.from);
                  setTo(route.to);
                }}
              >
                {route.from}
                <ArrowRightLeft className="h-2.5 w-2.5" />
                {route.to}
              </button>
            ))}
          </div>
        </div>
    </form>
    </div>
  );
}
