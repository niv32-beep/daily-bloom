import { cn } from "@/lib/utils";
import { ENERGY_OPTIONS, type EnergyValue } from "@/lib/use-checkins";

export interface EnergyPickerProps {
  value?: EnergyValue;
  onChange: (v: EnergyValue) => void;
  className?: string;
}

export function EnergyPicker({ value, onChange, className }: EnergyPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Energy"
      className={cn("grid grid-cols-4 gap-2", className)}
    >
      {ENERGY_OPTIONS.map((e) => {
        const selected = value === e.value;
        const bars = e.value;
        return (
          <button
            key={e.value}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(e.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl px-2 py-4 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[var(--shadow-soft)] -translate-y-0.5"
                : "bg-accent/40 text-foreground hover:bg-accent",
            )}
          >
            <div className="flex items-end gap-0.5 h-6">
              {[1, 2, 3, 4].map((b) => (
                <span
                  key={b}
                  className={cn(
                    "w-1.5 rounded-full transition-colors",
                    b <= bars
                      ? selected
                        ? "bg-primary-foreground"
                        : "bg-primary"
                      : "bg-border",
                  )}
                  style={{ height: `${b * 25}%` }}
                />
              ))}
            </div>
            <span className="text-xs font-medium">{e.label}</span>
          </button>
        );
      })}
    </div>
  );
}
