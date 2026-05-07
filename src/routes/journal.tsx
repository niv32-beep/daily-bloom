import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SoftCard } from "@/components/soft-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocalStorage } from "@/lib/storage";

export const Route = createFileRoute("/journal")({
  head: () => ({ meta: [{ title: "Journal — Lumen" }] }),
  component: Journal,
});

interface Entry {
  id: string;
  date: string;
  text: string;
}

function Journal() {
  const [entries, setEntries] = useLocalStorage<Entry[]>("lumen.journal", []);
  const [text, setText] = useState("");

  const save = () => {
    const t = text.trim();
    if (!t) return;
    setEntries([{ id: crypto.randomUUID(), date: new Date().toISOString(), text: t }, ...entries]);
    setText("");
  };

  return (
    <PageShell
      title="Journal"
      description="A quiet space for thoughts. No pressure, no rules."
    >
      <SoftCard title="New entry" subtitle="What's on your mind?">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Today I noticed…"
          className="w-full resize-none rounded-2xl border border-border/60 bg-background px-4 py-3 text-base outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="mt-3 flex justify-end">
          <Button onClick={save} className="rounded-2xl">
            Save entry
          </Button>
        </div>
      </SoftCard>

      <div className="space-y-4">
        {entries.length === 0 && (
          <p className="text-center text-muted-foreground">No entries yet — your first thought is welcome here.</p>
        )}
        {entries.map((e) => (
          <SoftCard key={e.id}>
            <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
              {new Date(e.date).toLocaleString()}
            </p>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">{e.text}</p>
          </SoftCard>
        ))}
      </div>
    </PageShell>
  );
}
