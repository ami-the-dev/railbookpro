"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useT } from "@/lib/i18n/i18n-context";
import { Train, LogOut, LogIn, Menu } from "lucide-react";

const navLinks = [
  { href: "/", labelKey: "nav.home" },
  { href: "/pnr", labelKey: "nav.pnr" },
  { href: "/live-train", labelKey: "nav.live_train" },
  { href: "/trains", labelKey: "nav.schedule" },
  { href: "/search", labelKey: "nav.seats" },
  { href: "/contact", labelKey: "nav.contact" },
];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useT();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#030D22]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 lg:pr-0 pr-4">
          <div className="rounded-xl bg-[#0052CC] p-1.5 sm:p-2 text-white">
            <Train className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <span className="text-sm sm:text-xl font-extrabold tracking-tight text-white">RailBookPro</span>
            <p className="text-[8px] sm:text-[10px] font-bold text-[#0052CC] uppercase tracking-wider leading-none mt-0.5">{t("header.live_tagline")}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map(({ href, labelKey }) => (
            <Link
              key={labelKey}
              href={href}
               className={`text-sm font-semibold transition ${
                 pathname === href
                   ? "text-[#0052CC] font-bold"
                   : "text-slate-400 hover:text-white"
               }`}
            >
                    {t(labelKey)}
                  </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <LanguageSwitcher />

          {session ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => signOut()} className="lg:hidden" title="Sign Out">
                <LogOut className="h-4 w-4" />
              </Button>
              <div className="hidden lg:block">
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="lg:hidden">
                <Button variant="ghost" size="icon" className="border border-white/30 text-white hover:text-white hover:bg-white/10">
                  <LogIn className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login" className="hidden lg:block">
                <Button className="rounded-xl bg-[#0052CC] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition">
                  {t("nav.login")}
                </Button>
              </Link>
            </>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Train className="h-5 w-5 text-[#0052CC]" />
                  {t("app.name")}
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {navLinks.map(({ href, labelKey }) => (
                  <Link
                    key={labelKey}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`rounded-[5px] px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                      pathname === href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {t(labelKey)}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 border-t border-slate-700 pt-4 flex flex-col items-center gap-3">
                <LanguageSwitcher />
                {session ? (
                  <Button variant="ghost" size="sm" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                ) : (
                  <Link href="/auth/login" onClick={() => setOpen(false)} className="w-full">
                    <Button className="w-full rounded-xl bg-[#0052CC] text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition">
                      {t("nav.login")}
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
