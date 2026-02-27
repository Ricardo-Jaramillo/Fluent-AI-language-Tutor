"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Activity, Trophy, Sparkles, Calendar, MessageCircle } from "lucide-react";
import { Card, Badge, Button, ProgressBar } from "@/components/ui";
import NavBar from "@/components/layout/NavBar";
import PageContainer from "@/components/layout/PageContainer";
import AnimatedPage from "@/components/AnimatedPage";
import { staggerContainer, listItem, bouncy } from "@/lib/animations";

// Mock data — replaced by Supabase queries at runtime
const mockSessions = [
  {
    id: "1",
    mode: "chat" as const,
    level: "A1",
    startedAt: "2026-02-20T10:00:00Z",
    fluencyScore: 72,
    grammarScore: 65,
    pronunciationScore: 58,
  },
  {
    id: "2",
    mode: "correction" as const,
    level: "A1",
    startedAt: "2026-02-21T14:30:00Z",
    fluencyScore: 78,
    grammarScore: 70,
    pronunciationScore: 62,
  },
  {
    id: "3",
    mode: "teaching" as const,
    level: "A1",
    startedAt: "2026-02-22T09:15:00Z",
    fluencyScore: 80,
    grammarScore: 75,
    pronunciationScore: 68,
  },
];

const modeLabels = {
  chat: "Free Chat",
  correction: "Correction",
  teaching: "Teaching",
};

const modeBadgeVariant = {
  chat: "primary" as const,
  correction: "warning" as const,
  teaching: "success" as const,
};

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  const avgFluency = Math.round(
    mockSessions.reduce((sum, s) => sum + s.fluencyScore, 0) / mockSessions.length
  );
  const avgGrammar = Math.round(
    mockSessions.reduce((sum, s) => sum + s.grammarScore, 0) / mockSessions.length
  );
  const avgPronunciation = Math.round(
    mockSessions.reduce((sum, s) => sum + s.pronunciationScore, 0) / mockSessions.length
  );

  const hasData = mockSessions.length > 0;

  return (
    <AnimatedPage>
      <NavBar />
      <PageContainer size="lg">
        <div className="space-y-12">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">{t("title")}</h1>
              {hasData && (
                <p className="text-sm text-foreground/35 mt-1">
                  {mockSessions.length} sessions completed. Weiter so!
                </p>
              )}
            </div>
            <Link href="/onboarding">
              <Button icon={<Sparkles className="h-4 w-4" />}>
                {t("newSession")}
              </Button>
            </Link>
          </div>

          {hasData ? (
            <>
              {/* Score rings + stats */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              >
                {/* Sessions count */}
                <motion.div variants={listItem}>
                  <Card variant="glass" hoverable className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-[var(--radius-md)] bg-primary-600/15 flex items-center justify-center shrink-0">
                      <Activity className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                      <div className="text-sm text-foreground/40">{t("sessions")}</div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={bouncy}
                        className="text-3xl font-bold font-[family-name:var(--font-display)]"
                      >
                        {mockSessions.length}
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>

                {/* Average score */}
                <motion.div variants={listItem}>
                  <Card variant="glass" hoverable className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-[var(--radius-md)] bg-accent-600/15 flex items-center justify-center shrink-0">
                      <Trophy className="h-5 w-5 text-accent-400" />
                    </div>
                    <div>
                      <div className="text-sm text-foreground/40">{t("avgScore")}</div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={bouncy}
                        className="text-3xl font-bold font-[family-name:var(--font-display)]"
                      >
                        {Math.round((avgFluency + avgGrammar + avgPronunciation) / 3)}%
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>

                {/* Skill breakdown */}
                <motion.div variants={listItem}>
                  <Card variant="glass" className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-foreground/40">
                        <span>{t("fluency")}</span>
                        <span className="tabular-nums">{avgFluency}%</span>
                      </div>
                      <ProgressBar value={avgFluency} color="primary" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-foreground/40">
                        <span>{t("grammar")}</span>
                        <span className="tabular-nums">{avgGrammar}%</span>
                      </div>
                      <ProgressBar value={avgGrammar} color="info" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-foreground/40">
                        <span>{t("pronunciation")}</span>
                        <span className="tabular-nums">{avgPronunciation}%</span>
                      </div>
                      <ProgressBar value={avgPronunciation} color="accent" />
                    </div>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Session history */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold font-[family-name:var(--font-display)] text-foreground/80">
                  {t("history")}
                </h2>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="space-y-2"
                >
                  {mockSessions.map((session) => (
                    <motion.div key={session.id} variants={listItem}>
                      <Card
                        variant="outlined"
                        padding="sm"
                        className="flex items-center justify-between hover:border-border-strong transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="default">{session.level}</Badge>
                            <Badge variant={modeBadgeVariant[session.mode]}>
                              {modeLabels[session.mode]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-foreground/30">
                            <Calendar className="h-3 w-3" />
                            {formatRelativeDate(session.startedAt)}
                          </div>
                        </div>
                        <div className="flex gap-6 text-xs">
                          <div className="text-center">
                            <div className="text-foreground/30">{t("fluency")}</div>
                            <div className="font-semibold text-primary-400 tabular-nums">{session.fluencyScore}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-foreground/30">{t("grammar")}</div>
                            <div className="font-semibold text-info tabular-nums">{session.grammarScore}%</div>
                          </div>
                          <div className="text-center hidden sm:block">
                            <div className="text-foreground/30">{t("pronunciation")}</div>
                            <div className="font-semibold text-accent-400 tabular-nums">{session.pronunciationScore}%</div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </>
          ) : (
            /* Empty state (Section 15) */
            <Card variant="glass" className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center mx-auto">
                <MessageCircle className="h-8 w-8 text-foreground/30" />
              </div>
              <div className="space-y-2 max-w-xs mx-auto">
                <h3 className="text-lg font-semibold font-[family-name:var(--font-display)]">
                  Dein erstes Gespräch wartet
                </h3>
                <p className="text-sm text-foreground/35">
                  Start a conversation to begin your German journey. Pick a topic, choose your level, and just speak.
                </p>
              </div>
              <Link href="/onboarding">
                <Button icon={<Sparkles className="h-4 w-4" />}>
                  Start First Session
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </PageContainer>
    </AnimatedPage>
  );
}
