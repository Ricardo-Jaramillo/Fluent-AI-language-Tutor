"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useSessionStore } from "@/stores/session";
import { useSettingsStore } from "@/stores/settings";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";
import { useRouter } from "@/i18n/routing";
import { createClient } from "@/lib/supabase";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAudioCapture } from "@/hooks/useAudioCapture";
import { getWsUrl } from "@/lib/api";
import { buildSystemPrompt } from "@/lib/prompts";
import { parseCorrections } from "@/lib/parseCorrections";
import { queueAudioBuffer, stopTTS, onTTSPlayingChange } from "@/lib/audio";
import { motion } from "framer-motion";
import { ChevronLeft, Mic, Send, Volume2, VolumeX } from "lucide-react";
import ConversationView from "@/components/ConversationView";
import LevelSelector from "@/components/LevelSelector";
import TopicChips from "@/components/TopicChips";
import SessionEndOverlay from "@/components/SessionEndOverlay";
import { Button, Spinner } from "@/components/ui";
import AnimatedPage from "@/components/AnimatedPage";
import type { PronunciationError, Level } from "@/stores/session";

const connectionColors: Record<string, string> = {
  connected: "bg-[var(--success)]",
  connecting: "bg-[var(--warning)]",
  disconnected: "bg-[var(--error)]",
  error: "bg-[var(--error)]",
};

export default function SessionPage() {
  const t = useTranslations("session");
  const router = useRouter();
  const session = useSessionStore();
  const { user } = useAuthStore();
  const { llmProvider, ttsEnabled, setTtsEnabled, ttsVoice } = useSettingsStore();
  const addToast = useToastStore((s) => s.addToast);
  const [textInput, setTextInput] = useState("");
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [micError, setMicError] = useState(false);
  const [showEndOverlay, setShowEndOverlay] = useState(false);
  const [levelLoaded, setLevelLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const configSentRef = useRef(false);
  const ttsEnabledRef = useRef(ttsEnabled);
  const ttsVoiceRef = useRef(ttsVoice);
  const streamingMsgIdRef = useRef<string | null>(null);
  const streamingContentRef = useRef("");
  const expectingTtsAudioRef = useRef(false);
  const dbSessionCreated = useRef(false);
  const prevReadyState = useRef<string>("disconnected");
  const supabase = useMemo(() => createClient(), []);

  // Track TTS playing state
  useEffect(() => {
    return onTTSPlayingChange(setIsAISpeaking);
  }, []);

  // Auto-load level from Supabase profile if not set
  useEffect(() => {
    async function loadLevel() {
      if (session.level) {
        setLevelLoaded(true);
        return;
      }
      if (!user) {
        // Default to A1 for unauthenticated users
        session.setLevel("A1");
        setLevelLoaded(true);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("current_level")
        .eq("id", user.id)
        .single();
      const level = data?.current_level ?? "A1";
      session.setLevel(level as "A1" | "A2" | "B1" | "B2" | "C1");
      setLevelLoaded(true);
    }
    loadLevel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Build system prompt based on level + topicHint
  const systemPrompt = useMemo(() => {
    if (!session.level) return "";
    return buildSystemPrompt({
      level: session.level,
      topicHint: session.topicHint,
    });
  }, [session.level, session.topicHint]);

  const handleWsMessage = useCallback(
    (data: { type: string; [key: string]: unknown }) => {
      switch (data.type) {
        case "response_chunk": {
          const token = data.content as string;
          if (!streamingMsgIdRef.current) {
            streamingContentRef.current = token;
            streamingMsgIdRef.current = session.addMessage("assistant", token);
          } else {
            streamingContentRef.current += token;
            session.updateMessageContent(
              streamingMsgIdRef.current,
              streamingContentRef.current,
            );
          }
          break;
        }
        case "tts_audio": {
          expectingTtsAudioRef.current = true;
          break;
        }
        case "response_end": {
          const fullContent = data.content as string;
          session.setProcessing(false);
          saveMessageToDb("assistant", fullContent);

          // Parse grammar corrections from assistant message
          const { corrections } = parseCorrections(fullContent);
          if (corrections.length > 0) {
            // Attach corrections to the preceding user message
            const msgs = useSessionStore.getState().messages;
            const lastUserMsg = [...msgs].reverse().find((m) => m.role === "user");
            if (lastUserMsg) {
              session.updateMessageCorrections(lastUserMsg.id, corrections);
            }
          }

          streamingMsgIdRef.current = null;
          streamingContentRef.current = "";
          break;
        }
        case "transcription": {
          const text = data.text as string;
          session.addMessage("user", text);
          saveMessageToDb("user", text);
          break;
        }
        case "ipa": {
          const errors = data.errors as PronunciationError[];
          const msgId = data.messageId as string;
          session.updateMessageErrors(msgId, errors);
          break;
        }
        case "error":
          session.setProcessing(false);
          streamingMsgIdRef.current = null;
          streamingContentRef.current = "";
          break;
        case "config_ack":
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleWsBinary = useCallback(
    (data: ArrayBuffer) => {
      if (expectingTtsAudioRef.current) {
        expectingTtsAudioRef.current = false;
        queueAudioBuffer(data);
      }
    },
    [],
  );

  const {
    startRecording,
    stopRecording,
    isSupported: micSupported,
  } = useAudioCapture();

  const wsUrl = `${getWsUrl()}/ws/conversation`;
  const { send, sendBinary, readyState, disconnect } = useWebSocket({
    url: wsUrl,
    onMessage: handleWsMessage,
    onBinary: handleWsBinary,
    onOpen: () => session.setConnectionState("connected"),
    onClose: () => session.setConnectionState("disconnected"),
    onError: () => session.setConnectionState("error"),
    enabled: !!session.level && levelLoaded,
  });

  // Keep refs in sync with store
  useEffect(() => {
    ttsEnabledRef.current = ttsEnabled;
  }, [ttsEnabled]);
  useEffect(() => {
    ttsVoiceRef.current = ttsVoice;
  }, [ttsVoice]);

  // Send tts_config when TTS settings change mid-session
  useEffect(() => {
    if (readyState === "connected" && configSentRef.current) {
      send({
        type: "tts_config",
        tts_enabled: ttsEnabled,
        tts_voice: ttsVoice,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ttsEnabled, ttsVoice]);

  // Update connection state from readyState + show toast on disconnect
  useEffect(() => {
    session.setConnectionState(readyState);

    if (
      prevReadyState.current === "connected" &&
      (readyState === "disconnected" || readyState === "error")
    ) {
      addToast("warning", t("reconnecting"));
    }
    if (
      prevReadyState.current !== "connected" &&
      prevReadyState.current !== "disconnected" &&
      readyState === "connected" &&
      configSentRef.current
    ) {
      addToast("success", t("connected"));
    }
    prevReadyState.current = readyState;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyState]);

  // Send config with system prompt on connect + create DB session
  useEffect(() => {
    if (readyState === "connected" && systemPrompt && !configSentRef.current) {
      send({
        type: "config",
        system_prompt: systemPrompt,
        tts_enabled: ttsEnabledRef.current,
        tts_voice: ttsVoiceRef.current,
      });
      configSentRef.current = true;
    }

    // Create Supabase session row once connected
    if (readyState === "connected" && user && session.level && !dbSessionCreated.current) {
      dbSessionCreated.current = true;
      supabase
        .from("sessions")
        .insert({
          user_id: user.id,
          mode: "unified",
          level: session.level,
        })
        .select("id")
        .single()
        .then(({ data }) => {
          if (data) session.setDbSessionId(data.id);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyState, systemPrompt, send]);

  const saveMessageToDb = useCallback(
    async (role: "user" | "assistant", content: string) => {
      const dbId = useSessionStore.getState().dbSessionId;
      if (!dbId) return;
      await supabase.from("messages").insert({
        session_id: dbId,
        role,
        content,
        timestamp_ms: Date.now(),
      });
    },
    [supabase],
  );

  const computeScores = useCallback(() => {
    const msgs = useSessionStore.getState().messages;
    const userMsgs = msgs.filter((m) => m.role === "user");
    const messageCount = msgs.length;

    let pronScore = 0;
    if (userMsgs.length > 0) {
      const totalErrors = userMsgs.reduce(
        (sum, m) => sum + (m.ipaErrors?.length ?? 0),
        0,
      );
      const errorRatio = Math.min(totalErrors / Math.max(userMsgs.length, 1), 3) / 3;
      pronScore = Math.round((1 - errorRatio) * 100);
    }

    let fluencyScore = 0;
    if (userMsgs.length > 0) {
      const avgLen = userMsgs.reduce((sum, m) => sum + m.content.length, 0) / userMsgs.length;
      const lenScore = Math.min(avgLen / 40, 1);
      const countScore = Math.min(userMsgs.length / 5, 1);
      fluencyScore = Math.round(((lenScore + countScore) / 2) * 100);
    }

    // Grammar score: based on correction count
    let grammarScore = 0;
    if (userMsgs.length > 0) {
      const totalCorrections = userMsgs.reduce(
        (sum, m) => sum + (m.grammarCorrections?.length ?? 0),
        0,
      );
      const correctionRatio = Math.min(totalCorrections / Math.max(userMsgs.length, 1), 3) / 3;
      grammarScore = Math.round((1 - correctionRatio) * 100);
    }

    return { fluencyScore, grammarScore, pronunciationScore: pronScore, messageCount };
  }, []);

  const handleEndSession = useCallback(async () => {
    stopTTS();
    const scores = computeScores();

    const dbId = useSessionStore.getState().dbSessionId;
    if (dbId) {
      await supabase
        .from("sessions")
        .update({
          ended_at: new Date().toISOString(),
          fluency_score: scores.fluencyScore,
          grammar_score: scores.grammarScore,
          pronunciation_score: scores.pronunciationScore,
        })
        .eq("id", dbId);
    }

    disconnect();
    setShowEndOverlay(true);
  }, [disconnect, supabase, computeScores]);

  const handlePracticeAgain = useCallback(() => {
    setShowEndOverlay(false);
    const currentLevel = session.level;
    session.reset();
    if (currentLevel) session.setLevel(currentLevel);
    configSentRef.current = false;
    dbSessionCreated.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewDashboard = useCallback(() => {
    setShowEndOverlay(false);
    session.reset();
    router.push("/dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleSendText = useCallback(() => {
    const text = textInput.trim();
    if (!text || readyState !== "connected") return;
    session.addMessage("user", text);
    session.setProcessing(true);
    send({ type: "message", content: text, provider: llmProvider });
    saveMessageToDb("user", text);
    setTextInput("");
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textInput, readyState, send, llmProvider, saveMessageToDb]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleMicToggle = useCallback(async () => {
    if (session.isRecording) {
      session.setRecording(false);
      const blob = await stopRecording();
      if (!blob || blob.size === 0) return;
      session.setProcessing(true);
      send({ type: "audio_start", format: "webm" });
      const buffer = await blob.arrayBuffer();
      sendBinary(buffer);
    } else {
      if (!micSupported || readyState !== "connected" || isAISpeaking) return;
      setMicError(false);
      session.setRecording(true);
      try {
        await startRecording();
      } catch {
        session.setRecording(false);
        setMicError(true);
        setTimeout(() => setMicError(false), 600);
      }
    }
  }, [session, stopRecording, send, sendBinary, micSupported, readyState, isAISpeaking, startRecording]);

  // When level changes mid-session, resend config
  const handleLevelChange = useCallback((newLevel: Level) => {
    if (readyState === "connected") {
      const prompt = buildSystemPrompt({ level: newLevel, topicHint: session.topicHint });
      send({ type: "config", system_prompt: prompt });
    }
  }, [readyState, send, session.topicHint]);

  // When topic changes, resend config
  const handleTopicChange = useCallback((topic: string | null) => {
    if (readyState === "connected" && session.level) {
      const prompt = buildSystemPrompt({ level: session.level, topicHint: topic });
      send({ type: "config", system_prompt: prompt });
    }
  }, [readyState, send, session.level]);

  // If no level loaded yet, show nothing
  if (!levelLoaded) {
    return null;
  }

  const connColor = connectionColors[session.connectionState] ?? connectionColors.disconnected;

  const micDisabled = !micSupported || readyState !== "connected";
  const scores = showEndOverlay ? computeScores() : null;

  const micAriaLabel = micDisabled
    ? t("micUnavailable")
    : isAISpeaking
      ? t("aiSpeaking")
      : session.isRecording
        ? t("stopRecording")
        : t("startRecording");

  const micButtonClass = micDisabled
    ? "bg-foreground/10 opacity-40 cursor-not-allowed"
    : micError
      ? "bg-[var(--error)]/20 border-2 border-[var(--error)]"
      : isAISpeaking
        ? "bg-primary-300/20 border-2 border-primary-300"
        : session.isRecording
          ? "bg-primary-400 scale-95 shadow-[0_0_24px_hsla(156,48%,52%,0.4)]"
          : "bg-primary-600 hover:bg-primary-500 mic-idle";

  return (
    <AnimatedPage className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-border bg-[var(--bg-base)]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleEndSession}
              className="p-1.5 rounded-[var(--radius-sm)] text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
              aria-label="End session and go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <LevelSelector onLevelChange={handleLevelChange} />
            <span
              className={`w-2 h-2 rounded-full ${connColor} inline-block`}
              title={t(session.connectionState)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className="p-1.5 rounded-[var(--radius-sm)] text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
              aria-label={ttsEnabled ? "Disable TTS" : "Enable TTS"}
            >
              {ttsEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEndSession}
            >
              {t("endSession")}
            </Button>
          </div>
        </div>
        <TopicChips onTopicChange={handleTopicChange} />
      </header>

      {/* Conversation */}
      <ConversationView />

      {/* Input area: mic + text input */}
      <div className="flex flex-col items-center gap-3 py-4 px-4 border-t border-border bg-[var(--bg-base)]" style={{ zIndex: "var(--z-mic)" }}>
        <div className="flex items-center gap-2 w-full max-w-2xl">
          <input
            ref={inputRef}
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("typeMessage")}
            disabled={readyState !== "connected"}
            className="flex-1 px-4 py-2.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] text-foreground placeholder:text-foreground/30 text-sm focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400/30 transition-colors disabled:opacity-40"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSendText}
            disabled={!textInput.trim() || readyState !== "connected"}
            className="p-2.5 rounded-full bg-primary-600 hover:bg-primary-500 text-white disabled:opacity-40 disabled:hover:bg-primary-600 transition-colors"
            aria-label={t("send")}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Mic button */}
        <div className="relative">
          {session.isRecording && (
            <>
              <motion.div
                animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-primary-400/25"
              />
              <motion.div
                animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                className="absolute inset-0 rounded-full bg-primary-400/15"
              />
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                className="absolute inset-0 rounded-full bg-primary-400/10"
              />
            </>
          )}

          {isAISpeaking && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full pointer-events-none">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-primary-300/20"
              />
            </div>
          )}

          {session.isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[var(--bg-elevated)]/80">
              <Spinner size="lg" />
            </div>
          )}

          <motion.button
            whileTap={micDisabled ? undefined : { scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            animate={
              micError
                ? { x: [0, -4, 4, -4, 4, -2, 2, 0] }
                : { x: 0 }
            }
            onClick={handleMicToggle}
            disabled={micDisabled}
            className={`relative w-16 h-16 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${micButtonClass}`}
            style={{ width: "64px", height: "64px" }}
            aria-label={micAriaLabel}
          >
            {isAISpeaking ? (
              <div className="flex items-center gap-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleY: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.1,
                    }}
                    className="w-1 h-5 rounded-full bg-primary-300"
                    style={{ originY: "50%" }}
                  />
                ))}
              </div>
            ) : (
              <Mic className="w-7 h-7 text-white" />
            )}
          </motion.button>
        </div>
        <span className="text-xs text-foreground/25">
          {micDisabled
            ? t("micUnavailable")
            : isAISpeaking
              ? t("aiSpeaking")
              : session.isRecording
                ? t("stopRecording")
                : t("startRecording")}
        </span>
      </div>

      {/* Session End Overlay */}
      <SessionEndOverlay
        isOpen={showEndOverlay}
        fluencyScore={scores?.fluencyScore ?? 0}
        grammarScore={scores?.grammarScore ?? 0}
        pronunciationScore={scores?.pronunciationScore ?? 0}
        messageCount={scores?.messageCount ?? 0}
        onPracticeAgain={handlePracticeAgain}
        onViewDashboard={handleViewDashboard}
      />
    </AnimatedPage>
  );
}
