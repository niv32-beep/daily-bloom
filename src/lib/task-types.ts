export type TaskPriority = "low" | "medium" | "high";

export type TaskCategory = "personal" | "work" | "health" | "learning" | "other";

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  done: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: string; // ISO date
  subtasks: Subtask[];
  createdAt: string;
  // AI scheduler fields (optional — populated by handleGenerateSchedule)
  duration?: number; // minutes
  timeSlot?: string; // "HH:MM"
  alignmentReason?: string;
}

export const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const CATEGORY_OPTIONS: { value: TaskCategory; label: string; emoji: string }[] = [
  { value: "personal", label: "Personal", emoji: "💜" },
  { value: "work", label: "Work", emoji: "💼" },
  { value: "health", label: "Health", emoji: "🌿" },
  { value: "learning", label: "Learning", emoji: "📚" },
  { value: "other", label: "Other", emoji: "✨" },
];
