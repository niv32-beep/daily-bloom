import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { PlannerCard } from "@/components/planner/planner-card";
import { TaskCard } from "@/components/planner/task-card";
import { TaskDialog } from "@/components/planner/task-dialog";
import { TaskBreakdownCard } from "@/components/planner/task-breakdown-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTasks } from "@/lib/use-tasks";
import { CATEGORY_OPTIONS, type Task, type TaskCategory } from "@/lib/task-types";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Tasks — Lumen" }] }),
  component: TasksPage,
});

type Filter = "all" | "active" | "done";

function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask, toggleSubtask } = useTasks();
  const [filter, setFilter] = useState<Filter>("active");
  const [category, setCategory] = useState<TaskCategory | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const visible = useMemo(() => {
    return tasks.filter((t) => {
      if (filter === "active" && t.done) return false;
      if (filter === "done" && !t.done) return false;
      if (category !== "all" && t.category !== category) return false;
      return true;
    });
  }, [tasks, filter, category]);

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (task: Task) => {
    setEditing(task);
    setDialogOpen(true);
  };

  return (
    <PageShell
      title="Tasks"
      description="Small steps add up. Pick one and start."
      actions={
        <Button onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" /> New task
        </Button>
      }
    >
      <PlannerCard padded={false} className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList className="rounded-2xl">
              <TabsTrigger value="active" className="rounded-xl">
                Active
              </TabsTrigger>
              <TabsTrigger value="all" className="rounded-xl">
                All
              </TabsTrigger>
              <TabsTrigger value="done" className="rounded-xl">
                Done
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="ml-auto flex flex-wrap gap-1.5">
            <CategoryChip
              label="All"
              active={category === "all"}
              onClick={() => setCategory("all")}
            />
            {CATEGORY_OPTIONS.map((c) => (
              <CategoryChip
                key={c.value}
                label={`${c.emoji} ${c.label}`}
                active={category === c.value}
                onClick={() => setCategory(c.value)}
              />
            ))}
          </div>
        </div>
      </PlannerCard>

      <div className="space-y-3">
        {visible.length === 0 ? (
          <PlannerCard className="text-center text-muted-foreground">
            Nothing here yet. Add a small task to begin. 💜
          </PlannerCard>
        ) : (
          visible.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onToggleSubtask={toggleSubtask}
              onEdit={openEdit}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={editing}
        onSubmit={(data) => {
          if (editing) updateTask(editing.id, data);
          else addTask(data);
        }}
      />
    </PageShell>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full px-3 py-1.5 text-xs font-medium transition-colors " +
        (active
          ? "bg-primary text-primary-foreground"
          : "bg-accent/40 text-foreground hover:bg-accent")
      }
    >
      {label}
    </button>
  );
}
