import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Sparkles, RefreshCw, Trash2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { SoftCard } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { ScheduleTimeline } from "@/components/planner/schedule-timeline";
import { useTasks } from "@/lib/use-tasks";
import { useCheckIns, MOOD_OPTIONS, ENERGY_OPTIONS } from "@/lib/use-checkins";
import { useSchedule, buildConfig, generatePlan } from "@/lib/use-schedule";
import { toast } from "sonner";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Planner — Lumen" }] }),
  component: Planner,
});

function Planner() {
  const { tasks } = useTasks();
  const { today } = useCheckIns();
  const { blocks, setPlan, move, remove, clear, totalMin } = useSchedule();

  const mood = today?.mood ?? "calm";
  const energy = today?.energy ?? 3;
  const cfg = useMemo(() => buildConfig(mood, energy), [mood, energy]);

  const moodLabel = MOOD_OPTIONS.find((m) => m.value === mood)?.label ?? "Calm";
  const energyLabel = ENERGY_OPTIONS.find((e) => e.value === energy)?.label ?? "Medium";

  const generate = () => {
    const open = tasks.filter((t) => !t.done);
    if (open.length === 0) {
      toast("No open tasks", { description: "Add a few tasks, then generate your plan." });
      return;
    }
    setPlan(generatePlan(tasks, cfg));
    toast.success("Plan ready", {
      description: `${cfg.maxTasks} focus blocks · ${cfg.focusMin}m focus / ${cfg.breakMin}m break`,
    });
  };

  return (
    <PageShell
      title="Planner"
      description="An adaptive day, shaped around how you feel right now."
      actions={
        <div className="flex gap-2">
          {blocks.length > 0 && (
            <Button variant="outline" className="rounded-2xl" onClick={clear}>
              <Trash2 className="mr-2 h-4 w-4" /> Clear
            </Button>
          )}
          <Button className="rounded-2xl" onClick={generate}>
            {blocks.length > 0 ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate plan
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <SoftCard
          title="Your day"
          subtitle={
            blocks.length > 0
              ? `${Math.round(totalMin / 60 * 10) / 10}h scheduled · drag to reorder`
              : "Generate a plan to begin"
          }
        >
          <ScheduleTimeline blocks={blocks} onMove={move} onRemove={remove} />
        </SoftCard>

        <div className="space-y-6">
          <SoftCard title="Today's tone" subtitle="Adapts to your check-in">
            <dl className="space-y-3 text-sm">
              <Row label="Mood" value={moodLabel} />
              <Row label="Energy" value={energyLabel} />
              <Row label="Focus blocks" value={`${cfg.focusMin} min`} />
              <Row label="Breaks" value={`${cfg.breakMin} min`} />
              <Row label="Max tasks" value={`${cfg.maxTasks}`} />
            </dl>
            <p className="mt-4 rounded-2xl bg-secondary/60 p-3 text-xs leading-relaxed text-muted-foreground">
              {hint(mood, energy)}
            </p>
          </SoftCard>

          <SoftCard title="Open tasks" subtitle={`${tasks.filter((t) => !t.done).length} ready`}>
            <ul className="space-y-2 text-sm">
              {tasks
                .filter((t) => !t.done)
                .slice(0, 6)
                .map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between rounded-2xl bg-background/60 px-3 py-2"
                  >
                    <span className="truncate">{t.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground capitalize">
                      {t.priority}
                    </span>
                  </li>
                ))}
              {tasks.filter((t) => !t.done).length === 0 && (
                <li className="text-muted-foreground">All clear ✨</li>
              )}
            </ul>
          </SoftCard>
        </div>
      </div>
    </PageShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

function hint(mood: string, energy: number): string {
  if (mood === "overwhelmed") return "Fewer tasks, longer breaks. One thing at a time.";
  if (mood === "tired") return "Shorter focus sessions. Be gentle with yourself.";
  if (energy >= 3) return "Hardest tasks first while your energy is bright.";
  return "Easier wins first to build momentum.";
}
