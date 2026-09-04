import * as React from "react";
import { FolderSearch, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionHref?: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title = "No issues found",
  description = "No reported civic issues match your current filters.",
  actionHref,
  actionText,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "clay-card flex flex-col items-center justify-center p-10 sm:p-12 text-center max-w-lg mx-auto my-8 border-white/5",
        className
      )}
      {...props}
    >
      <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mb-5 text-amber-400 clay-icon-well">
        {icon || <FolderSearch className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-400 mb-6 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionHref && actionText ? (
        <Link href={actionHref}>
          <Button variant="default" className="gap-2 rounded-2xl font-bold shadow-amber-500/25">
            <Plus className="w-4 h-4 stroke-[2.5]" />
            {actionText}
          </Button>
        </Link>
      ) : onAction && actionText ? (
        <Button onClick={onAction} variant="default" className="gap-2 rounded-2xl font-bold shadow-amber-500/25">
          {actionText}
        </Button>
      ) : null}
    </div>
  );
}

