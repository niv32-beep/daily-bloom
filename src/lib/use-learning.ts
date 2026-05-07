import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./storage";

// Lightweight summary: only aggregates, never raw history.
export interface LearningStats {
  // hour-of-day (0-23) -> completion count
  hourCounts: Record<number, number>;
  // normalized task title -> times rolled over without completing
  staleCounts: Record<string, number>;
  totalCompleted: number;
  lastUpdated: string;
}

const KEY = "lumen.learning.v1";

const initial: LearningStats = {
  hourCounts: {},
  staleCounts: {},
  totalCompleted: 0,
  lastUpdated: new Date(0).toISOString(),
};

export function normalizeTitle(t: string): string {
  return t.toLowerCase().trim().slice(0, 60);
}

export function useLearning() {
  const [stats, setStats] = useLocalStorage<LearningStats>(KEY, initial);

  const recordCompletion = useCallback(
    (hour: number = new Date().getHours()) => {
      setStats((s) => ({
        ...s,
        hourCounts: { ...s.hourCounts, [hour]: (s.hourCounts[hour] ?? 0) + 1 },
        totalCompleted: s.totalCompleted + 1,
        lastUpdated: new Date().toISOString(),
      }));
    },
    [setStats],
  );

  const recordStale = useCallback(
    (titles: string[]) => {
      if (titles.length === 0) return;
      setStats((s) => {
        const next = { ...s.staleCounts };
        for (const t of titles) {
          const k = normalizeTitle(t);
          if (!k) continue;
          next[k] = (next[k] ?? 0) + 1;
        }
        return { ...s, staleCounts: next, lastUpdated: new Date().toISOString() };
      });
    },
    [setStats],
  );

  const reset = useCallback(() => setStats(initial), [setStats]);

  const insights = useMemo(() => deriveInsights(stats), [stats]);

  return { stats, insights, recordCompletion, recordStale, reset };
}

export interface LearningInsights {
  preferredHour: number | null;
  preferredWindow: string | null;
  repeatedStale: { title: string; count: number }[];
  suggestion: string;
}

function deriveInsights(s: LearningStats): LearningInsights {
  const entries = Object.entries(s.hourCounts).map(([h, c]) => [Number(h), c] as const);
  let preferredHour: number | null = null;
  let max = 0;
  for (const [h, c] of entries) {
    if (c > max) {
      max = c;
      preferredHour = h;
    }
  }

  const preferredWindow =
    preferredHour === null
      ? null
      : `${pad(preferredHour)}:00–${pad((preferredHour + 1) % 24)}:00`;

  const repeatedStale = Object.entries(s.staleCounts)
    .map(([title, count]) => ({ title, count }))
    .filter((r) => r.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  let suggestion = "Keep going — patterns will appear after a few days.";
  if (s.totalCompleted >= 3 && preferredHour !== null) {
    const part = preferredHour < 12 ? "mornings" : preferredHour < 17 ? "afternoons" : "evenings";
    suggestion = `You finish most things in the ${part}. Try scheduling harder tasks around ${preferredWindow}.`;
  }
  if (repeatedStale.length > 0) {
    suggestion += ` A few tasks keep rolling over — try breaking "${repeatedStale[0].title}" into smaller steps.`;
  }

  return { preferredHour, preferredWindow, repeatedStale, suggestion };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
