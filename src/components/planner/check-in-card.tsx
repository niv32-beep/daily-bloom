import { useState, useEffect } from "react";
import { PlannerCard, PlannerCardTitle, PlannerCardSubtitle } from "./planner-card";
import { MoodPicker } from "./mood-picker";
import { EnergyPicker } from "./energy-picker";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import {
  useCheckIns,
  type MoodValue,
  type EnergyValue,
} from "@/lib/use-checkins";

export function CheckInCard() {
  const { today, saveCheckIn } = useCheckIns();
  const [mood, setMood] = useState<MoodValue | undefined>(today?.mood);
  const [energy, setEnergy] = useState<EnergyValue | undefined>(today?.energy);

  useEffect(() => {
    setMood(today?.mood);
    setEnergy(today?.energy);
  }, [today]);

  const save = () => {
    if (!mood || !energy) return;
    saveCheckIn(mood, energy);
    toast.success("Check-in saved 💜");
  };

  return (
    <PlannerCard className="space-y-5 bg-gradient-to-br from-card via-card to-accent/30">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
          <Heart className="h-5 w-5" />
        </div>
        <div>
          <PlannerCardTitle>Daily check-in</PlannerCardTitle>
          <PlannerCardSubtitle>
            {today ? "Updated for today — change anytime." : "How are you arriving today?"}
          </PlannerCardSubtitle>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Mood</p>
        <MoodPicker value={mood} onChange={setMood} />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Energy</p>
        <EnergyPicker value={energy} onChange={setEnergy} />
      </div>

      <div className="flex justify-end border-t border-border/60 pt-4">
        <Button onClick={save} disabled={!mood || !energy}>
          {today ? "Update check-in" : "Save check-in"}
        </Button>
      </div>
    </PlannerCard>
  );
}
