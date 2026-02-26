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
  { value: "deepseek" as const, label: "DeepSeek V3", isDefault: true },
  { value: "claude" as const, label: "Claude" },
  { value: "openai" as const, label: "OpenAI" },
  { value: "gemini" as const, label: "Gemini" },
];

const languages = [
  { value: "en", label: "English", flag: "EN" },
  { value: "es", label: "Espanol", flag: "ES" },
  { value: "fr", label: "Francais", flag: "FR" },
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
        <div className="space-y-8">
          <h1 className="text-2xl font-bold">{t("title")}</h1>

          {/* Language */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-foreground/50" />
              <h2 className="text-sm font-medium text-foreground/70">{t("language")}</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map(({ value, label, flag }) => (
                <motion.button
                  key={value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleLanguageChange(value)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-border-strong bg-surface text-left transition-all"
                >
                  <span className="w-8 h-8 rounded-lg bg-primary-600/10 flex items-center justify-center text-xs font-bold text-primary-400">
                    {flag}
                  </span>
                  <span className="text-sm font-medium">{label}</span>
                </motion.button>
              ))}
            </div>
          </section>

          <div className="h-px bg-border" />

          {/* LLM Provider */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-foreground/50" />
              <h2 className="text-sm font-medium text-foreground/70">{t("llmProvider")}</h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {providers.map(({ value, label, isDefault }) => (
                <motion.button
                  key={value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    settings.setLLMProvider(value);
                    addToast("success", t("providerChanged"));
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
                    settings.llmProvider === value
                      ? "border-primary-500/40 bg-primary-600/10"
                      : "border-border hover:border-border-strong bg-surface"
                  }`}
                >
                  <span className="font-medium">{label}</span>
                  <div className="flex items-center gap-1.5">
                    {isDefault && (
                      <Badge variant="primary" size="sm">{t("default")}</Badge>
                    )}
                    {settings.llmProvider === value && (
                      <Check className="h-4 w-4 text-primary-400" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          <div className="h-px bg-border" />

          {/* Theme */}
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-foreground/70">{t("theme")}</h2>
            <div className="grid grid-cols-3 gap-2">
              {themeConfig.map(({ value, icon: Icon }) => (
                <motion.button
                  key={value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => settings.setTheme(value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-sm transition-all ${
                    settings.theme === value
                      ? "border-primary-500/40 bg-primary-600/10"
                      : "border-border hover:border-border-strong bg-surface"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${
                    settings.theme === value ? "text-primary-400" : "text-foreground/50"
                  }`} />
                  <span className="font-medium">{t(value)}</span>
                </motion.button>
              ))}
            </div>
          </section>

          <div className="h-px bg-border" />

          {/* Danger zone */}
          <Card variant="outlined" className="border-error/20 bg-error/5">
            <h2 className="text-sm font-medium text-error mb-3">{t("dangerZone")}</h2>
            <p className="text-xs text-foreground/40 mb-4">{t("dangerDescription")}</p>
            <Button variant="danger" size="sm" icon={<Trash2 className="h-4 w-4" />}>
              {t("deleteAccount")}
            </Button>
          </Card>
        </div>
      </PageContainer>
    </AnimatedPage>
  );
}
