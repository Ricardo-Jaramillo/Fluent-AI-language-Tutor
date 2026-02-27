"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useSettingsStore } from "@/stores/settings";
import { useToastStore } from "@/stores/toast";
import { motion } from "framer-motion";
import { Globe, Cpu, Sun, Moon, Monitor, Check, Trash2 } from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";
import NavBar from "@/components/layout/NavBar";
import PageContainer from "@/components/layout/PageContainer";
import AnimatedPage from "@/components/AnimatedPage";

const providers = [
  { value: "deepseek" as const, label: "DeepSeek V3", desc: "Faster responses", isDefault: true },
  { value: "claude" as const, label: "Claude", desc: "More nuanced corrections" },
  { value: "openai" as const, label: "OpenAI", desc: "Balanced performance" },
  { value: "gemini" as const, label: "Gemini", desc: "Multilingual strength" },
];

const languages = [
  { value: "en", label: "English", flag: "EN" },
  { value: "es", label: "Español", flag: "ES" },
  { value: "fr", label: "Français", flag: "FR" },
  { value: "de", label: "Deutsch", flag: "DE" },
];

const themeConfig = [
  { value: "dark" as const, icon: Moon },
  { value: "light" as const, icon: Sun },
  { value: "system" as const, icon: Monitor },
];

export default function SettingsPage() {
  const t = useTranslations("settings");
  const router = useRouter();
  const pathname = usePathname();
  const settings = useSettingsStore();
  const addToast = useToastStore((s) => s.addToast);

  const handleLanguageChange = (locale: string) => {
    router.replace(pathname, { locale });
    addToast("success", t("languageChanged"));
  };

  return (
    <AnimatedPage>
      <NavBar />
      <PageContainer size="sm">
        <div className="space-y-10">
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">{t("title")}</h1>

          {/* Language */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-foreground/40" />
              <h2 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">{t("language")}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {languages.map(({ value, label, flag }) => (
                <motion.button
                  key={value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleLanguageChange(value)}
                  className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] border border-border hover:border-border-strong bg-[var(--bg-surface)] text-left transition-all"
                >
                  <span className="w-8 h-8 rounded-[var(--radius-md)] bg-primary-600/10 flex items-center justify-center text-xs font-bold text-primary-400">
                    {flag}
                  </span>
                  <span className="text-sm font-medium">{label}</span>
                </motion.button>
              ))}
            </div>
          </section>

          <div className="h-px bg-border" />

          {/* LLM Provider */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-foreground/40" />
              <h2 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">{t("llmProvider")}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {providers.map(({ value, label, desc, isDefault }) => (
                <motion.button
                  key={value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    settings.setLLMProvider(value);
                    addToast("success", t("providerChanged"));
                  }}
                  className={`flex flex-col p-3 rounded-[var(--radius-lg)] border text-sm text-left transition-all ${
                    settings.llmProvider === value
                      ? "border-primary-500/40 bg-primary-600/8"
                      : "border-border hover:border-border-strong bg-[var(--bg-surface)]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{label}</span>
                    <div className="flex items-center gap-1.5">
                      {isDefault && (
                        <Badge variant="primary" size="sm">{t("default")}</Badge>
                      )}
                      {settings.llmProvider === value && (
                        <Check className="h-4 w-4 text-primary-400" />
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-foreground/30 mt-1">{desc}</span>
                </motion.button>
              ))}
            </div>
          </section>

          <div className="h-px bg-border" />

          {/* Theme */}
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">{t("theme")}</h2>
            <div className="grid grid-cols-3 gap-3">
              {themeConfig.map(({ value, icon: Icon }) => (
                <motion.button
                  key={value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => settings.setTheme(value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-[var(--radius-lg)] border text-sm transition-all ${
                    settings.theme === value
                      ? "border-primary-500/40 bg-primary-600/8"
                      : "border-border hover:border-border-strong bg-[var(--bg-surface)]"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${
                    settings.theme === value ? "text-primary-400" : "text-foreground/40"
                  }`} />
                  <span className="font-medium">{t(value)}</span>
                </motion.button>
              ))}
            </div>
          </section>

          <div className="h-px bg-border" />

          {/* Danger zone (Section 5) */}
          <Card variant="outlined" className="border-error/15 bg-error/3">
            <h2 className="text-sm font-semibold text-error/80 mb-3">{t("dangerZone")}</h2>
            <p className="text-xs text-foreground/35 mb-4">
              Delete my account and all data. This can&apos;t be undone.
            </p>
            <Button variant="danger" size="sm" icon={<Trash2 className="h-4 w-4" />}>
              {t("deleteAccount")}
            </Button>
          </Card>
        </div>
      </PageContainer>
    </AnimatedPage>
  );
}
