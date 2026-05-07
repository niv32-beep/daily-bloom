import { useEffect, useState } from "react";
import { PlannerModal } from "@/components/planner/planner-modal";
import { PlannerInput } from "@/components/planner/planner-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
  type Subtask,
  type Task,
  type TaskCategory,
  type TaskPriority,
} from "@/lib/task-types";

export interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Task | null;
  onSubmit: (data: {
    title: string;
    notes?: string;
    priority: TaskPriority;
    category: TaskCategory;
    dueDate?: string;
    subtasks: Subtask[];
  }) => void;
}

export function TaskDialog({ open, onOpenChange, initial, onSubmit }: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [category, setCategory] = useState<TaskCategory>("personal");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [subDraft, setSubDraft] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setNotes(initial?.notes ?? "");
    setPriority(initial?.priority ?? "medium");
    setCategory(initial?.category ?? "personal");
    setDueDate(initial?.dueDate ? new Date(initial.dueDate) : undefined);
    setSubtasks(initial?.subtasks ?? []);
    setSubDraft("");
  }, [open, initial]);

  const addSub = () => {
    const t = subDraft.trim();
    if (!t) return;
    setSubtasks((s) => [...s, { id: crypto.randomUUID(), title: t, done: false }]);
    setSubDraft("");
  };

  const submit = () => {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      notes: notes.trim() || undefined,
      priority,
      category,
      dueDate: dueDate?.toISOString(),
      subtasks,
    });
    onOpenChange(false);
  };

  return (
    <PlannerModal
      open={open}
      onOpenChange={onOpenChange}
      title={initial ? "Edit task" : "New task"}
      description="Keep it small and kind. You can adjust details anytime."
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!title.trim()}>
            {initial ? "Save" : "Add task"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <PlannerInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="A gentle next step…"
          autoFocus
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
              <SelectTrigger className="h-11 rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as TaskCategory)}>
              <SelectTrigger className="h-11 rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.emoji} {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Due date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-11 w-full justify-start font-normal",
                  !dueDate && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                {dueDate && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDueDate(undefined);
                    }}
                    className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                className={cn("pointer-events-auto p-3")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Subtasks</Label>
          <div className="flex gap-2">
            <PlannerInput
              value={subDraft}
              onChange={(e) => setSubDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSub();
                }
              }}
              placeholder="Add a small step…"
              className="flex-1"
            />
            <Button type="button" variant="soft" size="icon" onClick={addSub}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {subtasks.length > 0 && (
            <ul className="space-y-1">
              {subtasks.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-xl bg-accent/40 px-3 py-2 text-sm"
                >
                  <span>{s.title}</span>
                  <button
                    type="button"
                    onClick={() => setSubtasks((arr) => arr.filter((x) => x.id !== s.id))}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Notes</Label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Optional context…"
            className="w-full resize-none rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </PlannerModal>
  );
}
