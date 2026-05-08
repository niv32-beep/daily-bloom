import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { TimelineBlock } from "./timeline-block";
import { EmptyState } from "@/components/empty-state";
import type { ScheduleBlock } from "@/lib/use-schedule";

export interface ScheduleTimelineProps {
  blocks: ScheduleBlock[];
  onMove: (fromId: string, toId: string) => void;
  onRemove: (id: string) => void;
}

export function ScheduleTimeline({ blocks, onMove, onRemove }: ScheduleTimelineProps) {
  const [dragId, setDragId] = useState<string | null>(null);

  if (blocks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 bg-background/40 p-10 text-center">
        <p className="text-base text-muted-foreground">
          No plan yet. Tap <span className="font-medium text-foreground">Generate plan</span> to
          shape your day.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {blocks.map((b) => (
        <TimelineBlock
          key={b.id}
          block={b}
          isDragging={dragId === b.id}
          onDragStart={setDragId}
          onDrop={(toId) => {
            if (dragId && dragId !== toId) onMove(dragId, toId);
            setDragId(null);
          }}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
