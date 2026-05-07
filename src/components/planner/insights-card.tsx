import { useEffect } from "react";
import { Lightbulb, Clock, RotateCcw } from "lucide-react";
import { SoftCard } from "@/components/soft-card";
import { useLearning } from "@/lib/use-learning";
import { useTasks } from "@/lib/use-tasks";

export function InsightsCard() {
  const { tasks } = useTasks();
  const { stats, insights, recordStale } = useLearning();

  // Once per day, record any open task titles older than 1 day as "stale".
  useEffect(() => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const stale = tasks
      .filter((t) => !t.done && new Date(t.createdAt).getTime() < cutoff)
      .map((t) => t.title);
    if (stale.length > 0) recordStale(stale);
  }, [tasks, recordStale]);

  const hasData = stats.totalCompleted > 0 || insights.repeatedStale.length > 0;

  return (
    <SoftCard
      title="Gentle insights"
      subtitle="Quiet patterns from your week"
      icon={<Lightbulb className="h-5 w-5" />}
    >
      {!hasData ? (
        <p className="text-sm text-muted-foreground">
          Complete a few tasks and check back — patterns will appear here.
        </p>
      ) : (
        <div className="space-y-4">
          <p className="rounded-2xl bg-secondary/60 p-3 text-sm leading-relaxed text-foreground">
            {insights.suggestion}
          </p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <Stat
              icon={<Clock className="h-4 w-4" />}
              label="Best window"
              value={insights.preferredWindow ?? "—"}
            />
            <Stat
              icon={<RotateCcw className="h-4 w-4" />}
              label="Completed"
              value={`${stats.totalCompleted}`}
            />
          </div>

          {insights.repeatedStale.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Keeps rolling over
              </p>
              <ul className="space-y-1.5">
                {insights.repeatedStale.map((r) => (
                  <li
                    key={r.title}
                    className="flex items-center justify-between rounded-2xl bg-background/60 px-3 py-2 text-sm"
                  >
                    <span className="truncate">{r.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">×{r.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </SoftCard>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-background/60 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}
