"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  PlusCircle,
  MapPin,
  Menu,
  X,
  Lock,
  ChevronRight,
  HelpCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: ShieldAlert },
  { href: "/report", label: "Report Issue", icon: PlusCircle },
  { href: "/map", label: "Live Map", icon: MapPin },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <header className="sticky top-0 z-50 w-full pt-2.5 sm:pt-3 px-2.5 sm:px-6 lg:px-8 pointer-events-none">
        <div className="max-w-7xl mx-auto">
          <div className="clay-card pointer-events-auto h-15 sm:h-18 px-3.5 sm:px-6 flex items-center justify-between border-white/10 backdrop-blur-2xl">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform border border-amber-300/40 shrink-0">
                <ShieldAlert className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                    Fix<span className="text-amber-400">SL</span>
                  </span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-950/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                      isActive
                        ? "clay-btn-secondary text-amber-400 border-amber-500/30 shadow-md"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-amber-400" : "text-slate-400")} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/report">
                <Button
                  variant="default"
                  size="default"
                  className="gap-2 font-bold px-5 shadow-amber-500/25 min-h-[44px]"
                >
                  <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                  Report Issue
                </Button>
              </Link>
              <Link href="/admin">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-2xl text-slate-400 hover:text-white min-h-[44px] min-w-[44px]"
                  title="Authority & Admin Portal"
                >
                  <Lock className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile Actions & Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <Link href="/report">
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1.5 text-xs font-bold px-3 h-9 rounded-xl shadow-amber-500/20"
                >
                  <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Report</span>
                </Button>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 rounded-xl border border-white/10 bg-slate-900/90 text-slate-200 hover:text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="pointer-events-auto md:hidden mt-2 clay-card p-4 space-y-3 animate-drawer border-amber-500/20 shadow-2xl max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="space-y-1.5">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-semibold transition-all min-h-[48px]",
                        isActive
                          ? "clay-btn-secondary text-amber-400 border-amber-500/30 shadow-md"
                          : "text-slate-200 hover:bg-slate-800/80 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn("w-5 h-5", isActive ? "text-amber-400" : "text-amber-400/80")} />
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </Link>
                  );
                })}
              </div>

              {/* Extra Mobile Shortcuts */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <Link
                  href="/#track"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 min-h-[44px]"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-slate-400" />
                    <span>Track Issue by ID</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    FIX-XXXX
                  </span>
                </Link>

                <Link
                  href="/#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 min-h-[44px]"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>How Verification Works</span>
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 min-h-[44px] bg-slate-950/40 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-amber-400/80" />
                    <span>Admin & Authority Portal</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Login</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

