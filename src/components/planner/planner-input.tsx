import * as React from "react";
import { cn } from "@/lib/utils";

export interface PlannerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const PlannerInput = React.forwardRef<HTMLInputElement, PlannerInputProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "h-11 w-full rounded-2xl border border-border/60 bg-background px-4 text-base text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50",
            error && "border-destructive focus:ring-destructive",
            className,
          )}
          {...props}
        />
        {(hint || error) && (
          <p className={cn("text-xs", error ? "text-destructive" : "text-muted-foreground")}>
            {error ?? hint}
          </p>
        )}
      </div>
    );
  },
);
PlannerInput.displayName = "PlannerInput";
