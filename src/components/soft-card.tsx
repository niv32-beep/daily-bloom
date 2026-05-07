import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SoftCardProps {
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function SoftCard({ title, subtitle, icon, className, children }: SoftCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      {(title || icon) && (
        <div className="mb-4 flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              {icon}
            </div>
          )}
          <div className="flex flex-col leading-tight">
            {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
