import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "clay-btn-primary",
        secondary: "clay-btn-secondary",
        outline:
          "border border-slate-700/80 bg-slate-900/60 text-slate-200 hover:bg-slate-800/80 hover:text-white hover:border-slate-600 shadow-md shadow-black/30 active:scale-[0.98] active:translate-y-0.5",
        ghost:
          "text-slate-300 hover:bg-slate-800/60 hover:text-white active:scale-[0.98]",
        destructive:
          "bg-gradient-to-br from-red-500 to-rose-600 text-white font-bold border border-red-400/40 shadow-lg shadow-red-500/25 hover:from-red-400 hover:to-red-500 active:scale-[0.98] active:translate-y-0.5",
        clay: "clay-btn-primary",
        subtleAmber:
          "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 shadow-inner active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-xl px-3.5 text-xs",
        lg: "h-13 rounded-2xl px-8 text-base font-bold",
        icon: "h-10 w-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

