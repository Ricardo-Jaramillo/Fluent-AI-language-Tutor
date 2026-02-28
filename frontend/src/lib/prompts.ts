/** Build unified system prompt for the LLM. */

interface PromptParams {
  level: string;
  topicHint?: string | null;
}

function buildSystemPrompt({ level, topicHint }: PromptParams): string {
  const topicLine = topicHint
    ? ` Das aktuelle Gesprächsthema ist "${topicHint}". Lenke die Unterhaltung sanft in diese Richtung.`
    : "";

  return `Du bist ein freundlicher Deutsch-Lehrer. Das Niveau des Schülers ist ${level}. Passe dein Deutsch an dieses Niveau an.${topicLine}

Antworte natürlich auf den Inhalt (1-2 Sätze). Falls der Schüler Grammatikfehler macht, korrigiere sie mit diesem Format:
❌ [Fehler] → ✅ [Korrektur] (kurze Erklärung)

Schlage gelegentlich nützliche Vokabeln oder Ausdrücke vor, die zum Thema passen. Sei ermutigend und halte die Unterhaltung lebendig.`;
}

export { buildSystemPrompt };
export type { PromptParams };
