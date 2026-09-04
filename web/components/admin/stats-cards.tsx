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
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards: StatCardConfig[] = [
    {
      label: "Total Issues",
      value: stats.total,
      icon: FileWarning,
      iconBg: "bg-amber-500/15 border-amber-500/25",
      iconColor: "text-amber-400",
      description: "All reported infrastructure issues",
    },
    {
      label: "Reported",
      value: stats.reported,
      icon: AlertTriangle,
      iconBg: "bg-blue-500/15 border-blue-500/25",
      iconColor: "text-blue-400",
      description: "Awaiting community verification",
    },
    {
      label: "Verified",
      value: stats.verified,
      icon: Eye,
      iconBg: "bg-amber-500/15 border-amber-500/25",
      iconColor: "text-amber-400",
      description: "Confirmed by citizens",
    },
    {
      label: "In Progress",
      value: stats.in_progress,
      icon: Clock,
      iconBg: "bg-purple-500/15 border-purple-500/25",
      iconColor: "text-purple-400",
      description: "Work crew assigned",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/15 border-emerald-500/25",
      iconColor: "text-emerald-400",
      description: "Repair completed",
    },
    {
      label: "Critical",
      value: stats.critical,
      icon: Flame,
      iconBg: "bg-red-500/15 border-red-500/25",
      iconColor: "text-red-400",
      description: "Urgent attention needed",
    },
    {
      label: "High Priority",
      value: stats.high,
      icon: TrendingUp,
      iconBg: "bg-orange-500/15 border-orange-500/25",
      iconColor: "text-orange-400",
      description: "Elevated priority issues",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="clay-card clay-card-hover p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-2.5 sm:gap-4 border-white/5"
        >
          <div
            className={cn(
              "h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border clay-icon-well",
              card.iconBg
            )}
          >
            <card.icon className={cn("h-4 w-4 sm:h-5 sm:w-5 stroke-[2.2]", card.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5 sm:mb-1 truncate">
              {card.label}
            </p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-white leading-none">
              {card.value}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-1 truncate font-medium hidden sm:block">
              {card.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

