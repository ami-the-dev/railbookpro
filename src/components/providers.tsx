"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={true} refetchInterval={300}>
      <ThemeProvider defaultTheme="light">
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
