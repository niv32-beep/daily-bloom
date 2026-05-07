import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SoftCard } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Sun, ListChecks, NotebookPen, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <PageShell
      title="Good morning ✨"
      description="Here's a calm look at your day. Take it one gentle step at a time."
      actions={
        <Button asChild className="rounded-2xl">
          <Link to="/planner">
            <Sparkles className="mr-2 h-4 w-4" /> Plan my day
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        <SoftCard title="Focus" subtitle="3 of 5 tasks" icon={<ListChecks className="h-5 w-5" />}>
          <Progress value={60} className="h-2 rounded-full" />
          <p className="mt-3 text-sm text-muted-foreground">
            You're 60% through today. Lovely pace.
          </p>
        </SoftCard>
        <SoftCard title="Mood" subtitle="Calm and steady" icon={<Sun className="h-5 w-5" />}>
          <div className="flex gap-2 text-2xl">
            {["😌", "🙂", "😴", "🤔", "✨"].map((e) => (
              <button
                key={e}
                className="rounded-2xl bg-accent/40 px-3 py-2 transition hover:bg-accent"
              >
                {e}
              </button>
            ))}
          </div>
        </SoftCard>
        <SoftCard title="Journal" subtitle="Last entry: yesterday" icon={<NotebookPen className="h-5 w-5" />}>
          <Button asChild variant="secondary" className="rounded-2xl">
            <Link to="/journal">Write a note</Link>
          </Button>
        </SoftCard>
      </div>

      <SoftCard title="Today's plan" subtitle="Adaptive — adjusts to your energy" icon={<CalendarDays className="h-5 w-5" />}>
        <ul className="divide-y divide-border/60">
          {[
            { time: "09:00", label: "Deep work — design review", tag: "Focus" },
            { time: "11:30", label: "Stretch + tea break", tag: "Rest" },
            { time: "13:00", label: "Reply to messages", tag: "Light" },
            { time: "15:00", label: "Walk outside", tag: "Energy" },
          ].map((b) => (
            <li key={b.time} className="flex items-center gap-4 py-4">
              <span className="w-16 text-sm font-medium text-muted-foreground">{b.time}</span>
              <span className="flex-1 text-base text-foreground">{b.label}</span>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {b.tag}
              </span>
            </li>
          ))}
        </ul>
      </SoftCard>
    </PageShell>
  );
}
