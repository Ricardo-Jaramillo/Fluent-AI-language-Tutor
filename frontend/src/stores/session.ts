"use client";

import { create } from "zustand";

type Level = "A1" | "A2" | "B1" | "B2" | "C1";
type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

interface PronunciationError {
  word: string;
  wordPosition: number;
  spokenIPA: string;
  correctIPA: string;
  explanation: string;
  severity: "minor" | "moderate" | "severe";
}

interface GrammarCorrection {
  error: string;
  correction: string;
  explanation: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  ipaErrors?: PronunciationError[];
  grammarCorrections?: GrammarCorrection[];
}

interface SessionState {
  level: Level | null;
  topicHint: string | null;
  messages: Message[];
  isRecording: boolean;
  isProcessing: boolean;
  connectionState: ConnectionState;
  dbSessionId: string | null;
  setLevel: (level: Level) => void;
  setTopicHint: (topicHint: string | null) => void;
  addMessage: (role: "user" | "assistant", content: string) => string;
  updateMessageContent: (messageId: string, content: string) => void;
  updateMessageErrors: (messageId: string, errors: PronunciationError[]) => void;
  updateMessageCorrections: (messageId: string, corrections: GrammarCorrection[]) => void;
  setRecording: (recording: boolean) => void;
  setProcessing: (processing: boolean) => void;
  setConnectionState: (state: ConnectionState) => void;
  setDbSessionId: (id: string | null) => void;
  reset: () => void;
}

export type { PronunciationError, GrammarCorrection, Message, Level, ConnectionState };

export const useSessionStore = create<SessionState>()((set) => ({
  level: null,
  topicHint: null,
  messages: [],
  isRecording: false,
  isProcessing: false,
  connectionState: "disconnected",
  dbSessionId: null,
  setLevel: (level) => set({ level }),
  setTopicHint: (topicHint) => set({ topicHint }),
  addMessage: (role, content) => {
    const id = crypto.randomUUID();
    set((state) => ({
      messages: [
        ...state.messages,
        { id, role, content, timestamp: Date.now() },
      ],
    }));
    return id;
  },
  updateMessageContent: (messageId, content) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, content } : m,
      ),
    })),
  updateMessageErrors: (messageId, errors) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, ipaErrors: errors } : m,
      ),
    })),
  updateMessageCorrections: (messageId, corrections) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === messageId ? { ...m, grammarCorrections: corrections } : m,
      ),
    })),
  setRecording: (isRecording) => set({ isRecording }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setConnectionState: (connectionState) => set({ connectionState }),
  setDbSessionId: (dbSessionId) => set({ dbSessionId }),
  reset: () =>
    set({
      level: null,
      topicHint: null,
      messages: [],
      isRecording: false,
      isProcessing: false,
      connectionState: "disconnected",
      dbSessionId: null,
    }),
}));
