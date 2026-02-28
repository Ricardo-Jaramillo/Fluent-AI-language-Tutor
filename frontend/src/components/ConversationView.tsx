"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useSessionStore } from "@/stores/session";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";
import { Skeleton } from "@/components/ui";

export default function ConversationView() {
  const t = useTranslations("session");
  const { messages, isProcessing } = useSessionStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isProcessing]);

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
            {t("emptyChat")}
          </p>
          <p className="text-sm text-foreground/25">
            {t("emptyChatHint")}
          </p>
        </motion.div>
      )}
      {messages.map((msg, i) => (
        <div
          key={msg.id}
          className={i > 0 && messages[i - 1].role !== msg.role ? "mt-4" : ""}
        >
          <MessageBubble
            role={msg.role}
            content={msg.content}
            errors={msg.ipaErrors}
            corrections={msg.grammarCorrections}
          />
        </div>
      ))}
      {isProcessing && (
        <div className="mr-auto max-w-[60%] space-y-2">
          <Skeleton variant="bubble" />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
