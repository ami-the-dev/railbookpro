"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Ticket, IndianRupee, Train, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const agentLinks = [
  { href: "/agent/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agent/bookings", label: "Bookings & Commissions", icon: Ticket },
];

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }

  const isAgent = (session?.user as any)?.role === "agent" || (session?.user as any)?.role === "distributor";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-emerald-700 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-emerald-800">
          <Link href="/agent/dashboard" className="flex items-center gap-2">
            <Train className="h-6 w-6" />
            <span className="text-lg font-bold">Agent Panel</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {agentLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-white/20 text-white"
                    : "text-emerald-100 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-emerald-800 space-y-2">
          <div className="flex items-center gap-3 text-sm text-emerald-200">
            <div className="flex-1 truncate">{session?.user?.name || "Agent"}</div>
            <Button variant="ghost" size="sm" className="text-emerald-200 hover:text-white p-0 h-auto" onClick={() => router.push("/")}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-emerald-300">{(session?.user as any)?.role}</div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
