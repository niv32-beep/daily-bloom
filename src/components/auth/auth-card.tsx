import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[oklch(0.96_0.03_300)] via-[oklch(0.94_0.05_295)] to-[oklch(0.92_0.06_290)] px-4 py-10 dark:from-[oklch(0.22_0.03_295)] dark:via-[oklch(0.25_0.04_295)] dark:to-[oklch(0.2_0.05_290)]">
      <div className="w-full max-w-md animate-fade-in rounded-2xl border border-border/50 bg-card/80 p-8 shadow-[0_20px_60px_-20px_oklch(0.6_0.15_295/0.35)] backdrop-blur-md">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {subtitle ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {children}
        {footer ? <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div> : null}
      </div>
    </div>
  );
}
