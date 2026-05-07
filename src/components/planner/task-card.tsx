import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CalendarDays, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_OPTIONS, type Task } from "@/lib/task-types";
import { format } from "date-fns";

const priorityStyles = {
  low: "bg-secondary text-secondary-foreground",
  medium: "bg-accent text-accent-foreground",
  high: "bg-primary/15 text-primary",
} as const;

export interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onToggleSubtask: (taskId: string, subId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onToggle, onToggleSubtask, onEdit, onDelete }: TaskCardProps) {
  const [open, setOpen] = useState(false);
  const category = CATEGORY_OPTIONS.find((c) => c.value === task.category);
  const hasSubs = task.subtasks.length > 0;
  const subDone = task.subtasks.filter((s) => s.done).length;

  return (
    <div className="group rounded-2xl border border-border/60 bg-card px-5 py-4 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-center gap-4">
        <Checkbox
          checked={task.done}
          onCheckedChange={() => onToggle(task.id)}
          className="h-5 w-5 rounded-md"
          aria-label={`Toggle ${task.title}`}
        />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-base font-medium",
              task.done ? "text-muted-foreground line-through" : "text-foreground",
            )}
          >
            {task.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {category && (
              <span className="inline-flex items-center gap-1">
                {category.emoji} {category.label}
              </span>
            )}
            {task.dueDate && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {format(new Date(task.dueDate), "MMM d")}
              </span>
            )}
            {hasSubs && (
              <span>
                {subDone}/{task.subtasks.length} subtasks
              </span>
            )}
          </div>
        </div>
        <span
          className={cn(
            "hidden rounded-full px-3 py-1 text-xs font-medium capitalize sm:inline-block",
            priorityStyles[task.priority],
          )}
        >
          {task.priority}
        </span>
        {hasSubs && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle subtasks"
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
            />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(task)}
          className="opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Edit task"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(task.id)}
          className="opacity-0 transition-opacity group-hover:opacity-100"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {open && hasSubs && (
        <ul className="mt-3 space-y-1 border-t border-border/60 pt-3 pl-9">
          {task.subtasks.map((s) => (
            <li key={s.id} className="flex items-center gap-3">
              <Checkbox
                checked={s.done}
                onCheckedChange={() => onToggleSubtask(task.id, s.id)}
                className="h-4 w-4 rounded"
              />
              <span
                className={cn(
                  "text-sm",
                  s.done ? "text-muted-foreground line-through" : "text-foreground",
                )}
              >
                {s.title}
              </span>
            </li>
          ))}
        </ul>
      )}

      {task.notes && !task.done && (
        <p className="mt-3 border-t border-border/60 pt-3 pl-9 text-sm text-muted-foreground">
          {task.notes}
        </p>
      )}
    </div>
  );
}
