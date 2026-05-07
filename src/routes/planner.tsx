import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SoftCard } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Planner — Lumen" }] }),
  component: Planner,
});

const HOURS = Array.from({ length: 12 }, (_, i) => `${(i + 8).toString().padStart(2, "0")}:00`);

function Planner() {
  return (
    <PageShell
      title="Planner"
      description="A spacious view of your day. Drop tasks into time blocks that feel right."
      actions={
        <Button className="rounded-2xl">
          <Sparkles className="mr-2 h-4 w-4" /> Suggest schedule
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <SoftCard title="Today" subtitle={new Date().toDateString()}>
          <div className="space-y-2">
            {HOURS.map((h) => (
              <div
                key={h}
                className="flex items-center gap-4 rounded-2xl border border-dashed border-border/70 bg-background/40 p-4 transition hover:bg-accent/30"
              >
                <span className="w-16 text-sm font-medium text-muted-foreground">{h}</span>
                <span className="text-sm text-muted-foreground">Click to add a block…</span>
              </div>
            ))}
          </div>
        </SoftCard>
        <div className="space-y-6">
          <SoftCard title="Energy" subtitle="How are you feeling?">
            <div className="flex gap-2">
              {["Low", "Medium", "High"].map((l) => (
                <button
                  key={l}
                  className="flex-1 rounded-2xl bg-secondary px-3 py-3 text-sm font-medium text-secondary-foreground transition hover:bg-accent"
                >
                  {l}
                </button>
              ))}
            </div>
          </SoftCard>
          <SoftCard title="Quick add" subtitle="Drop in an idea">
            <input
              placeholder="A small next step…"
              className="w-full rounded-2xl border border-border/60 bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
            />
          </SoftCard>
        </div>
      </div>
    </PageShell>
  );
}
