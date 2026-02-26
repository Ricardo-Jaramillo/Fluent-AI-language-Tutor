"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type LLMProvider = "deepseek" | "claude" | "openai" | "gemini";
type Theme = "dark" | "light" | "system";

interface SettingsState {
  llmProvider: LLMProvider;
  theme: Theme;
  setLLMProvider: (provider: LLMProvider) => void;
  setTheme: (theme: Theme) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      llmProvider: "deepseek",
      theme: "dark",
      setLLMProvider: (provider) => set({ llmProvider: provider }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "fluent-settings" }
  )
);
