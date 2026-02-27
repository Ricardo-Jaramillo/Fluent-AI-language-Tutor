"use client";

import { useSessionStore } from "@/stores/session";
import { motion } from "framer-motion";
import { SpellCheck, CheckCircle } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";
import { Skeleton } from "@/components/ui";
import Sidebar from "@/components/layout/Sidebar";

export default function RealTimeCorrection() {
  const { messages, isProcessing } = useSessionStore();

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main conversation (65%) */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-2">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 28 }}
            className="text-center mt-20 space-y-3 max-w-xs mx-auto"
          >
            <div className="w-14 h-14 rounded-2xl bg-[hsl(210,65%,55%)]/10 flex items-center justify-center mx-auto">
              <SpellCheck className="h-7 w-7 text-[hsl(210,65%,55%)]" />
            </div>
            <p className="text-lg font-medium font-[family-name:var(--font-display)] text-foreground/50">
              Echtzeit-Korrektur aktiv
            </p>
            <p className="text-sm text-foreground/25">
              Speak naturally — errors will be highlighted as you go
            </p>
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

      {/* Corrections sidebar (35%) — Section 4 */}
      <Sidebar title="Corrections">
        {messages.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <CheckCircle className="h-6 w-6 text-foreground/15 mx-auto" />
            <p className="text-xs text-foreground/25">
              Corrections will appear here as you speak
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages
              .filter((m) => m.role === "assistant")
              .slice(-5)
              .map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 24 }}
                  className="text-xs p-3 rounded-[var(--radius-md)] bg-[var(--bg-surface)] border-l-[3px] border-l-[var(--accent-sky)] border border-border text-foreground/60"
                >
                  {msg.content}
                </motion.div>
              ))}
          </div>
        )}
      </Sidebar>
    </div>
  );
}
