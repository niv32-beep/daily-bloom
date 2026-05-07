import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SoftCard } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "@/lib/storage";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Tasks — Lumen" }] }),
  component: Tasks,
});

interface Task {
  id: string;
  title: string;
  done: boolean;
}

function Tasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("lumen.tasks", [
    { id: "1", title: "Drink water", done: true },
    { id: "2", title: "Outline weekly review", done: false },
    { id: "3", title: "10-minute walk", done: false },
  ]);
  const [draft, setDraft] = useState("");

  const add = () => {
    const title = draft.trim();
    if (!title) return;
    setTasks([{ id: crypto.randomUUID(), title, done: false }, ...tasks]);
    setDraft("");
  };

  const toggle = (id: string) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <PageShell title="Tasks" description="Small steps add up. Pick one and start.">
      <SoftCard>
        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Add a gentle task…"
            className="flex-1 rounded-2xl border border-border/60 bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
          />
          <Button onClick={add} className="rounded-2xl">
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>
      </SoftCard>
      <SoftCard title="Your list" subtitle={`${tasks.filter((t) => !t.done).length} open`}>
        <ul className="space-y-2">
          {tasks.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-3 rounded-2xl bg-background/60 px-4 py-4"
            >
              <Checkbox checked={t.done} onCheckedChange={() => toggle(t.id)} />
              <span
                className={`flex-1 text-base ${
                  t.done ? "text-muted-foreground line-through" : "text-foreground"
                }`}
              >
                {t.title}
              </span>
            </li>
          ))}
        </ul>
      </SoftCard>
    </PageShell>
  );
}
