"use client";

import { Badge } from "@/components/ui/badge";
import { ISSUE_PRIORITIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: string;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = ISSUE_PRIORITIES[priority];

  if (!config) {
    return (
      <Badge variant="outline" className={className}>
        {priority}
      </Badge>
    );
  }

  return (
    <Badge className={cn(config.badgeClass, "font-semibold", className)}>
      {config.label}
    </Badge>
  );
}
