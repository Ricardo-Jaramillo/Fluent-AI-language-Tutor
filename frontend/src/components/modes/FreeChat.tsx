"use client";

import { useSessionStore } from "@/stores/session";
import { motion } from "framer-motion";
import { MessageSquare, Mic } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";
import { Skeleton } from "@/components/ui";

export default function FreeChat() {
  const { messages, isProcessing } = useSessionStore();

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-20 space-y-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-600/15 flex items-center justify-center mx-auto">
            <MessageSquare className="h-7 w-7 text-primary-400" />
          </div>
          <p className="text-lg font-medium text-foreground/60">Lass uns auf Deutsch sprechen!</p>
          <div className="flex items-center justify-center gap-1.5 text-sm text-foreground/30">
            <Mic className="h-3.5 w-3.5" />
            <span>Press the mic button to start talking</span>
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
  );
}
