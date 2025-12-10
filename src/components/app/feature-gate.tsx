"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCurrentPlan from "@/lib/users/useCurrentPlan";

type FeatureGateProps = {
  children: React.ReactNode;
  requiredPlan?: string;
  featureName?: string;
  upgradeHref?: string;
};

/**
 * Client-side feature gate based on current user plan.
 * Renders children if user has the required plan, otherwise shows an upgrade prompt.
 */
export function FeatureGate({
  children,
  requiredPlan = "premium",
  featureName = "this feature",
  upgradeHref = "/pricing",
}: FeatureGateProps) {
  const { currentPlan, isLoading } = useCurrentPlan();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border p-6 text-sm text-muted-foreground">
        Checking your plan...
      </div>
    );
  }

  const hasAccess = currentPlan?.codename === requiredPlan;

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border p-6 text-center">
        <Lock className="h-10 w-10 text-muted-foreground" />
        <div className="space-y-1">
          <h3 className="text-base font-semibold">
            {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)}{" "}
            feature
          </h3>
          <p className="text-sm text-muted-foreground">
            Upgrade to access {featureName}.
          </p>
        </div>
        <Link href={upgradeHref}>
          <Button>View plans</Button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

