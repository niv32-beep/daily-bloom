import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { PlannerCard, PlannerCardTitle, PlannerCardSubtitle } from "@/components/planner/planner-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ListChecks, NotebookPen, CalendarDays } from "lucide-react";
import { CheckInCard } from "@/components/planner/check-in-card";
import { MoodSummaryCard } from "@/components/planner/mood-summary-card";
import { InsightsCard } from "@/components/planner/insights-card";
import { useTasks } from "@/lib/use-tasks";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const { tasks } = useTasks();
  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <PageShell
      title="Good day ✨"
      description="A calm look at your day. One gentle step at a time."
      actions={
        <Button asChild>
          <Link to="/planner">
            <Sparkles className="mr-2 h-4 w-4" /> Plan my day
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <CheckInCard />
        <MoodSummaryCard />
      </div>

      <InsightsCard />

      <div className="grid gap-6 md:grid-cols-3">
        <PlannerCard className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <ListChecks className="h-5 w-5" />
            </div>
            <div>
              <PlannerCardTitle>Focus</PlannerCardTitle>
              <PlannerCardSubtitle>{done} of {total} tasks</PlannerCardSubtitle>
            </div>
          </div>
          <Progress value={pct} className="h-2 rounded-full" />
          <Button asChild variant="soft" className="w-full">
            <Link to="/tasks">Open tasks</Link>
          </Button>
        </PlannerCard>

        <PlannerCard className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <NotebookPen className="h-5 w-5" />
            </div>
            <div>
              <PlannerCardTitle>Journal</PlannerCardTitle>
              <PlannerCardSubtitle>A quiet place to land</PlannerCardSubtitle>
            </div>
          </div>
          <Button asChild variant="soft" className="w-full">
            <Link to="/journal">Write a note</Link>
          </Button>
        </PlannerCard>

        <PlannerCard className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <PlannerCardTitle>Planner</PlannerCardTitle>
              <PlannerCardSubtitle>Shape your day</PlannerCardSubtitle>
            </div>
          </div>
          <Button asChild variant="soft" className="w-full">
            <Link to="/planner">Open planner</Link>
          </Button>
        </PlannerCard>
      </div>
    </PageShell>
  );
}
