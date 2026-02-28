"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, CheckCircle } from "lucide-react";
import { playTTS } from "@/lib/audio";
import { useSettingsStore } from "@/stores/settings";
import type { PronunciationError, GrammarCorrection } from "@/stores/session";

interface FeedbackSheetProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  ipaErrors?: PronunciationError[];
  grammarCorrections?: GrammarCorrection[];
}

export default function FeedbackSheet({
  isOpen,
  onClose,
  content,
  ipaErrors = [],
  grammarCorrections = [],
}: FeedbackSheetProps) {
  const t = useTranslations("session");
  const [activeTab, setActiveTab] = useState<"grammar" | "pronunciation">("grammar");
  const { ttsVoice } = useSettingsStore();

  const tabs = [
    { id: "grammar" as const, label: t("grammar") },
    { id: "pronunciation" as const, label: t("pronunciation") },
  ];

  // Compute overall pronunciation score from IPA errors
  const words = content.split(" ");
  const errorPositions = new Set(ipaErrors.map((e) => e.wordPosition));
  const pronScore = words.length > 0
    ? Math.round(((words.length - ipaErrors.length) / words.length) * 100)
    : 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden"
            style={{ zIndex: 50 }}
          />
          {/* Sheet */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-[380px] bg-[var(--bg-base)] border-l border-border shadow-2xl overflow-y-auto md:top-[53px]"
            style={{ zIndex: 51 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-600/15 text-primary-400"
                        : "text-foreground/40 hover:text-foreground/60"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-[var(--radius-sm)] text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Original sentence */}
              <div className="p-3 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border-l-[3px] border-l-primary-400 text-sm text-foreground/70">
                {content}
              </div>

              {activeTab === "grammar" ? (
                <GrammarTab corrections={grammarCorrections} />
              ) : (
                <PronunciationTab
                  words={words}
                  ipaErrors={ipaErrors}
                  errorPositions={errorPositions}
                  pronScore={pronScore}
                  ttsVoice={ttsVoice}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function GrammarTab({ corrections }: { corrections: GrammarCorrection[] }) {
  const t = useTranslations("session");

  if (corrections.length === 0) {
    return (
      <div className="text-center py-8 space-y-2">
        <CheckCircle className="h-6 w-6 text-[var(--success)] mx-auto" />
        <p className="text-sm font-medium text-foreground/60">{t("perfectGrammar")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {corrections.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="p-3 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-border space-y-1.5"
        >
          <div className="text-sm">
            <span className="text-[var(--error)]">❌ {c.error}</span>
            <span className="text-foreground/30 mx-1.5">→</span>
            <span className="text-[var(--success)]">✅ {c.correction}</span>
          </div>
          {c.explanation && (
            <p className="text-xs text-foreground/40">{c.explanation}</p>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function PronunciationTab({
  words,
  ipaErrors,
  errorPositions,
  pronScore,
  ttsVoice,
}: {
  words: string[];
  ipaErrors: PronunciationError[];
  errorPositions: Set<number>;
  pronScore: number;
  ttsVoice: string;
}) {
  const t = useTranslations("session");
  const errorMap = new Map(ipaErrors.map((e) => [e.wordPosition, e]));

  return (
    <div className="space-y-4">
      {/* Overall score */}
      <div className="text-center py-3">
        <div className="text-3xl font-bold font-[family-name:var(--font-display)]">
          {pronScore}%
        </div>
        <p className="text-xs text-foreground/40">{t("overallScore")}</p>
      </div>

      {/* Word-by-word breakdown */}
      <div className="space-y-1.5">
        {words.map((word, i) => {
          const error = errorMap.get(i);
          const isError = errorPositions.has(i);
          const confidence = error ? Math.round(error.word === word ? (1 - (isError ? 0.3 : 0)) * 100 : 100) : 100;

          return (
            <div
              key={i}
              className={`flex items-center justify-between p-2.5 rounded-[var(--radius-md)] text-sm ${
                isError
                  ? "bg-[var(--error)]/5 border border-[var(--error)]/20"
                  : "bg-[var(--bg-surface)]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={isError ? "text-[var(--error)] font-medium" : "text-foreground/70"}>
                  {word}
                </span>
                {error && (
                  <span className="text-xs text-foreground/30">
                    /{error.correctIPA}/
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isError && (
                  <span className="text-xs text-[var(--error)] tabular-nums">{confidence}%</span>
                )}
                <button
                  onClick={() => playTTS(word, ttsVoice)}
                  className="p-1 rounded-full text-foreground/30 hover:text-foreground/60 transition-colors"
                  aria-label={`${t("listen")} ${word}`}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
