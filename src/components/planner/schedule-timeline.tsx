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
      <EmptyState
        icon={<CalendarDays className="h-5 w-5" />}
        title="No plan yet"
        description="Tap Generate plan to shape a calm, adaptive day."
      />
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
