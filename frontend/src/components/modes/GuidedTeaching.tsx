"use client";

import { useSessionStore } from "@/stores/session";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";
import { Skeleton, ProgressBar } from "@/components/ui";
import Sidebar from "@/components/layout/Sidebar";
import syllabus from "@/data/syllabus.json";

export default function GuidedTeaching() {
  const { messages, isProcessing, level, moduleId, topicId } =
    useSessionStore();

  const currentLevel = syllabus.levels.find((l) => l.id === level);
  const currentModule = currentLevel?.modules.find((m) => m.id === moduleId);
  const currentTopic = currentModule?.topics.find((t) => t.id === topicId);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main conversation */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-2">
        {/* Lesson progress bar (Section 5 - Guided Teaching) */}
        <ProgressBar value={messages.length * 10} max={100} color="primary" thin className="mb-4" />

        {messages.length === 0 && currentTopic && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 28 }}
            className="text-center mt-10 space-y-4 max-w-sm mx-auto"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary-600/10 flex items-center justify-center mx-auto">
              <GraduationCap className="h-7 w-7 text-primary-400" />
            </div>
            <p className="text-lg font-medium font-[family-name:var(--font-display)] text-foreground/60">
              {currentTopic.name}
            </p>
            <p className="text-sm text-foreground/30">{currentTopic.description}</p>
            {/* Conversation starters as chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {currentTopic.conversation_starters.map((s, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="px-4 py-2 rounded-full border border-border bg-[var(--bg-surface)] text-sm text-foreground/50 hover:border-border-strong hover:text-foreground/70 transition-colors cursor-pointer"
                >
                  &ldquo;{s}&rdquo;
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            className={i > 0 && messages[i - 1].role !== msg.role ? "mt-4" : ""}
          >
            <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
          </div>
        ))}
        {isProcessing && (
          <div className="mr-auto max-w-[60%] space-y-2">
            <Skeleton variant="bubble" />
          </div>
        )}
      </div>

      {/* Vocabulary sidebar */}
      {currentTopic && (
        <Sidebar title="Vocabulary">
          <div className="space-y-2">
            {currentTopic.vocabulary.slice(0, 10).map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="text-xs p-3 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border border-border"
              >
                <span className="font-medium text-foreground/80">{v.word}</span>
                <span className="text-foreground/30 ml-2">{v.translation}</span>
              </motion.div>
            ))}
          </div>
        </Sidebar>
      )}
    </div>
  );
}
