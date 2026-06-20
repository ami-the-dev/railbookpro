import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { I18nProvider } from "@/lib/i18n/i18n-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RailBookPro - Book Train Tickets Online",
    template: "%s | RailBookPro",
  },
  description: "Book IRCTC train tickets online. Search trains, check seat availability, check PNR status and more.",
  keywords: ["train booking", "IRCTC", "railway", "PNR status", "train tickets"],
  openGraph: {
    title: "RailBookPro - Book Train Tickets Online",
    description: "Search, book and manage IRCTC train tickets online.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Toaster />
        <Providers>
          <I18nProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
