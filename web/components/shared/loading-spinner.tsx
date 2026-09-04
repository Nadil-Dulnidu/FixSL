import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({
  size = "md",
  text,
  className,
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3 p-4", className)}
      {...props}
    >
      <div
        className={cn(
          "rounded-full border-amber-500/20 border-t-amber-500 animate-spin",
          sizeClasses[size]
        )}
      />
      {text && <p className="text-sm font-medium text-slate-400">{text}</p>}
    </div>
  );
}
