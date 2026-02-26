"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import IPAModal from "./IPAModal";
import { messageBubble } from "@/lib/animations";

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
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`max-w-[80%] p-3 rounded-2xl ${
          role === "user"
            ? "ml-auto bg-primary-600 text-white rounded-br-md"
            : "mr-auto bg-surface-elevated border border-border rounded-bl-md"
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
                      className="underline decoration-error decoration-wavy cursor-pointer hover:bg-white/20 rounded px-0.5 transition-colors"
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
