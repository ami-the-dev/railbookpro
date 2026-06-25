"use client";

import { useState, useRef, useEffect } from "react";
import { useT } from "@/lib/i18n/i18n-context";
import { Globe, ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale, locales, localeNames } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="inline-flex items-center justify-center gap-1.5 h-8 rounded-[5px] px-3 text-xs font-medium border border-white/30 text-white hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
        suppressHydrationWarning
      >
        <Globe className="h-4 w-4 shrink-0" />
        <span className="text-xs hidden lg:inline">{localeNames[locale]}</span>
        <ChevronDown className={`h-3 w-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-700 bg-[#030D22] py-1 shadow-xl z-50">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => { setLocale(l); setOpen(false); }}
              suppressHydrationWarning
              className={`w-full text-left px-4 py-2 text-xs font-medium transition ${
                l === locale
                  ? "text-[#0052CC] bg-blue-500/10"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {localeNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
