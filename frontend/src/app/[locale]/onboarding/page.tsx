"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useSessionStore } from "@/stores/session";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Pencil, BookOpen, ArrowLeft, ChevronRight } from "lucide-react";
import { ProgressBar, Badge } from "@/components/ui";
import NavBar from "@/components/layout/NavBar";
import AnimatedPage from "@/components/AnimatedPage";
import syllabus from "@/data/syllabus.json";

const levels = ["A1", "A2", "B1", "B2", "C1"] as const;

const levelDescriptions: Record<string, string> = {
  A1: "Complete beginner",
  A2: "Elementary",
  B1: "Intermediate",
  B2: "Upper intermediate",
  C1: "Advanced",
};

const levelColors: Record<string, string> = {
  A1: "bg-primary-600/20 border-primary-500/30 text-primary-400",
  A2: "bg-primary-600/15 border-primary-500/25 text-primary-400",
  B1: "bg-accent-600/20 border-accent-500/30 text-accent-400",
  B2: "bg-accent-600/15 border-accent-500/25 text-accent-400",
  C1: "bg-warning/20 border-warning/30 text-warning",
};

const modeConfig = [
  { key: "chat" as const, icon: MessageCircle },
  { key: "correction" as const, icon: Pencil },
  { key: "teaching" as const, icon: BookOpen },
];

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const st = useTranslations("session");
  const common = useTranslations("common");
  const router = useRouter();
  const session = useSessionStore();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const selectedLevel = syllabus.levels.find((l) => l.id === session.level);
  const selectedModule = selectedLevel?.modules.find(
    (m) => m.id === session.moduleId
  );

  const goForward = (nextStep: number) => {
    setDirection(1);
    setStep(nextStep);
  };

  const goBack = (prevStep: number) => {
    setDirection(-1);
    setStep(prevStep);
  };

  const handleFinish = () => {
    router.push("/session");
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <AnimatedPage>
      <NavBar />
      <div className="flex items-center justify-center min-h-[calc(100vh-57px)] px-4">
        <div className="w-full max-w-lg space-y-6">
          {/* Progress bar */}
          <ProgressBar value={(step + 1) * 25} color="primary" />

          {/* Step indicator */}
          <div className="flex items-center gap-2 text-sm text-foreground/40">
            <span>{t("step")} {step + 1}/4</span>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 0: Level */}
            {step === 0 && (
              <motion.div
                key="level"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <h1 className="text-2xl font-bold">{t("welcome")}</h1>
                <h2 className="text-lg text-foreground/70">{t("selectLevel")}</h2>
                <div className="grid grid-cols-1 gap-3">
                  {levels.map((level) => (
                    <motion.button
                      key={level}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        session.setLevel(level);
                        goForward(1);
                      }}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        session.level === level
                          ? levelColors[level]
                          : "border-border hover:border-border-strong bg-surface"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold">{level}</span>
                        <span className="text-sm text-foreground/50">{levelDescriptions[level]}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-foreground/30" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Module */}
            {step === 1 && selectedLevel && (
              <motion.div
                key="module"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold">{t("selectModule")}</h2>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {selectedLevel.modules.map((mod, i) => (
                    <motion.button
                      key={mod.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        session.setModule(mod.id);
                        goForward(2);
                      }}
                      className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:border-border-strong bg-surface text-left transition-all"
                    >
                      <div className="w-1 h-8 rounded-full bg-primary-600/40" />
                      <div className="flex-1">
                        <div className="font-medium">{mod.name}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-foreground/30" />
                    </motion.button>
                  ))}
                </div>
                <button
                  onClick={() => goBack(0)}
                  className="flex items-center gap-1 text-sm text-foreground/50 hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {common("back")}
                </button>
              </motion.div>
            )}

            {/* Step 2: Topic */}
            {step === 2 && selectedModule && (
              <motion.div
                key="topic"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold">{t("selectTopic")}</h2>
                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {selectedModule.topics.map((topic, i) => (
                    <motion.button
                      key={topic.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        session.setTopic(topic.id);
                        goForward(3);
                      }}
                      className="w-full p-3 rounded-xl border border-border hover:border-border-strong bg-surface text-left transition-all"
                    >
                      <div className="font-medium text-sm">{topic.name}</div>
                      <div className="text-xs text-foreground/40 mt-1">{topic.description}</div>
                    </motion.button>
                  ))}
                </div>
                <button
                  onClick={() => goBack(1)}
                  className="flex items-center gap-1 text-sm text-foreground/50 hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {common("back")}
                </button>
              </motion.div>
            )}

            {/* Step 3: Mode */}
            {step === 3 && (
              <motion.div
                key="mode"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold">{t("selectMode")}</h2>
                <div className="space-y-3">
                  {modeConfig.map(({ key, icon: Icon }, i) => {
                    const isRecommended =
                      (key === "teaching" && (session.level === "A1" || session.level === "A2")) ||
                      (key === "chat" && (session.level === "B1" || session.level === "B2" || session.level === "C1"));

                    return (
                      <motion.button
                        key={key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          session.setMode(key);
                          handleFinish();
                        }}
                        className="w-full flex items-start gap-4 p-5 rounded-xl border border-border hover:border-border-strong bg-surface text-left transition-all"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary-600/15 flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{st(`modes.${key}`)}</span>
                            {isRecommended && (
                              <Badge variant="primary" size="sm">{t("recommended")}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-foreground/50 mt-1">
                            {st(`modeDescriptions.${key}`)}
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-foreground/30 mt-3" />
                      </motion.button>
                    );
                  })}
                </div>
                <button
                  onClick={() => goBack(2)}
                  className="flex items-center gap-1 text-sm text-foreground/50 hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {common("back")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AnimatedPage>
  );
}
