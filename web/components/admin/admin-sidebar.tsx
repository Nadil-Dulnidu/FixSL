"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  AlertTriangle,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Issues",
    href: "/admin/issues",
    icon: AlertTriangle,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header / Brand */}
      <div className="p-6 border-b border-slate-800/60">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Shield className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <span className="text-lg font-bold text-white">
              Fix<span className="text-amber-400">SL</span>
            </span>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/25 shadow-sm shadow-amber-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              )}
            >
              <item.icon
                className={cn(
                  "h-4.5 w-4.5",
                  active ? "text-amber-400" : "text-slate-500"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer — User */}
      <div className="p-4 border-t border-slate-800/60">
        <div className="flex items-center gap-3 px-3 py-2">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 truncate">Admin Account</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-slate-900/90 border border-slate-800"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle admin sidebar"
      >
        {mobileOpen ? (
          <X className="h-5 w-5 text-slate-300" />
        ) : (
          <Menu className="h-5 w-5 text-slate-300" />
        )}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-slate-950/95 border-r border-slate-800/60 z-40 transition-transform duration-300 backdrop-blur-xl",
          "lg:translate-x-0 lg:static lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
