import { createServerFn } from "@tanstack/react-start";

export interface AiScheduleInput {
  mood: string;
  energy: number;
  tasks: { id: string; title: string; priority: "low" | "medium" | "high" }[];
}

export interface AiScheduledTask {
  id: string;
  title: string;
  duration: number;
  priority: "low" | "medium" | "high";
  timeSlot: string;
  alignmentReason: string;
}

export interface AiScheduleResult {
  schedule: AiScheduledTask[];
  error: string | null;
}

export const generateAiSchedule = createServerFn({ method: "POST" })
  .inputValidator((data: AiScheduleInput) => data)
  .handler(async ({ data }): Promise<AiScheduleResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { schedule: [], error: "AI is not configured" };
    }
    const system = [
      "You are an adaptive daily planner that designs COMPLETE, full-day schedules.",
      "",
      "FULL-DAY COVERAGE (non-negotiable):",
      "- Always architect a schedule spanning roughly 08:00 to 21:00.",
      "- Never leave large gaps. The day must feel whole, not sparse.",
      "- Output 8–14 blocks total covering the whole window.",
      "",
      "DYNAMIC TASK INJECTION:",
      "- Start from the user's open tasks. Place each one in a time slot that fits its priority and the user's energy curve.",
      "- If the user's tasks are few (or zero), FILL the rest of the day with sensible baseline blocks so the day is complete:",
      "  • Focus Block — deep work / personal project time",
      "  • Breakfast (~08:00), Lunch (~12:30), Dinner (~18:30)",
      "  • Essential Breaks — stretch, walk, hydrate, fresh air",
      "  • Wind-down — light reading, tidy up, reflection (late evening)",
      "- For injected blocks, invent a stable synthetic id like 'auto-breakfast', 'auto-focus-1', 'auto-break-2', 'auto-winddown'. Never reuse a real task id.",
      "- Real user tasks MUST keep their exact original id.",
      "",
      "STRICT ADAPTABILITY:",
      "- High energy (3–4): longer Focus Blocks (45–75 min), place demanding / high-priority work in the morning while the mind is fresh.",
      "- Medium energy (2): balanced 30–45 min focus, regular 10–15 min breaks.",
      "- Low energy (1) or mood 'tired' / 'overwhelmed': shorter focus (20–25 min), MORE FREQUENT and LONGER breaks (15–20 min), surface restorative / lighter tasks first, push demanding work later or drop it.",
      "",
      "CLEAN TIME INGESTION:",
      "- timeSlot must be 24h 'HH:MM'.",
      "- Blocks must be in strict chronological order across the whole day.",
      "- Space them realistically (e.g. 08:00, 09:30, 11:30, 12:30, 14:00, 16:00, 18:30, 20:00) — no overlaps, no backwards jumps.",
      "- duration is in minutes and must match the gap to the next block.",
      "",
      "alignmentReason: one short sentence (<=12 words) explaining why this block fits the user's current mood + energy.",
    ].join("\n");

    const taskList = data.tasks.length
      ? data.tasks.map((t) => `- [${t.priority}] (${t.id}) ${t.title}`).join("\n")
      : "(none — generate a full baseline day)";

    const user = `Mood: ${data.mood}. Energy: ${data.energy}/4.
Open tasks:
${taskList}

Return a complete day from ~08:00 to ~21:00. Place the user's tasks first, then fill the remaining time with baseline blocks (meals, breaks, focus, wind-down) so the schedule is never empty or sparse.`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-5",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          tool_choice: { type: "function", function: { name: "return_schedule" } },
          tools: [
            {
              type: "function",
              function: {
                name: "return_schedule",
                description: "Return the ordered, time-blocked schedule.",
                parameters: {
                  type: "object",
                  properties: {
                    schedule: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", description: "Original task id" },
                          title: { type: "string" },
                          duration: { type: "number", description: "Minutes" },
                          priority: { type: "string", enum: ["low", "medium", "high"] },
                          timeSlot: { type: "string", description: "HH:MM 24h" },
                          alignmentReason: { type: "string" },
                        },
                        required: [
                          "id",
                          "title",
                          "duration",
                          "priority",
                          "timeSlot",
                          "alignmentReason",
                        ],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["schedule"],
                  additionalProperties: false,
                },
              },
            },
          ],
        }),
      });

      if (!res.ok) {
        if (res.status === 429) return { schedule: [], error: "Rate limit — try again shortly." };
        if (res.status === 402)
          return { schedule: [], error: "AI credits exhausted. Add funds in Workspace usage." };
        return { schedule: [], error: `AI error (${res.status})` };
      }

      const json = await res.json();
      const call = json.choices?.[0]?.message?.tool_calls?.[0];
      const args = call?.function?.arguments;
      if (!args) return { schedule: [], error: "AI returned no schedule" };

      const parsed = JSON.parse(args) as { schedule: AiScheduledTask[] };
      return { schedule: parsed.schedule ?? [], error: null };
    } catch (e) {
      console.error("generateAiSchedule failed:", e);
      return {
        schedule: [],
        error: e instanceof Error ? e.message : "AI request failed",
      };
    }
  });
