import { cn } from "@/lib/utils";

export interface MoodOption {
  value: string;
  emoji: string;
  label: string;
}

export const DEFAULT_MOODS: MoodOption[] = [
  { value: "calm", emoji: "😌", label: "Calm" },
  { value: "happy", emoji: "🙂", label: "Happy" },
  { value: "tired", emoji: "😴", label: "Tired" },
  { value: "focused", emoji: "🤔", label: "Focused" },
  { value: "spark", emoji: "✨", label: "Inspired" },
];

export interface MoodSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  options?: MoodOption[];
  className?: string;
}

export function MoodSelector({
  value,
  onChange,
  options = DEFAULT_MOODS,
  className,
}: MoodSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Select your mood"
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange?.(opt.value)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-2xl px-4 py-3 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] -translate-y-0.5"
                : "bg-accent/40 text-foreground hover:bg-accent",
            )}
          >
            <span className="text-2xl leading-none">{opt.emoji}</span>
            <span className="text-xs font-medium">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
