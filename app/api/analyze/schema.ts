import { DeepPartial } from "ai";
import { z } from "zod";


// Define a new schema for the Arabic analysis
export const arabicAnalysisSchema = z.object({
  analysis: z.object({
  original_sentence: z.string(),
  transliteration: z.string(),
  translation: z.string(),
  tokens: z.array(z.object({
    arabic: z.string(),
    transliteration: z.string(),
    translation: z.string(),
    part_of_speech: z.string(),
    // ... (other token properties)
  })),
  syntax: z.array(z.union([
    z.object({ type: z.string(), index: z.number() }),
    z.object({ type: z.string(), indices: z.array(z.number()) })
  ])),
  grammatical_notes: z.array(z.string()),
    // ... (other properties)
  }),
});

// define a type for the partial analysis
export type PartialArabicAnalysis = DeepPartial<typeof arabicAnalysisSchema>["analysis"];

export type ArabicAnalysis = z.infer<typeof arabicAnalysisSchema>["analysis"];
