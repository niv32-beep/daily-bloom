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
    if (!data.tasks.length) {
      return { schedule: [], error: "No open tasks to schedule" };
    }

    const system =
      "You are an adaptive daily planner. Order tasks for the user's current mood and energy. " +
      "High energy → harder/high-priority tasks earlier. Low energy or 'overwhelmed'/'tired' → " +
      "easier tasks first, fewer tasks, shorter durations. Use 24h HH:MM time slots starting 09:00. " +
      "Keep reasons under 12 words.";

    const user = `Mood: ${data.mood}. Energy: ${data.energy}/4.
Tasks:
${data.tasks.map((t) => `- [${t.priority}] (${t.id}) ${t.title}`).join("\n")}`;

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
