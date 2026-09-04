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
        "flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-slate-800 bg-slate-900/40 max-w-lg mx-auto my-8",
        className
      )}
      {...props}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-4 text-slate-400 shadow-inner">
        {icon || <FolderSearch className="w-7 h-7 text-amber-500/80" />}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-6 max-w-sm leading-relaxed">
        {description}
      </p>
      {actionHref && actionText ? (
        <Link href={actionHref}>
          <Button variant="default" className="gap-2">
            <Plus className="w-4 h-4" />
            {actionText}
          </Button>
        </Link>
      ) : onAction && actionText ? (
        <Button onClick={onAction} variant="default" className="gap-2">
          {actionText}
        </Button>
      ) : null}
    </div>
  );
}
