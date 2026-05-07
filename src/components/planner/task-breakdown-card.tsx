import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PlannerCard, PlannerCardTitle, PlannerCardSubtitle } from "./planner-card";
import { PlannerInput } from "./planner-input";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Coffee, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTasks } from "@/lib/use-tasks";
import { cn } from "@/lib/utils";

interface Breakdown {
  subtasks: string[];
  effort: "low" | "medium" | "high";
  breakSuggestion: string;
}

const effortStyle: Record<Breakdown["effort"], string> = {
  low: "bg-secondary text-secondary-foreground",
  medium: "bg-accent text-accent-foreground",
  high: "bg-primary/15 text-primary",
};

export function TaskBreakdownCard() {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Breakdown | null>(null);
  const { addTask } = useTasks();

  const run = async () => {
    if (!task.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("breakdown-task", {
        body: { task: task.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data as Breakdown);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't break that down");
    } finally {
      setLoading(false);
    }
  };

  const addAll = () => {
    if (!result) return;
    result.subtasks.forEach((title) =>
      addTask({ title, priority: "medium", category: "personal" }),
    );
    toast.success(`Added ${result.subtasks.length} subtasks`);
    setTask("");
    setResult(null);
  };

  return (
    <PlannerCard className="space-y-4 bg-gradient-to-br from-card via-card to-accent/30">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <PlannerCardTitle>AI task breakdown</PlannerCardTitle>
          <PlannerCardSubtitle>Turn a big task into small, doable steps.</PlannerCardSubtitle>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <PlannerInput
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && run()}
          placeholder="e.g. Finish assignment"
          className="flex-1"
        />
        <Button onClick={run} disabled={loading || !task.trim()} className="sm:w-auto">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Break down
        </Button>
      </div>

      {result && (
        <div className="space-y-3 rounded-2xl border border-border/60 bg-background/60 p-4">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium capitalize",
                effortStyle[result.effort],
              )}
            >
              {result.effort} effort
            </span>
            <Button variant="soft" size="sm" onClick={addAll}>
              <Plus className="mr-1.5 h-4 w-4" /> Add all
            </Button>
          </div>

          <ul className="space-y-2">
            {result.subtasks.map((s, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-xl bg-card px-3 py-2.5 text-sm text-foreground shadow-sm"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {i + 1}
                </span>
                <span className="flex-1">{s}</span>
                <button
                  onClick={() =>
                    addTask({ title: s, priority: "medium", category: "personal" }) ||
                    toast.success("Added")
                  }
                  className="text-xs text-muted-foreground transition hover:text-primary"
                  aria-label="Add this subtask"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-start gap-2 rounded-xl bg-accent/40 px-3 py-2.5 text-sm text-foreground">
            <Coffee className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{result.breakSuggestion}</span>
          </div>
        </div>
      )}
    </PlannerCard>
  );
}
