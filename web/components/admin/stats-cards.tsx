"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  FileWarning,
  TrendingUp,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminStats } from "@/lib/actions/admin";

interface StatsCardsProps {
  stats: AdminStats;
}

interface StatCardConfig {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  description: string;
  accentBorder?: string;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards: StatCardConfig[] = [
    {
      label: "Total Issues",
      value: stats.total,
      icon: FileWarning,
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-400",
      description: "All reported infrastructure issues",
      accentBorder: "border-l-amber-500",
    },
    {
      label: "Reported",
      value: stats.reported,
      icon: AlertTriangle,
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
      description: "Awaiting community verification",
      accentBorder: "border-l-blue-500",
    },
    {
      label: "Verified",
      value: stats.verified,
      icon: Eye,
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-400",
      description: "Confirmed by citizens",
      accentBorder: "border-l-amber-400",
    },
    {
      label: "In Progress",
      value: stats.in_progress,
      icon: Clock,
      iconBg: "bg-purple-500/15",
      iconColor: "text-purple-400",
      description: "Work crew assigned",
      accentBorder: "border-l-purple-500",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      description: "Repair completed",
      accentBorder: "border-l-emerald-500",
    },
    {
      label: "Critical",
      value: stats.critical,
      icon: Flame,
      iconBg: "bg-red-500/15",
      iconColor: "text-red-400",
      description: "Urgent attention needed",
      accentBorder: "border-l-red-500",
    },
    {
      label: "High Priority",
      value: stats.high,
      icon: TrendingUp,
      iconBg: "bg-orange-500/15",
      iconColor: "text-orange-400",
      description: "Elevated priority issues",
      accentBorder: "border-l-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={cn(
            "clay-card clay-card-hover p-5 border-l-4 flex items-start gap-4",
            card.accentBorder
          )}
        >
          <div
            className={cn(
              "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border",
              card.iconBg,
              card.iconColor === "text-amber-400"
                ? "border-amber-500/20"
                : card.iconColor === "text-blue-400"
                ? "border-blue-500/20"
                : card.iconColor === "text-purple-400"
                ? "border-purple-500/20"
                : card.iconColor === "text-emerald-400"
                ? "border-emerald-500/20"
                : card.iconColor === "text-red-400"
                ? "border-red-500/20"
                : "border-orange-500/20"
            )}
          >
            <card.icon className={cn("h-5 w-5", card.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
              {card.label}
            </p>
            <p className="text-2xl font-bold text-white leading-none">
              {card.value}
            </p>
            <p className="text-xs text-slate-500 mt-1.5 truncate">
              {card.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
