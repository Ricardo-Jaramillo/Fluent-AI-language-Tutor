"use client";

import { useSessionStore } from "@/stores/session";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";
import { Skeleton } from "@/components/ui";
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
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.length === 0 && currentTopic && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-10 space-y-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary-600/15 flex items-center justify-center mx-auto">
              <BookOpen className="h-7 w-7 text-primary-400" />
            </div>
            <p className="text-lg font-medium text-foreground/70">{currentTopic.name}</p>
            <p className="text-sm text-foreground/40">{currentTopic.description}</p>
            <div className="text-sm space-y-1">
              <p className="text-foreground/50 text-xs uppercase tracking-wider">Conversation starters</p>
              {currentTopic.conversation_starters.map((s, i) => (
                <p key={i} className="text-foreground/60 italic">
                  &ldquo;{s}&rdquo;
                </p>
              ))}
            </div>
          </motion.div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isProcessing && (
          <div className="mr-auto p-4 rounded-2xl rounded-bl-md bg-surface-elevated border border-border max-w-[60%] space-y-2">
            <Skeleton width="80%" />
            <Skeleton width="50%" />
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
                className="text-xs p-2.5 rounded-lg bg-surface border border-border"
              >
                <span className="font-medium text-foreground/80">{v.word}</span>
                <span className="text-foreground/40 ml-2">{v.translation}</span>
              </motion.div>
            ))}
          </div>
        </Sidebar>
      )}
    </div>
  );
}
