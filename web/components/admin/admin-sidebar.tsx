"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
      <div className="p-6 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-400/20 via-slate-900 to-slate-950 p-1 flex items-center justify-center shadow-lg shadow-amber-500/15 border border-amber-400/30 clay-icon-well overflow-hidden group-hover:scale-105 transition-transform">
            <Image
              src="/fixsl-img.png"
              alt="FixSL Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-lg font-black text-white tracking-tight">
              Fix<span className="text-amber-400">SL</span>
            </span>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              Admin Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200",
                active
                  ? "clay-btn-secondary text-amber-400 border-amber-500/30 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              )}
            >
              <item.icon
                className={cn(
                  "h-4.5 w-4.5",
                  active ? "text-amber-400" : "text-slate-400"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer — User */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-2xl clay-inset">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-8 w-8 rounded-xl",
              },
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-300 truncate">Municipal Admin</p>
            <p className="text-[10px] text-slate-400 font-mono">Authorized Session</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="secondary"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-slate-900/90 border-white/10 rounded-2xl"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle admin sidebar"
      >
        {mobileOpen ? (
          <X className="h-5 w-5 text-slate-200" />
        ) : (
          <Menu className="h-5 w-5 text-slate-200" />
        )}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-[#090d16]/95 border-r border-white/10 z-40 transition-transform duration-300 backdrop-blur-2xl",
          "lg:translate-x-0 lg:static lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

