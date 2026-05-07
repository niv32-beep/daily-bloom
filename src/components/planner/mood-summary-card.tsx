import { PlannerCard, PlannerCardTitle, PlannerCardSubtitle } from "./planner-card";
import { Sparkles } from "lucide-react";
import {
  useCheckIns,
  MOOD_OPTIONS,
  ENERGY_OPTIONS,
} from "@/lib/use-checkins";
import { ClientDate } from "@/components/client-date";

export function MoodSummaryCard() {
  const { recent } = useCheckIns();

  if (recent.length === 0) {
    return (
      <PlannerCard className="space-y-2">
        <PlannerCardTitle>Mood & energy</PlannerCardTitle>
        <PlannerCardSubtitle>
          No check-ins yet — your story starts today. 🌙
        </PlannerCardSubtitle>
      </PlannerCard>
    );
  }

  const avgEnergy =
    recent.reduce((s, e) => s + e.energy, 0) / recent.length;
  const energyLabel =
    ENERGY_OPTIONS.find((o) => o.value === Math.round(avgEnergy))?.label ?? "—";

  const moodCount = recent.reduce<Record<string, number>>((acc, e) => {
    acc[e.mood] = (acc[e.mood] ?? 0) + 1;
    return acc;
  }, {});
  const topMoodKey = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0][0];
  const topMood = MOOD_OPTIONS.find((m) => m.value === topMoodKey);

  return (
    <PlannerCard className="space-y-4 bg-gradient-to-br from-accent/40 via-card to-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <PlannerCardTitle>This week</PlannerCardTitle>
          <PlannerCardSubtitle>Across {recent.length} check-in{recent.length === 1 ? "" : "s"}</PlannerCardSubtitle>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-background/60 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Most felt</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {topMood?.emoji} {topMood?.label}
          </p>
        </div>
        <div className="rounded-2xl bg-background/60 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Avg energy</p>
          <p className="mt-1 text-lg font-semibold text-foreground">{energyLabel}</p>
        </div>
      </div>

      <ul className="space-y-1.5">
        {recent.map((e) => {
          const m = MOOD_OPTIONS.find((x) => x.value === e.mood);
          const en = ENERGY_OPTIONS.find((x) => x.value === e.energy);
          return (
            <li
              key={e.id}
              className="flex items-center gap-3 rounded-xl bg-background/40 px-3 py-2 text-sm"
            >
              <span className="text-lg">{m?.emoji}</span>
              <span className="flex-1 text-foreground">{m?.label}</span>
              <span className="text-xs text-muted-foreground">{en?.label}</span>
              <ClientDate
                iso={e.date}
                options={{ month: "short", day: "numeric" }}
                className="w-14 text-right text-xs text-muted-foreground"
              />
            </li>
          );
        })}
      </ul>
    </PlannerCard>
  );
}
