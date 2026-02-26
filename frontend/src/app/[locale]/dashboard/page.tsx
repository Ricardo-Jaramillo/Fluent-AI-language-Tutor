"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Activity, BarChart3, Trophy, Sparkles, Calendar } from "lucide-react";
import { Card, Badge, Button, ProgressBar } from "@/components/ui";
import NavBar from "@/components/layout/NavBar";
import PageContainer from "@/components/layout/PageContainer";
import AnimatedPage from "@/components/AnimatedPage";
import { staggerContainer, listItem } from "@/lib/animations";

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
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t("title")}</h1>
            <Link href="/onboarding">
              <Button icon={<Sparkles className="h-4 w-4" />}>
                {t("newSession")}
              </Button>
            </Link>
          </div>

          {hasData ? (
            <>
              {/* Stats cards */}
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <motion.div variants={listItem}>
                  <Card variant="glass" className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-600/15 flex items-center justify-center shrink-0">
                      <Activity className="h-5 w-5 text-primary-400" />
                    </div>
                    <div>
                      <div className="text-sm text-foreground/50">{t("sessions")}</div>
                      <div className="text-3xl font-bold">{mockSessions.length}</div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div variants={listItem}>
                  <Card variant="glass" className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-600/15 flex items-center justify-center shrink-0">
                      <Trophy className="h-5 w-5 text-accent-400" />
                    </div>
                    <div>
                      <div className="text-sm text-foreground/50">{t("avgScore")}</div>
                      <div className="text-3xl font-bold">
                        {Math.round((avgFluency + avgGrammar + avgPronunciation) / 3)}%
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div variants={listItem}>
                  <Card variant="glass" className="space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-foreground/50">
                        <span>{t("fluency")}</span>
                        <span>{avgFluency}%</span>
                      </div>
                      <ProgressBar value={avgFluency} color="primary" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-foreground/50">
                        <span>{t("grammar")}</span>
                        <span>{avgGrammar}%</span>
                      </div>
                      <ProgressBar value={avgGrammar} color="accent" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-foreground/50">
                        <span>{t("pronunciation")}</span>
                        <span>{avgPronunciation}%</span>
                      </div>
                      <ProgressBar value={avgPronunciation} color="info" />
                    </div>
                  </Card>
                </motion.div>
              </motion.div>

              {/* Session history */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">{t("history")}</h2>
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
                          <div className="flex items-center gap-1.5 text-xs text-foreground/40">
                            <Calendar className="h-3 w-3" />
                            {new Date(session.startedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-6 text-xs">
                          <div className="text-center">
                            <div className="text-foreground/40">{t("fluency")}</div>
                            <div className="font-semibold text-primary-400">{session.fluencyScore}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-foreground/40">{t("grammar")}</div>
                            <div className="font-semibold text-accent-400">{session.grammarScore}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-foreground/40">{t("pronunciation")}</div>
                            <div className="font-semibold text-info">{session.pronunciationScore}%</div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </>
          ) : (
            /* Empty state */
            <Card variant="glass" className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-600/15 flex items-center justify-center mx-auto">
                <BarChart3 className="h-8 w-8 text-primary-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{t("noSessions")}</h3>
                <p className="text-sm text-foreground/40">{t("getStarted")}</p>
              </div>
              <Link href="/onboarding">
                <Button icon={<Sparkles className="h-4 w-4" />}>
                  {t("startFirst")}
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </PageContainer>
    </AnimatedPage>
  );
}
