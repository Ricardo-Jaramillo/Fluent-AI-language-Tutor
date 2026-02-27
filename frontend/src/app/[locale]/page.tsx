"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { MessageCircle, Pencil, BookOpen, Sparkles } from "lucide-react";
import { Button, Card } from "@/components/ui";
import AnimatedPage from "@/components/AnimatedPage";
import { staggerContainer, scrollReveal, scrollRevealConfig, gentle } from "@/lib/animations";

const features = [
  { key: "chat" as const, icon: MessageCircle },
  { key: "correction" as const, icon: Pencil },
  { key: "teaching" as const, icon: BookOpen },
];

const stats = [
  { value: "72", label: "conversation topics from ordering coffee to debating politics" },
  { value: "5", label: "CEFR levels, A1 beginner through C1 advanced" },
  { value: "3", label: "practice modes tailored to your learning style" },
];

export default function LandingPage() {
  const t = useTranslations("landing");
  const common = useTranslations("common");

  return (
    <AnimatedPage>
      <div className="relative min-h-screen overflow-hidden app-background">
        {/* Layered atmospheric background */}
        <div className="pointer-events-none absolute inset-0">
          {/* Primary gradient glow */}
          <div className="absolute top-0 left-1/3 w-[600px] h-[500px] bg-primary-900/15 rounded-full blur-[100px]" />
          {/* Warm ambient bottom */}
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-accent-900/8 rounded-full blur-[80px]" />
          {/* Topographic contour lines (subtle journey metaphor) */}
          <svg className="absolute bottom-0 left-0 right-0 h-1/3 opacity-[0.03]" viewBox="0 0 1200 400" preserveAspectRatio="none">
            <path d="M0 300 Q 300 250 600 280 T 1200 260" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary-400"/>
            <path d="M0 320 Q 400 290 700 310 T 1200 290" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary-400"/>
            <path d="M0 350 Q 350 320 650 340 T 1200 320" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary-400"/>
          </svg>
        </div>

        <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20">
          {/* Asymmetric hero layout */}
          <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Left: Copy (60%) */}
            <div className="lg:col-span-3 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={gentle}
                className="space-y-4"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-[var(--text-hero)] font-black tracking-tight gradient-text font-[family-name:var(--font-display)] leading-[1.1]">
                  {common("appName")}
                </h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, ...gentle }}
                  className="text-lg sm:text-xl text-foreground/45 max-w-lg mx-auto lg:mx-0 leading-relaxed"
                >
                  {common("tagline")}
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, ...gentle }}
                className="space-y-3"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground/90 font-[family-name:var(--font-display)]">
                  {t("hero")}
                </h2>
                <p className="text-foreground/40">{t("subtitle")}</p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, ...gentle }}
                className="space-y-3"
              >
                <Link href="/auth">
                  <Button
                    size="lg"
                    icon={<Sparkles className="h-5 w-5" />}
                    className="shadow-glow-primary text-base"
                  >
                    {t("cta")}
                  </Button>
                </Link>
                <p className="text-xs text-foreground/25">
                  Free. No credit card. Start speaking in 2 minutes.
                </p>
              </motion.div>
            </div>

            {/* Right: Conversation preview mockup (40%) */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, ...gentle }}
              className="lg:col-span-2 hidden lg:block"
            >
              <div className="glass rounded-[var(--radius-xl)] p-5 space-y-3 shadow-xl">
                {/* Fake conversation UI */}
                <div className="flex items-center gap-2 pb-3 border-b border-border">
                  <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                  <span className="text-xs text-foreground/40 font-medium">Live Session</span>
                </div>
                {/* AI message */}
                <div className="bg-[var(--bg-elevated)] border border-border rounded-2xl rounded-bl-sm p-3 max-w-[85%]">
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Hallo! Wie war dein Tag heute?
                  </p>
                </div>
                {/* User message */}
                <div className="ml-auto bg-gradient-to-br from-primary-800 to-primary-700 rounded-2xl rounded-br-sm p-3 max-w-[75%]">
                  <p className="text-sm text-white leading-relaxed">
                    Mein Tag war <span className="underline decoration-[var(--accent-coral)] decoration-dotted">gut</span>, danke!
                  </p>
                </div>
                {/* IPA annotation float */}
                <div className="ml-auto mr-4 text-xs bg-[var(--bg-overlay)] border border-border rounded-[var(--radius-md)] px-3 py-2 max-w-[60%]">
                  <span className="text-foreground/40">IPA: </span>
                  <span className="font-[family-name:var(--font-mono)] text-primary-300">/ɡuːt/</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto w-full"
          >
            {stats.map(({ value, label }) => (
              <div key={value} className="text-center sm:text-left">
                <div className="text-3xl font-black text-primary-400 font-[family-name:var(--font-display)]">{value}</div>
                <div className="text-sm text-foreground/35 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Feature cards */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto w-full"
          >
            {features.map(({ key, icon: Icon }, i) => (
              <motion.div
                key={key}
                variants={scrollReveal}
                transition={{ ...scrollRevealConfig, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  variant="glass"
                  padding="md"
                  hoverable
                  className="text-left space-y-3 h-full"
                >
                  <div className="w-10 h-10 rounded-[var(--radius-md)] bg-primary-600/15 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold font-[family-name:var(--font-display)]">
                    {t(`features.${key}.title`)}
                  </h3>
                  <p className="text-sm text-foreground/40 leading-relaxed">
                    {t(`features.${key}.description`)}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
