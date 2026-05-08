import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/page-shell";
import { PlannerCard, PlannerCardTitle, PlannerCardSubtitle } from "@/components/planner/planner-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { MoodSelector, DEFAULT_MOODS } from "@/components/planner/mood-selector";
import { ClientDate } from "@/components/client-date";
import { Sparkles, Trash2, NotebookPen } from "lucide-react";
import { toast } from "sonner";
import { useJournal, extractTasks } from "@/lib/use-journal";
import { useTasks } from "@/lib/use-tasks";

export const Route = createFileRoute("/journal")({
  head: () => ({ meta: [{ title: "Journal — Lumen" }] }),
  component: JournalPage,
});

function JournalPage() {
  const { entries, addEntry, deleteEntry } = useJournal();
  const { addTask } = useTasks();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [mood, setMood] = useState<string | undefined>();

  const save = () => {
    if (!text.trim()) return;
    addEntry(text, mood);
    setText("");
    setMood(undefined);
    toast.success("Entry saved 💜");
  };

  const convert = () => {
    const lines = extractTasks(text);
    if (lines.length === 0) {
      toast.info("Write a few thoughts first");
      return;
    }
    lines.forEach((title) =>
      addTask({ title, priority: "medium", category: "personal" }),
    );
    toast.success(`Created ${lines.length} task${lines.length === 1 ? "" : "s"}`, {
      action: { label: "View", onClick: () => navigate({ to: "/tasks" }) },
    });
  };

  return (
    <PageShell
      title="Journal & brain dump"
      description="A quiet space to let thoughts land. No structure required."
    >
      <PlannerCard className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <NotebookPen className="h-5 w-5" />
          </div>
          <div>
            <PlannerCardTitle>What's on your mind?</PlannerCardTitle>
            <PlannerCardSubtitle>Write freely — you can shape it later.</PlannerCardSubtitle>
          </div>
        </div>

        <label htmlFor="journal-text" className="sr-only">Journal entry</label>
        <textarea
          id="journal-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Let it all out. One thought per line works nicely if you want to convert into tasks…"
          className="w-full resize-none rounded-2xl border border-border/60 bg-background/60 px-5 py-4 text-base leading-relaxed text-foreground placeholder:text-muted-foreground outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">How are you feeling?</p>
          <MoodSelector value={mood} onChange={setMood} />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border/60 pt-4">
          <Button variant="ghost" onClick={convert} disabled={!text.trim()}>
            <Sparkles className="mr-2 h-4 w-4" /> Convert to tasks
          </Button>
          <Button onClick={save} disabled={!text.trim()}>
            Save entry
          </Button>
        </div>
      </PlannerCard>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Past entries</h2>
        {entries.length === 0 ? (
          <EmptyState
            icon={<NotebookPen className="h-5 w-5" />}
            title="Your first thought is welcome here"
            description="Anything goes — a worry, a wish, a small win."
          />
        ) : (
          entries.map((e) => {
            const moodOpt = DEFAULT_MOODS.find((m) => m.value === e.mood);
            return (
              <PlannerCard key={e.id} className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <ClientDate
                      iso={e.date}
                      options={{
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }}
                    />
                    {moodOpt && (
                      <span className="rounded-full bg-accent/60 px-2 py-0.5 text-xs normal-case text-accent-foreground">
                        {moodOpt.emoji} {moodOpt.label}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteEntry(e.id)}
                    aria-label="Delete entry"
                    className="text-muted-foreground transition hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
                  {e.text}
                </p>
              </PlannerCard>
            );
          })
        )}
      </div>
    </PageShell>
  );
}
