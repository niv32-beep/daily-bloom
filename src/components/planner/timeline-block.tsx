import { Coffee, Focus, X } from "lucide-react";
import type { ScheduleBlock } from "@/lib/use-schedule";
import { cn } from "@/lib/utils";

export interface TimelineBlockProps {
  block: ScheduleBlock;
  onRemove?: (id: string) => void;
  onDragStart?: (id: string) => void;
  onDragOver?: (id: string) => void;
  onDrop?: (id: string) => void;
  isDragging?: boolean;
}

export function TimelineBlock({
  block,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
}: TimelineBlockProps) {
  const isBreak = block.kind === "break";
  const Icon = isBreak ? Coffee : Focus;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.(block.id);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver?.(block.id);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop?.(block.id);
      }}
      className={cn(
        "group flex items-stretch gap-4 rounded-2xl border border-border/60 p-4 shadow-sm transition",
        "bg-gradient-to-br from-background to-secondary/40",
        isBreak && "from-accent/40 to-secondary/30 border-dashed",
        isDragging && "opacity-50",
        "hover:shadow-md cursor-grab active:cursor-grabbing",
      )}
    >
      <div className="flex w-20 shrink-0 flex-col items-start justify-center">
        <span className="text-base font-semibold text-foreground">{block.start}</span>
        <span className="text-xs text-muted-foreground">{block.durationMin} min</span>
      </div>
      <div className="flex flex-1 items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl",
            isBreak ? "bg-accent text-accent-foreground" : "bg-primary/15 text-primary",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium leading-snug text-foreground">{block.title}</p>
          <p className="text-xs text-muted-foreground">
            {isBreak ? "Break" : "Focus session"}
          </p>
        </div>
        {onRemove && (
          <button
            onClick={() => onRemove(block.id)}
            className="rounded-full p-2 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
            aria-label="Remove block"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
