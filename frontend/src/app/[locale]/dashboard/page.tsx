"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { Activity, Trophy, Sparkles, Calendar, MessageCircle } from "lucide-react";
import { Card, Badge, Button, ProgressBar, Skeleton } from "@/components/ui";
import NavBar from "@/components/layout/NavBar";
import PageContainer from "@/components/layout/PageContainer";
import AnimatedPage from "@/components/AnimatedPage";
import { staggerContainer, listItem, bouncy } from "@/lib/animations";
import { useAuthStore } from "@/stores/auth";
import { createClient } from "@/lib/supabase";

interface SessionRow {
  id: string;
  mode: "chat" | "correction" | "teaching" | "unified";
  level: string;
  started_at: string;
  ended_at: string | null;
  fluency_score: number | null;
  grammar_score: number | null;
  pronunciation_score: number | null;
}

const modeLabels: Record<string, string> = {
  chat: "Free Chat",
  correction: "Correction",
  teaching: "Teaching",
  unified: "Conversation",
};

const modeBadgeVariant: Record<string, "primary" | "warning" | "success"> = {
  chat: "primary",
  correction: "warning",
  teaching: "success",
  unified: "primary",
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
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("sessions")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setSessions((data as SessionRow[]) ?? []);
        setIsLoading(false);
      });
  }, [user]);

  const { avgFluency, avgGrammar, avgPronunciation } = useMemo(() => {
    const scored = sessions.filter(
      (s) => s.fluency_score != null || s.grammar_score != null || s.pronunciation_score != null,
    );
    if (scored.length === 0) return { avgFluency: 0, avgGrammar: 0, avgPronunciation: 0 };
    return {
      avgFluency: Math.round(scored.reduce((sum, s) => sum + (s.fluency_score ?? 0), 0) / scored.length),
      avgGrammar: Math.round(scored.reduce((sum, s) => sum + (s.grammar_score ?? 0), 0) / scored.length),
      avgPronunciation: Math.round(scored.reduce((sum, s) => sum + (s.pronunciation_score ?? 0), 0) / scored.length),
    };
  }, [sessions]);

  const hasData = sessions.length > 0;

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
                  {sessions.length} {t("sessions").toLowerCase()}. {t("keepItUp")}
                </p>
              )}
            </div>
            <Link href="/session">
              <Button icon={<Sparkles className="h-4 w-4" />}>
                {t("newSession")}
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
          ) : hasData ? (
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
                        {sessions.length}
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
                        {avgFluency + avgGrammar + avgPronunciation > 0
                          ? `${Math.round((avgFluency + avgGrammar + avgPronunciation) / 3)}%`
                          : "—"}
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
                  {sessions.map((session) => (
                    <motion.div key={session.id} variants={listItem}>
                      <Card
                        variant="outlined"
                        padding="sm"
                        className="flex items-center justify-between hover:border-border-strong transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="default">{session.level}</Badge>
                            <Badge variant={modeBadgeVariant[session.mode] ?? "primary"}>
                              {modeLabels[session.mode] ?? session.mode}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-foreground/30">
                            <Calendar className="h-3 w-3" />
                            {formatRelativeDate(session.started_at)}
                          </div>
                        </div>
                        <div className="flex gap-6 text-xs">
                          <div className="text-center">
                            <div className="text-foreground/30">{t("fluency")}</div>
                            <div className="font-semibold text-primary-400 tabular-nums">
                              {session.fluency_score != null ? `${session.fluency_score}%` : "—"}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-foreground/30">{t("grammar")}</div>
                            <div className="font-semibold text-info tabular-nums">
                              {session.grammar_score != null ? `${session.grammar_score}%` : "—"}
                            </div>
                          </div>
                          <div className="text-center hidden sm:block">
                            <div className="text-foreground/30">{t("pronunciation")}</div>
                            <div className="font-semibold text-accent-400 tabular-nums">
                              {session.pronunciation_score != null ? `${session.pronunciation_score}%` : "—"}
                            </div>
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
              <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center mx-auto">
                <MessageCircle className="h-8 w-8 text-foreground/30" />
              </div>
              <div className="space-y-2 max-w-xs mx-auto">
                <h3 className="text-lg font-semibold font-[family-name:var(--font-display)]">
                  {t("noSessions")}
                </h3>
                <p className="text-sm text-foreground/35">
                  {t("getStarted")}
                </p>
              </div>
              <Link href="/session">
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
