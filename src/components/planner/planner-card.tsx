import * as React from "react";
import { cn } from "@/lib/utils";

export interface PlannerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padded?: boolean;
}

export const PlannerCard = React.forwardRef<HTMLDivElement, PlannerCardProps>(
  ({ className, interactive, padded = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-soft)] transition-all duration-200",
        padded && "p-6",
        interactive && "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg",
        className,
      )}
      {...props}
    />
  ),
);
PlannerCard.displayName = "PlannerCard";

export function PlannerCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4 flex items-center gap-3", className)} {...props} />;
}

export function PlannerCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold leading-tight text-foreground", className)}
      {...props}
    />
  );
}

export function PlannerCardSubtitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}
