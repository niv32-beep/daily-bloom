import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./storage";

export type MoodValue = "happy" | "calm" | "tired" | "overwhelmed" | "motivated" | "sad";
export type EnergyValue = 1 | 2 | 3 | 4;

export interface MoodOption {
  value: MoodValue;
  label: string;
  emoji: string;
}

export interface EnergyOption {
  value: EnergyValue;
  label: string;
}

export interface CheckIn {
  id: string;
  date: string; // ISO
  mood: MoodValue;
  energy: EnergyValue;
  note?: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { value: "happy", label: "Happy", emoji: "😊" },
  { value: "calm", label: "Calm", emoji: "😌" },
  { value: "motivated", label: "Motivated", emoji: "✨" },
  { value: "tired", label: "Tired", emoji: "😴" },
  { value: "overwhelmed", label: "Overwhelmed", emoji: "🌪️" },
  { value: "sad", label: "Sad", emoji: "🥺" },
];

export const ENERGY_OPTIONS: EnergyOption[] = [
  { value: 1, label: "Very Low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Medium" },
  { value: 4, label: "High" },
];

const KEY = "lumen.checkins.v1";

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

export function useCheckIns() {
  const [entries, setEntries, hydrated] = useLocalStorage<CheckIn[]>(KEY, []);

  const today = useMemo(() => {
    const k = dayKey(new Date().toISOString());
    return entries.find((e) => dayKey(e.date) === k);
  }, [entries]);

  const saveCheckIn = useCallback(
    (mood: MoodValue, energy: EnergyValue, note?: string) => {
      const now = new Date().toISOString();
      const k = dayKey(now);
      setEntries((prev) => {
        const others = prev.filter((e) => dayKey(e.date) !== k);
        return [{ id: crypto.randomUUID(), date: now, mood, energy, note }, ...others];
      });
    },
    [setEntries],
  );

  const recent = useMemo(() => entries.slice(0, 7), [entries]);

  return { entries, today, recent, saveCheckIn, hydrated };
}

