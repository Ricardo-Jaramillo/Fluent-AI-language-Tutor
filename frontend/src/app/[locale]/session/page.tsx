"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSessionStore } from "@/stores/session";
import { useRouter } from "@/i18n/routing";
import { motion } from "framer-motion";
import { LogOut, Mic } from "lucide-react";
import FreeChat from "@/components/modes/FreeChat";
import RealTimeCorrection from "@/components/modes/RealTimeCorrection";
import GuidedTeaching from "@/components/modes/GuidedTeaching";
import { Badge, Button, Spinner } from "@/components/ui";
import AnimatedPage from "@/components/AnimatedPage";

const modeComponents = {
  chat: FreeChat,
  correction: RealTimeCorrection,
  teaching: GuidedTeaching,
};

export default function SessionPage() {
  const t = useTranslations("session");
  const router = useRouter();
  const session = useSessionStore();

  const handleEndSession = () => {
    session.reset();
    router.push("/dashboard");
  };

  useEffect(() => {
    if (!session.mode) {
      router.push("/onboarding");
    }
  }, [session.mode, router]);

  if (!session.mode) {
    return null;
  }

  const ModeComponent = modeComponents[session.mode];

  return (
    <AnimatedPage className="flex flex-col h-screen">
      {/* Minimal header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Badge variant="primary">{session.level}</Badge>
          <span className="text-sm text-foreground/50">{t(`modes.${session.mode}`)}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<LogOut className="h-4 w-4" />}
          onClick={handleEndSession}
        >
          {t("endSession")}
        </Button>
      </header>

      {/* Mode content */}
      <ModeComponent />

      {/* Mic button area */}
      <div className="flex flex-col items-center gap-2 py-6 border-t border-border bg-background">
        <div className="relative">
          {/* Pulse rings when recording */}
          {session.isRecording && (
            <>
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-error/30"
              />
              <motion.div
                animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                className="absolute inset-0 rounded-full bg-error/20"
              />
            </>
          )}

          {/* Processing spinner overlay */}
          {session.isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-surface-elevated/80">
              <Spinner size="lg" />
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onMouseDown={() => session.setRecording(true)}
            onMouseUp={() => session.setRecording(false)}
            onTouchStart={() => session.setRecording(true)}
            onTouchEnd={() => session.setRecording(false)}
            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg ${
              session.isRecording
                ? "bg-error shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                : "bg-primary-600 hover:bg-primary-500 hover:shadow-glow-primary"
            }`}
            aria-label={session.isRecording ? t("stopRecording") : t("startRecording")}
          >
            <Mic className="w-7 h-7 text-white" />
          </motion.button>
        </div>
        <span className="text-xs text-foreground/30">
          {session.isRecording ? t("stopRecording") : t("startRecording")}
        </span>
      </div>
    </AnimatedPage>
  );
}
