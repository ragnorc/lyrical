import { DeepPartial } from "ai";
import { z } from "zod";

// Define a new schema for language analysis
export const languageAnalysisSchema = z.object({
  rtl: z.boolean().optional(),
  language: z.string().toLowerCase(),
  analysis: z.array(z.object({
    original_sentence: z.string(),
    transliteration: z.string().optional().describe("The transliteration if the language uses non-latin characters."),
    translation: z.string(),
    tokens: z.array(z.object({
      original: z.string(),
      transliteration: z.string().optional(),
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
  })),
});

// Define a type for the partial analysis
export type PartialLanguageAnalysis = DeepPartial<typeof languageAnalysisSchema>["analysis"];

export type LanguageAnalysis = z.infer<typeof languageAnalysisSchema>["analysis"];

// Define a type for partial token
export type PartialToken = DeepPartial<LanguageAnalysis[number]['tokens'][number]>;
