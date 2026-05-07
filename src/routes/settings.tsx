import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { SoftCard } from "@/components/soft-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Lumen" }] }),
  component: Settings,
});

function Settings() {
  const rows = [
    { id: "reminders", label: "Gentle reminders", desc: "Soft nudges throughout the day." },
    { id: "adaptive", label: "Adaptive scheduling", desc: "Let Lumen reshape your day based on energy." },
    { id: "sound", label: "Calming sounds", desc: "Subtle audio cues for transitions." },
  ];
  return (
    <PageShell title="Settings" description="Tune Lumen so it feels right for you.">
      <SoftCard title="Preferences">
        <div className="space-y-1 divide-y divide-border/60">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-6 py-4">
              <div>
                <Label htmlFor={r.id} className="text-base font-medium text-foreground">
                  {r.label}
                </Label>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
              </div>
              <Switch id={r.id} defaultChecked />
            </div>
          ))}
        </div>
      </SoftCard>
      <SoftCard title="Data">
        <p className="text-sm text-muted-foreground">
          Your tasks and journal entries are stored locally on this device.
        </p>
      </SoftCard>
    </PageShell>
  );
}
