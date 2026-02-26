"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { MessageCircle, Pencil, BookOpen, Sparkles } from "lucide-react";
import { Button, Card } from "@/components/ui";
import AnimatedPage from "@/components/AnimatedPage";
import { staggerContainer, scrollReveal, scrollRevealConfig } from "@/lib/animations";

const features = [
  { key: "chat" as const, icon: MessageCircle },
  { key: "correction" as const, icon: Pencil },
  { key: "teaching" as const, icon: BookOpen },
];

const stats = [
  { value: "72", label: "Topics" },
  { value: "5", label: "Levels" },
  { value: "A1-C1", label: "Range" },
];

export default function LandingPage() {
  const t = useTranslations("landing");
  const common = useTranslations("common");

  return (
    <AnimatedPage>
      <div className="relative min-h-screen overflow-hidden">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary-900/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-900/10 rounded-full blur-3xl" />
        </div>

        {/* Floating decorative elements */}
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute top-32 left-[15%] w-3 h-3 rounded-full bg-primary-500/20"
        />
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="pointer-events-none absolute top-48 right-[20%] w-2 h-2 rounded-full bg-accent-500/20"
        />
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="pointer-events-none absolute bottom-60 left-[25%] w-4 h-4 rounded-full bg-primary-400/10"
        />

        <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight gradient-text">
                {common("appName")}
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-lg sm:text-xl text-foreground/50 max-w-lg mx-auto"
              >
                {common("tagline")}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-3"
            >
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground/90">
                {t("hero")}
              </h2>
              <p className="text-foreground/50">{t("subtitle")}</p>
            </motion.div>

            {/* Feature cards */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12"
            >
              {features.map(({ key, icon: Icon }, i) => (
                <motion.div
                  key={key}
                  variants={scrollReveal}
                  transition={{ ...scrollRevealConfig, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card variant="glass" padding="md" className="text-left space-y-3 h-full hover:border-border-strong transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-primary-600/15 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary-400" />
                    </div>
                    <h3 className="text-lg font-semibold">
                      {t(`features.${key}.title`)}
                    </h3>
                    <p className="text-sm text-foreground/50 leading-relaxed">
                      {t(`features.${key}.description`)}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-8 py-4"
            >
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-primary-400">{value}</div>
                  <div className="text-xs text-foreground/40 uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link href="/auth">
                <Button
                  size="lg"
                  icon={<Sparkles className="h-5 w-5" />}
                  className="shadow-glow-primary"
                >
                  {t("cta")}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
