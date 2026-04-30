import OpenAI from "openai";
import { fallbackAnalysis } from "@/lib/fallbackAnalysis";
import { MAX_CHARS, MIN_WORDS } from "@/lib/scoring";
import { PitchAnalysis } from "@/types/pitch";

function validatePitch(pitch: string): string | null {
  if (!pitch.trim()) return "Le pitch est vide.";
  const words = pitch.trim().split(/\s+/).filter(Boolean);
  if (words.length < MIN_WORDS) return `Le pitch est trop court (${words.length} mots). Minimum ${MIN_WORDS} mots.`;
  if (pitch.length > MAX_CHARS) return `Le pitch dépasse ${MAX_CHARS} caractères.`;
  return null;
}

export async function analyzePitch(pitch: string): Promise<PitchAnalysis> {
  const validationError = validatePitch(pitch);
  if (validationError) throw new Error(validationError);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallbackAnalysis(pitch);

  const client = new OpenAI({ apiKey });
  const prompt = `Analyse ce pitch en français selon les critères demandés et renvoie strictement un JSON valide conforme au schéma attendu. Pitch:\n\n${pitch}`;

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "Tu es un coach de pitch exigeant et constructif. Réponds uniquement en JSON brut conforme au schéma requis, sans markdown ni texte autour."
        },
        { role: "user", content: prompt }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "pitch_analysis",
          schema: {
            type: "object",
            required: ["globalScore", "scoreLabel", "verdict", "criteria", "strengths", "weaknesses", "detectedMistakes", "recommendations", "improvedPitch", "shortPitch120Words", "callToActions"],
            properties: {
              globalScore: { type: "number" },
              scoreLabel: { type: "string" },
              verdict: { type: "string" },
              criteria: {
                type: "array",
                items: {
                  type: "object",
                  required: ["name", "score", "maxScore", "comment", "recommendation"],
                  properties: {
                    name: { type: "string" },
                    score: { type: "number" },
                    maxScore: { type: "number" },
                    comment: { type: "string" },
                    recommendation: { type: "string" }
                  },
                  additionalProperties: false
                }
              },
              strengths: { type: "array", items: { type: "string" } },
              weaknesses: { type: "array", items: { type: "string" } },
              detectedMistakes: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } },
              improvedPitch: { type: "string" },
              shortPitch120Words: { type: "string" },
              callToActions: {
                type: "object",
                required: ["meeting", "curiosity", "conversation"],
                properties: {
                  meeting: { type: "string" },
                  curiosity: { type: "string" },
                  conversation: { type: "string" }
                },
                additionalProperties: false
              }
            },
            additionalProperties: false
          }
        }
      }
    });

    const raw = response.output_text;
    const parsed = JSON.parse(raw) as PitchAnalysis;
    return parsed;
  } catch {
    return fallbackAnalysis(pitch);
  }
}
