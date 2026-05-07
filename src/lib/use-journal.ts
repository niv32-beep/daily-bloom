import { useLocalStorage } from "./storage";
import { useCallback } from "react";

export interface JournalEntry {
  id: string;
  date: string;
  text: string;
  mood?: string;
}

const KEY = "lumen.journal.v2";

export function useJournal() {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>(KEY, []);

  const addEntry = useCallback(
    (text: string, mood?: string) => {
      const t = text.trim();
      if (!t) return;
      setEntries((prev) => [
        { id: crypto.randomUUID(), date: new Date().toISOString(), text: t, mood },
        ...prev,
      ]);
    },
    [setEntries],
  );

  const deleteEntry = useCallback(
    (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id)),
    [setEntries],
  );

  return { entries, addEntry, deleteEntry };
}

export function extractTasks(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[\s\-\*\u2022\d\.\)]+/, "").trim())
    .filter((l) => l.length > 2 && l.length < 200);
}
