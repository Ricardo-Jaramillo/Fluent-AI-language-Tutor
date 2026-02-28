"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type LLMProvider = "deepseek" | "claude" | "openai" | "gemini";
type Theme = "dark" | "light" | "system";
type TTSVoice =
  | "de_DE-thorsten-high"
  | "de_DE-thorsten_emotional-medium"
  | "de_DE-kerstin-low"
  | "de_DE-ramona-low";

interface SettingsState {
  llmProvider: LLMProvider;
  theme: Theme;
  ttsEnabled: boolean;
  ttsVoice: TTSVoice;
  setLLMProvider: (provider: LLMProvider) => void;
  setTheme: (theme: Theme) => void;
  setTtsEnabled: (enabled: boolean) => void;
  setTtsVoice: (voice: TTSVoice) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      llmProvider: "deepseek",
      theme: "dark",
      ttsEnabled: true,
      ttsVoice: "de_DE-thorsten-high",
      setLLMProvider: (provider) => set({ llmProvider: provider }),
      setTheme: (theme) => set({ theme }),
      setTtsEnabled: (ttsEnabled) => set({ ttsEnabled }),
      setTtsVoice: (ttsVoice) => set({ ttsVoice }),
    }),
    { name: "fluent-settings" }
  )
);
