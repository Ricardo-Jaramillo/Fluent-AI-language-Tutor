"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSessionStore } from "@/stores/session";
import { useRouter } from "@/i18n/routing";
import { motion } from "framer-motion";
import { ChevronLeft, Mic } from "lucide-react";
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

const levelBadgeVariants: Record<string, "level-a1" | "level-a2" | "level-b1" | "level-b2" | "level-c1"> = {
  A1: "level-a1",
  A2: "level-a2",
  B1: "level-b1",
  B2: "level-b2",
  C1: "level-c1",
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
  const badgeVariant = session.level ? levelBadgeVariants[session.level] : "primary";

  return (
    <AnimatedPage className="flex flex-col h-screen">
      {/* Minimal immersive header (Section 5 — hide nav during session) */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-[var(--bg-base)]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={handleEndSession}
            className="p-1.5 rounded-[var(--radius-sm)] text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors"
            aria-label="End session and go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <Badge variant={badgeVariant}>{session.level}</Badge>
          <span className="text-sm text-foreground/40">{t(`modes.${session.mode}`)}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEndSession}
        >
          {t("endSession")}
        </Button>
      </header>

      {/* Mode content */}
      <ModeComponent />

      {/* Mic button area */}
      <div className="flex flex-col items-center gap-2 py-6 border-t border-border bg-[var(--bg-base)]" style={{ zIndex: "var(--z-mic)" }}>
        <div className="relative">
          {/* Pulse rings when recording (Section 4) */}
          {session.isRecording && (
            <>
              <motion.div
                animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-primary-400/25"
              />
              <motion.div
                animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                className="absolute inset-0 rounded-full bg-primary-400/15"
              />
              <motion.div
                animate={{ scale: [1, 1.5], opacity: [0.2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                className="absolute inset-0 rounded-full bg-primary-400/10"
              />
            </>
          )}

          {/* Processing spinner overlay */}
          {session.isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[var(--bg-elevated)]/80">
              <Spinner size="lg" />
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onMouseDown={() => session.setRecording(true)}
            onMouseUp={() => session.setRecording(false)}
            onTouchStart={() => session.setRecording(true)}
            onTouchEnd={() => session.setRecording(false)}
            className={`relative w-16 h-16 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${
              session.isRecording
                ? "bg-primary-400 scale-95 shadow-[0_0_24px_hsla(156,48%,52%,0.4)]"
                : "bg-primary-600 hover:bg-primary-500 mic-idle"
            }`}
            style={{ width: "64px", height: "64px" }}
            aria-label={session.isRecording ? t("stopRecording") : t("startRecording")}
          >
            <Mic className="w-7 h-7 text-white" />
          </motion.button>
        </div>
        <span className="text-xs text-foreground/25">
          {session.isRecording ? t("stopRecording") : t("startRecording")}
        </span>
      </div>
    </AnimatedPage>
  );
}
