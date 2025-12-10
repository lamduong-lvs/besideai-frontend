"use client";

import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import useCurrentPlan from "@/lib/users/useCurrentPlan";

/**
 * Shows current plan badge for the signed-in user.
 */
export function PlanBadge() {
  const { currentPlan, isLoading } = useCurrentPlan();

  if (isLoading) {
    return <Badge variant="secondary">Checking plan...</Badge>;
  }

  if (!currentPlan) {
    return <Badge variant="outline">Free</Badge>;
  }

  const { name, codename } = currentPlan;

  const planColors: Record<string, string> = {
    premium: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200",
    professional:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
  };

  const color = planColors[codename] ?? "bg-muted text-foreground";

  return (
    <Badge className={`gap-1 ${color}`}>
      <Crown className="h-3.5 w-3.5" />
      {name || codename}
    </Badge>
  );
}

