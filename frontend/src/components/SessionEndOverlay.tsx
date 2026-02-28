"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui";

interface SessionEndOverlayProps {
  isOpen: boolean;
  fluencyScore: number;
  grammarScore: number;
  pronunciationScore: number;
  messageCount: number;
  onPracticeAgain: () => void;
  onViewDashboard: () => void;
}

function CountUp({ target, duration = 800 }: { target: number; duration?: number }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const startTime = performance.now();
    function tick() {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);

  return <span className="tabular-nums">{value}</span>;
}

function ScoreRing({ score, color, label }: { score: number; color: string; label: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-foreground/5"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold font-[family-name:var(--font-display)]">
            <CountUp target={score} />
          </span>
        </div>
      </div>
      <span className="text-xs text-foreground/40">{label}</span>
    </div>
  );
}

export default function SessionEndOverlay({
  isOpen,
  fluencyScore,
  grammarScore,
  pronunciationScore,
  messageCount,
  onPracticeAgain,
  onViewDashboard,
}: SessionEndOverlayProps) {
  const t = useTranslations("session");
  const td = useTranslations("dashboard");
  const avgScore = Math.round((fluencyScore + grammarScore + pronunciationScore) / 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-[var(--bg-base)]/95 backdrop-blur-xl"
          style={{ zIndex: 100 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.1 }}
            className="max-w-md w-full mx-4 space-y-8 text-center"
          >
            {/* Trophy icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              className="w-16 h-16 mx-auto rounded-2xl bg-accent-600/15 flex items-center justify-center"
            >
              <Trophy className="h-8 w-8 text-accent-400" />
            </motion.div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">
                {t("gutGemacht")}
              </h2>
              <p className="text-sm text-foreground/40">
                {t("messagesExchanged", { count: messageCount })}
              </p>
            </div>

            {/* Score rings */}
            <div className="flex justify-center gap-6">
              <ScoreRing score={fluencyScore} color="hsl(var(--primary-400))" label={td("fluency")} />
              <ScoreRing score={grammarScore} color="hsl(210, 65%, 55%)" label={td("grammar")} />
              <ScoreRing score={pronunciationScore} color="hsl(var(--accent-400))" label={td("pronunciation")} />
            </div>

            {/* Overall */}
            <div className="text-sm text-foreground/50">
              {t("overall")} <span className="font-bold text-foreground">{avgScore}%</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <Button
                variant="primary"
                icon={<RotateCcw className="h-4 w-4" />}
                onClick={onPracticeAgain}
              >
                {t("practiceAgain")}
              </Button>
              <Button
                variant="secondary"
                icon={<LayoutDashboard className="h-4 w-4" />}
                onClick={onViewDashboard}
              >
                {t("viewDashboard")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
