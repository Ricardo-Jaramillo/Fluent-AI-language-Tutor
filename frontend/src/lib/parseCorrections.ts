/** Parse grammar corrections from LLM response text. */

import type { GrammarCorrection } from "@/stores/session";

const CORRECTION_RE = /❌\s*(.+?)\s*→\s*✅\s*(.+?)(?:\s*\((.+?)\))?$/gm;

interface ParseResult {
  cleanContent: string;
  corrections: GrammarCorrection[];
}

function parseCorrections(text: string): ParseResult {
  const corrections: GrammarCorrection[] = [];
  let match: RegExpExecArray | null;

  while ((match = CORRECTION_RE.exec(text)) !== null) {
    corrections.push({
      error: match[1].trim(),
      correction: match[2].trim(),
      explanation: match[3]?.trim() ?? "",
    });
  }

  // Remove correction lines from the clean content
  const cleanContent = text
    .replace(/❌\s*.+?→\s*✅\s*.+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { cleanContent, corrections };
}

export { parseCorrections };
export type { ParseResult };
