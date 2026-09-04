import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 clay-pill",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-amber-500/20",
        secondary:
          "bg-slate-800/90 text-slate-200 border border-white/10 shadow-black/30",
        destructive:
          "bg-red-500/20 text-red-300 border border-red-500/30 shadow-red-500/10",
        outline:
          "border border-slate-700/80 bg-slate-900/50 text-slate-300",
        amber:
          "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-amber-500/10",
        emerald:
          "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/10",
        blue:
          "bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-blue-500/10",
        purple:
          "bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-purple-500/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

