"use client";

import { create } from "zustand";

type Mode = "chat" | "correction" | "teaching";
type Level = "A1" | "A2" | "B1" | "B2" | "C1";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface SessionState {
  mode: Mode | null;
  level: Level | null;
  moduleId: string | null;
  topicId: string | null;
  messages: Message[];
  isRecording: boolean;
  isProcessing: boolean;
  setMode: (mode: Mode) => void;
  setLevel: (level: Level) => void;
  setModule: (moduleId: string) => void;
  setTopic: (topicId: string) => void;
  addMessage: (role: "user" | "assistant", content: string) => void;
  setRecording: (recording: boolean) => void;
  setProcessing: (processing: boolean) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  mode: null,
  level: null,
  moduleId: null,
  topicId: null,
  messages: [],
  isRecording: false,
  isProcessing: false,
  setMode: (mode) => set({ mode }),
  setLevel: (level) => set({ level }),
  setModule: (moduleId) => set({ moduleId }),
  setTopic: (topicId) => set({ topicId }),
  addMessage: (role, content) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { id: crypto.randomUUID(), role, content, timestamp: Date.now() },
      ],
    })),
  setRecording: (isRecording) => set({ isRecording }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  reset: () =>
    set({
      mode: null,
      level: null,
      moduleId: null,
      topicId: null,
      messages: [],
      isRecording: false,
      isProcessing: false,
    }),
}));
