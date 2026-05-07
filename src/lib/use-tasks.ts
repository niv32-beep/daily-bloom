import { useCallback } from "react";
import { useLocalStorage } from "./storage";
import { useLearning } from "./use-learning";
import type { Task, Subtask } from "./task-types";

const KEY = "lumen.tasks.v2";

const seed: Task[] = [
  {
    id: "seed-1",
    title: "Take a mindful breath",
    done: false,
    priority: "low",
    category: "health",
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
];

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(KEY, seed);
  const { recordCompletion } = useLearning();

  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "done" | "subtasks"> & { subtasks?: Subtask[] }) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        done: false,
        subtasks: task.subtasks ?? [],
        ...task,
      };
      setTasks((prev) => [newTask, ...prev]);
    },
    [setTasks],
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    },
    [setTasks],
  );

  const deleteTask = useCallback(
    (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id)),
    [setTasks],
  );

  const toggleTask = useCallback(
    (id: string) =>
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const nextDone = !t.done;
          if (nextDone) recordCompletion();
          return { ...t, done: nextDone };
        }),
      ),
    [setTasks, recordCompletion],
  );

  const toggleSubtask = useCallback(
    (taskId: string, subId: string) =>
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                subtasks: t.subtasks.map((s) =>
                  s.id === subId ? { ...s, done: !s.done } : s,
                ),
              }
            : t,
        ),
      ),
    [setTasks],
  );

  return { tasks, addTask, updateTask, deleteTask, toggleTask, toggleSubtask };
}
