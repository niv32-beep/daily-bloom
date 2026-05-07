import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type TaskPriority = "low" | "medium" | "high";

export interface TaskCardProps {
  id: string;
  title: string;
  done?: boolean;
  time?: string;
  priority?: TaskPriority;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-secondary text-secondary-foreground",
  medium: "bg-accent text-accent-foreground",
  high: "bg-primary/15 text-primary",
};

export function TaskCard({
  id,
  title,
  done = false,
  time,
  priority,
  onToggle,
  onDelete,
}: TaskCardProps) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card px-5 py-4 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5">
      <Checkbox
        checked={done}
        onCheckedChange={() => onToggle?.(id)}
        className="h-5 w-5 rounded-md"
        aria-label={`Mark ${title} as ${done ? "incomplete" : "complete"}`}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-base font-medium transition-colors",
            done ? "text-muted-foreground line-through" : "text-foreground",
          )}
        >
          {title}
        </p>
        {time && (
          <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {time}
          </span>
        )}
      </div>
      {priority && (
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium capitalize",
            priorityStyles[priority],
          )}
        >
          {priority}
        </span>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(id)}
          className="h-9 w-9 opacity-0 transition-opacity group-hover:opacity-100"
          aria-label={`Delete ${title}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
