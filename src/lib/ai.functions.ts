import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";

async function callAI(body: object) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    return { ok: false as const, status: 500, error: "AI is not configured." };
  }
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    if (res.status === 429) return { ok: false as const, status: 429, error: "AI rate limit reached. Try again in a moment." };
    if (res.status === 402) return { ok: false as const, status: 402, error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." };
    const text = await res.text().catch(() => "");
    console.error("AI gateway error", res.status, text);
    return { ok: false as const, status: res.status, error: "AI service error." };
  }
  const data = await res.json();
  return { ok: true as const, data };
}

export const suggestCode = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      prefix: z.string().max(8000),
      suffix: z.string().max(2000).optional().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const system =
      "You are a Python autocomplete engine. Given the code BEFORE the cursor and the code AFTER the cursor, output ONLY the raw Python text that should be inserted at the cursor. Complete 1-3 lines max. No markdown fences, no explanations, no backticks, no commentary. Preserve indentation. If nothing should be inserted, output an empty string.";
    const user = `BEFORE:\n${data.prefix}\n\nAFTER:\n${data.suffix}\n\nINSERT:`;
    const result = await callAI({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.2,
      max_tokens: 120,
    });
    if (!result.ok) return { suggestion: "", error: result.error };
    let suggestion: string =
      result.data?.choices?.[0]?.message?.content ?? "";
    // strip code fences if model added them
    suggestion = suggestion.replace(/^```(?:python)?\n?/i, "").replace(/```\s*$/i, "");
    return { suggestion, error: null as string | null };
  });

export const fixCode = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      code: z.string().min(1).max(20000),
      error: z.string().min(1).max(5000),
    }),
  )
  .handler(async ({ data }) => {
    const system =
      'You are an expert Python tutor. Given broken code and its error, return STRICT JSON: {"fixedCode": "...", "explanation": "short reason"}. Output ONLY JSON, no markdown.';
    const user = `CODE:\n${data.code}\n\nERROR:\n${data.error}`;
    const result = await callAI({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.2,
      max_tokens: 1200,
      response_format: { type: "json_object" },
    });
    if (!result.ok) return { fixedCode: null, explanation: null, error: result.error };
    const raw: string = result.data?.choices?.[0]?.message?.content ?? "{}";
    try {
      const parsed = JSON.parse(raw);
      return {
        fixedCode: typeof parsed.fixedCode === "string" ? parsed.fixedCode : null,
        explanation: typeof parsed.explanation === "string" ? parsed.explanation : null,
        error: null as string | null,
      };
    } catch {
      return { fixedCode: null, explanation: null, error: "AI returned invalid response." };
    }
  });
