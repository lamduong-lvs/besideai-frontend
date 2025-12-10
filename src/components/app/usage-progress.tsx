"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";

type UsageProgressProps = {
  used: number;
  limit?: number | null;
  label: string;
  upgradeHref?: string;
};

/**
 * Displays usage vs quota with upgrade prompt when near limit.
 */
export function UsageProgress({
  used,
  limit,
  label,
  upgradeHref = "/pricing",
}: UsageProgressProps) {
  const safeLimit = limit ?? 0;
  const percent = safeLimit > 0 ? Math.min((used / safeLimit) * 100, 100) : 0;
  const isNearLimit = percent >= 80 && percent < 100;
  const isExceeded = percent >= 100;

  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{label}</div>
        <div
          className={cn(
            "text-sm",
            isExceeded
              ? "text-red-500"
              : isNearLimit
              ? "text-orange-500"
              : "text-muted-foreground"
          )}
        >
          {safeLimit > 0 ? `${used} / ${safeLimit}` : `${used}`}
        </div>
      </div>

      <Progress value={percent} />

      {isExceeded && (
        <div className="text-sm text-red-500">
          Limit reached.{" "}
          <Link href={upgradeHref} className="underline">
            Upgrade to increase your limit
          </Link>
          .
        </div>
      )}

      {isNearLimit && !isExceeded && (
        <div className="text-sm text-orange-500">
          Almost at limit.{" "}
          <Link href={upgradeHref} className="underline">
            Consider upgrading
          </Link>
          .
        </div>
      )}
    </div>
  );
}

