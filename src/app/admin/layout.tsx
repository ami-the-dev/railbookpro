"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Ticket, BarChart3, Settings, Train, LogOut, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: Ticket },
  { href: "/admin/agents", label: "Agents", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/config", label: "API Config", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex-1 min-h-0 bg-gray-50 flex">
      <aside className="w-64 bg-[#1D4ED8] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-blue-800">
          <Link href="/admin" className="flex items-center gap-2">
            <Train className="h-6 w-6" />
            <span className="text-lg font-bold">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-white/20 text-white"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center gap-3 text-sm text-blue-200">
            <div className="flex-1 truncate">{session?.user?.name || "Admin"}</div>
            <Link href="/" className="hover:text-white transition-colors">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
