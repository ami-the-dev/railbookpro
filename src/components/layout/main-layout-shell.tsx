"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface MainLayoutShellProps {
  children: ReactNode;
  showFooter?: boolean;
}

export function MainLayoutShell({ children, showFooter = true }: MainLayoutShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
