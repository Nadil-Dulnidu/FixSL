import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-amber-500 text-slate-950 font-bold",
        secondary:
          "border-slate-700 bg-slate-800 text-slate-200",
        destructive:
          "border-red-500/30 bg-red-500/15 text-red-400",
        outline:
          "border-slate-700 text-slate-300",
        amber:
          "border-amber-500/30 bg-amber-500/10 text-amber-400",
        emerald:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        blue:
          "border-blue-500/30 bg-blue-500/10 text-blue-400",
        purple:
          "border-purple-500/30 bg-purple-500/10 text-purple-400",
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
