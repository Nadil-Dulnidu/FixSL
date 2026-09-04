import React from "react";
import Link from "next/link";
import { ShieldAlert, Heart, Phone, ExternalLink, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#060912] text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 border border-amber-300/40">
                <ShieldAlert className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Fix<span className="text-amber-400">SL</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              FixSL is an open civic initiative empowering Sri Lankan citizens to report, track, and verify public road hazards, broken utilities, and infrastructure breakdowns.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>for Sri Lanka 🇱🇰</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/report" className="text-slate-400 hover:text-amber-400 transition-colors font-medium">
                  Report New Hazard
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-slate-400 hover:text-amber-400 transition-colors font-medium">
                  Live Community Map
                </Link>
              </li>
              <li>
                <Link href="/#track" className="text-slate-400 hover:text-amber-400 transition-colors font-medium">
                  Track by ID
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-slate-400 hover:text-amber-400 transition-colors font-medium">
                  How Verification Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency & Municipal Contacts */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
              Emergency Hotlines
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5 clay-inset">
                <span className="text-slate-400">Police Emergency:</span>
                <span className="font-bold text-amber-400 font-mono">119</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5 clay-inset">
                <span className="text-slate-400">Suwa Seriya:</span>
                <span className="font-bold text-amber-400 font-mono">1990</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5 clay-inset">
                <span className="text-slate-400">Colombo Municipal:</span>
                <span className="font-bold text-amber-400 font-mono">011-2684290</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5 clay-inset">
                <span className="text-slate-400">RDA Hotline:</span>
                <span className="font-bold text-amber-400 font-mono">1968</span>
              </li>
            </ul>
          </div>

          {/* Civic Governance */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
              Authority Access
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Municipal officers and authorized repair contractors can log in to update repair statuses and schedule maintenance dispatch.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 clay-pill transition-all"
            >
              <span>Access Authority Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FixSL Civic Platform. Open Public Transparency Initiative.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Colombo, Western Province, LK
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

