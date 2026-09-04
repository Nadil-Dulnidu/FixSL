"use client";

import { Badge } from "@/components/ui/badge";
import { ISSUE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  AlertOctagon,
  Construction,
  LightbulbOff,
  Trash2,
  Waves,
  HelpCircle,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  AlertOctagon,
  Construction,
  LightbulbOff,
  Trash2,
  Waves,
  HelpCircle,
};

interface CategoryBadgeProps {
  category: string;
  className?: string;
  showIcon?: boolean;
}

export function CategoryBadge({
  category,
  className,
  showIcon = true,
}: CategoryBadgeProps) {
  const config = ISSUE_CATEGORIES[category];

  if (!config) {
    return (
      <Badge variant="outline" className={className}>
        {category}
      </Badge>
    );
  }

  const IconComponent = iconMap[config.icon];

  return (
    <Badge className={cn(config.badgeClass, "font-semibold gap-1.5", className)}>
      {showIcon && IconComponent && <IconComponent className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
}
