import { cn } from "@/lib/utils";
import { MOOD_OPTIONS, type MoodValue } from "@/lib/use-checkins";

export interface MoodPickerProps {
  value?: MoodValue;
  onChange: (v: MoodValue) => void;
  className?: string;
}

export function MoodPicker({ value, onChange, className }: MoodPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Mood"
      className={cn("grid grid-cols-3 gap-2 sm:grid-cols-6", className)}
    >
      {MOOD_OPTIONS.map((m) => {
        const selected = value === m.value;
        return (
          <button
            key={m.value}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(m.value)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl px-2 py-3 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[var(--shadow-soft)] -translate-y-0.5"
                : "bg-accent/40 text-foreground hover:bg-accent",
            )}
          >
            <span className="text-2xl leading-none">{m.emoji}</span>
            <span className="text-xs font-medium">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
