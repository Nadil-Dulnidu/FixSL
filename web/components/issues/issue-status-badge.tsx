"use client";

import { Badge } from "@/components/ui/badge";
import { ISSUE_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface IssueStatusBadgeProps {
  status: string;
  className?: string;
}

export function IssueStatusBadge({ status, className }: IssueStatusBadgeProps) {
  const config = ISSUE_STATUSES[status];

  if (!config) {
    return (
      <Badge variant="outline" className={className}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge className={cn(config.badgeClass, "font-semibold", className)}>
      {config.label}
    </Badge>
  );
}
