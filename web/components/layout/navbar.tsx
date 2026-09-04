"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  PlusCircle,
  MapPin,
  Menu,
  X,
  Lock,
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

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      <header className="sticky top-0 z-50 w-full pt-3 px-3 sm:px-6 lg:px-8 pointer-events-none">
        <div className="max-w-7xl mx-auto">
          <div className="clay-card pointer-events-auto h-16 sm:h-18 px-4 sm:px-6 flex items-center justify-between border-white/10 backdrop-blur-2xl">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-400/20 via-slate-900 to-slate-950 p-1 flex items-center justify-center shadow-lg shadow-amber-500/15 border border-amber-400/30 clay-icon-well overflow-hidden group-hover:scale-105 transition-transform">
                <Image
                  src="/fixsl-img.png"
                  alt="FixSL Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-white">
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

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/report">
                <Button
                  variant="default"
                  size="default"
                  className="gap-2 font-bold px-5 shadow-amber-500/25"
                >
                  <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                  Report Issue
                </Button>
              </Link>
              <Link href="/admin">
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-2xl text-slate-400 hover:text-white"
                  title="Authority & Admin Portal"
                >
                  <Lock className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger & Report Buttons */}
            <div className="flex md:hidden items-center gap-2">
              <Link href="/report">
                <Button variant="default" size="sm" className="gap-1.5 text-xs font-bold px-3.5 h-10 min-h-[40px] rounded-xl touch-manipulation shadow-amber-500/20">
                  <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                  Report
                </Button>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-slate-300 hover:text-white shadow-md active:scale-95 transition-transform touch-manipulation"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer Menu */}
          {mobileMenuOpen && (
            <div className="pointer-events-auto md:hidden mt-2 clay-card p-4 space-y-2 animate-in fade-in slide-in-from-top-3 duration-200 border-amber-500/20 shadow-2xl">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all min-h-[44px] touch-manipulation",
                      isActive
                        ? "clay-btn-secondary text-amber-400 border-amber-500/30"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5 text-amber-400" />
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 min-h-[44px] touch-manipulation"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  Admin & Municipal Portal
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

