"use client";

import { useSessionStore } from "@/stores/session";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";
import { Skeleton } from "@/components/ui";

export default function FreeChat() {
  const { messages, isProcessing } = useSessionStore();

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-2">
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 28 }}
          className="text-center mt-20 space-y-3 max-w-xs mx-auto"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary-600/10 flex items-center justify-center mx-auto">
            <Mic className="h-7 w-7 text-primary-400" />
          </div>
          <p className="text-lg font-medium font-[family-name:var(--font-display)] text-foreground/50">
            Bereit? Los geht&apos;s!
          </p>
          <p className="text-sm text-foreground/25">
            Tap the mic and say something in German. Don&apos;t worry about mistakes.
          </p>
        </motion.div>
      )}
      {messages.map((msg, i) => (
        <div
          key={msg.id}
          className={i > 0 && messages[i - 1].role !== msg.role ? "mt-4" : ""}
        >
          <MessageBubble role={msg.role} content={msg.content} />
        </div>
      ))}
      {isProcessing && (
        <div className="mr-auto max-w-[60%] space-y-2">
          <Skeleton variant="bubble" />
        </div>
      )}
    </div>
  );
}
