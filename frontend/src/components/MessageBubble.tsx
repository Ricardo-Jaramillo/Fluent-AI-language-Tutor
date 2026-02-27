"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import IPAModal from "./IPAModal";
import { messageBubble, messageBubbleConfig } from "@/lib/animations";

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
}

export default function MessageBubble({
  role,
  content,
  errors = [],
}: MessageBubbleProps) {
  const [selectedError, setSelectedError] = useState<PronunciationError | null>(
    null
  );

  const words = content.split(" ");
  const errorMap = new Map(errors.map((e) => [e.wordPosition, e]));

  return (
    <>
      <motion.div
        variants={messageBubble}
        initial="initial"
        animate="animate"
        transition={messageBubbleConfig}
        className={`max-w-[80%] md:max-w-[80%] p-3.5 ${
          role === "user"
            ? "ml-auto bg-gradient-to-br from-primary-800 to-primary-700 text-white rounded-2xl rounded-br-sm"
            : "mr-auto bg-[var(--bg-elevated)] border border-border text-foreground rounded-2xl rounded-bl-sm"
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
    </>
  );
}
