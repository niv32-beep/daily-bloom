import { useCallback, useMemo } from "react";
import { useLocalStorage } from "./storage";
import type { Task, TaskPriority } from "./task-types";
import type { MoodValue, EnergyValue } from "./use-checkins";

export interface ScheduleBlock {
  id: string;
  taskId?: string;
  title: string;
  kind: "focus" | "break";
  start: string; // "HH:MM"
  durationMin: number;
}

export interface ScheduleConfig {
  startHour: number;
  energy: EnergyValue;
  mood: MoodValue;
  maxTasks: number;
  focusMin: number;
  breakMin: number;
}

const PRIORITY_WEIGHT: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 };

export function buildConfig(mood: MoodValue, energy: EnergyValue): ScheduleConfig {
  // Base focus by energy
  let focusMin = energy >= 4 ? 50 : energy === 3 ? 40 : energy === 2 ? 25 : 20;
  let breakMin = energy >= 3 ? 10 : 15;
  let maxTasks = energy >= 3 ? 6 : 4;

  if (mood === "overwhelmed") {
    maxTasks = Math.min(maxTasks, 3);
    breakMin = Math.max(breakMin, 15);
    focusMin = Math.min(focusMin, 25);
  }
  if (mood === "tired") {
    focusMin = Math.min(focusMin, 20);
    breakMin = Math.max(breakMin, 12);
  }

  return { startHour: 9, energy, mood, maxTasks, focusMin, breakMin };
}

function orderTasks(tasks: Task[], cfg: ScheduleConfig): Task[] {
  const open = tasks.filter((t) => !t.done);
  const sorted = [...open].sort((a, b) => {
    const pa = PRIORITY_WEIGHT[a.priority];
    const pb = PRIORITY_WEIGHT[b.priority];
    // High energy → hardest first (desc); low energy → easiest first (asc)
    return cfg.energy >= 3 ? pb - pa : pa - pb;
  });
  return sorted.slice(0, cfg.maxTasks);
}

function addMin(start: string, mins: number): string {
  const [h, m] = start.split(":").map(Number);
  const total = h * 60 + m + mins;
  const hh = Math.floor(total / 60) % 24;
  const mm = total % 60;
  return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
}

export function generatePlan(tasks: Task[], cfg: ScheduleConfig): ScheduleBlock[] {
  const ordered = orderTasks(tasks, cfg);
  const blocks: ScheduleBlock[] = [];
  let cursor = `${cfg.startHour.toString().padStart(2, "0")}:00`;

  ordered.forEach((task, idx) => {
    blocks.push({
      id: crypto.randomUUID(),
      taskId: task.id,
      title: task.title,
      kind: "focus",
      start: cursor,
      durationMin: cfg.focusMin,
    });
    cursor = addMin(cursor, cfg.focusMin);

    if (idx < ordered.length - 1) {
      blocks.push({
        id: crypto.randomUUID(),
        title: "Break — stretch, water, breathe",
        kind: "break",
        start: cursor,
        durationMin: cfg.breakMin,
      });
      cursor = addMin(cursor, cfg.breakMin);
    }
  });

  return blocks;
}

const KEY = "lumen.schedule.v1";

export function useSchedule() {
  const [blocks, setBlocks] = useLocalStorage<ScheduleBlock[]>(KEY, []);

  const setPlan = useCallback((next: ScheduleBlock[]) => setBlocks(next), [setBlocks]);

  const move = useCallback(
    (fromId: string, toId: string) => {
      setBlocks((prev) => {
        const from = prev.findIndex((b) => b.id === fromId);
        const to = prev.findIndex((b) => b.id === toId);
        if (from < 0 || to < 0 || from === to) return prev;
        const next = [...prev];
        const [item] = next.splice(from, 1);
        next.splice(to, 0, item);
        // Re-flow start times based on first block's start
        const start = next[0]?.start ?? "09:00";
        let cursor = start;
        return next.map((b) => {
          const placed = { ...b, start: cursor };
          cursor = addMin(cursor, b.durationMin);
          return placed;
        });
      });
    },
    [setBlocks],
  );

  const remove = useCallback(
    (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id)),
    [setBlocks],
  );

  const clear = useCallback(() => setBlocks([]), [setBlocks]);

  const totalMin = useMemo(
    () => blocks.reduce((sum, b) => sum + b.durationMin, 0),
    [blocks],
  );

  return { blocks, setPlan, move, remove, clear, totalMin };
}
