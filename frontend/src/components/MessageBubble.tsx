"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Volume2, SpellCheck } from "lucide-react";
import { playTTS } from "@/lib/audio";
import { useSettingsStore } from "@/stores/settings";
import IPAModal from "./IPAModal";
import FeedbackSheet from "./FeedbackSheet";
import { messageBubble, messageBubbleConfig } from "@/lib/animations";
import type { GrammarCorrection } from "@/stores/session";

interface PronunciationError {
  word: string;
  wordPosition: number;
  spokenIPA: string;
  correctIPA: string;
  explanation: string;
  severity: "minor" | "moderate" | "severe";
}

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  errors?: PronunciationError[];
  corrections?: GrammarCorrection[];
}

export default function MessageBubble({
  role,
  content,
  errors = [],
  corrections = [],
}: MessageBubbleProps) {
  const t = useTranslations("session");
  const { ttsVoice } = useSettingsStore();
  const [selectedError, setSelectedError] = useState<PronunciationError | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const words = content.split(" ");
  const errorMap = new Map(errors.map((e) => [e.wordPosition, e]));

  return (
    <>
      <motion.div
        variants={messageBubble}
        initial="initial"
        animate="animate"
        transition={messageBubbleConfig}
        className={`max-w-[80%] md:max-w-[80%] ${
          role === "user" ? "ml-auto" : "mr-auto"
        }`}
      >
        <div
          className={`p-3.5 ${
            role === "user"
              ? "bg-gradient-to-br from-primary-800 to-primary-700 text-white rounded-2xl rounded-br-sm"
              : "bg-[var(--bg-elevated)] border border-border text-foreground rounded-2xl rounded-bl-sm"
          }`}
        >
          {role === "user" && errors.length > 0 ? (
            <p className="leading-relaxed">
              {words.map((word, i) => {
                const error = errorMap.get(i);
                if (error) {
                  return (
                    <span key={i}>
                      <button
                        onClick={() => setSelectedError(error)}
                        className="underline decoration-[var(--accent-coral)] decoration-dotted underline-offset-4 cursor-pointer hover:bg-white/15 rounded px-0.5 transition-colors"
                        aria-label={`Pronunciation issue with ${word}`}
                      >
                        {word}
                      </button>{" "}
                    </span>
                  );
                }
                return <span key={i}>{word} </span>;
              })}
            </p>
          ) : (
            <p className="leading-relaxed">{content}</p>
          )}
        </div>

        {/* Action icons below bubble */}
        <div className={`flex items-center gap-1.5 mt-1 ${
          role === "user" ? "justify-end" : "justify-start"
        }`}>
          {role === "assistant" && (
            <button
              onClick={() => playTTS(content, ttsVoice)}
              className="p-1 rounded-full text-foreground/20 hover:text-foreground/50 transition-colors"
              aria-label={t("replay")}
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>
          )}
          {role === "user" && (
            <>
              <button
                onClick={() => setFeedbackOpen(true)}
                className="p-1 rounded-full text-foreground/20 hover:text-foreground/50 transition-colors"
                aria-label={t("tapToReview")}
              >
                <SpellCheck className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => playTTS(content, ttsVoice)}
                className="p-1 rounded-full text-foreground/20 hover:text-foreground/50 transition-colors"
                aria-label={t("replay")}
              >
                <Volume2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </motion.div>

      {selectedError && (
        <IPAModal
          isOpen={true}
          onClose={() => setSelectedError(null)}
          word={selectedError.word}
          spokenIPA={selectedError.spokenIPA}
          correctIPA={selectedError.correctIPA}
          explanation={selectedError.explanation}
          severity={selectedError.severity}
        />
      )}

      {feedbackOpen && role === "user" && (
        <FeedbackSheet
          isOpen={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
          content={content}
          ipaErrors={errors}
          grammarCorrections={corrections}
        />
      )}
    </>
  );
}
