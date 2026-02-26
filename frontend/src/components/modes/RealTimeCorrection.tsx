"use client";

import { useSessionStore } from "@/stores/session";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";
import { Skeleton } from "@/components/ui";
import Sidebar from "@/components/layout/Sidebar";

export default function RealTimeCorrection() {
  const { messages, isProcessing } = useSessionStore();

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main conversation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-20 space-y-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-accent-600/15 flex items-center justify-center mx-auto">
              <Pencil className="h-7 w-7 text-accent-400" />
            </div>
            <p className="text-lg font-medium text-foreground/60">Echtzeit-Korrektur aktiv</p>
            <p className="text-sm text-foreground/30">
              Speak naturally — errors will be highlighted
            </p>
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

      {/* Corrections sidebar */}
      <Sidebar title="Corrections">
        {messages.length === 0 ? (
          <p className="text-xs text-foreground/30">
            Corrections will appear here as you speak
          </p>
        ) : (
          <div className="space-y-2">
            {messages
              .filter((m) => m.role === "assistant")
              .slice(-5)
              .map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="text-xs p-2.5 rounded-lg bg-surface border border-border text-foreground/70"
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
