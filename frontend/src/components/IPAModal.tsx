"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Modal, Badge, Button } from "@/components/ui";
import { Volume2, X } from "lucide-react";
import { playTTS } from "@/lib/audio";
import { useSettingsStore } from "@/stores/settings";

interface IPAModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: string;
  spokenIPA: string;
  correctIPA: string;
  explanation: string;
  severity: "minor" | "moderate" | "severe";
}

const severityConfig = {
  minor: { variant: "info" as const, label: "Minor" },
  moderate: { variant: "warning" as const, label: "Moderate" },
  severe: { variant: "error" as const, label: "Severe" },
};

export default function IPAModal({
  isOpen,
  onClose,
  word,
  spokenIPA,
  correctIPA,
  explanation,
  severity,
}: IPAModalProps) {
  const t = useTranslations("session");
  const config = severityConfig[severity];
  const [isPlaying, setIsPlaying] = useState(false);
  const ttsVoice = useSettingsStore((s) => s.ttsVoice);

  const handleListen = async () => {
    setIsPlaying(true);
    await playTTS(word, ttsVoice);
    setIsPlaying(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title={word}
    >
      <div className="space-y-4" aria-label={`Pronunciation details for ${word}`}>
        <Badge variant={config.variant} size="md">
          {config.label}
        </Badge>

        <div className="space-y-3 p-4 rounded-[var(--radius-md)] bg-[var(--bg-surface)]">
          <div className="flex justify-between items-center text-sm">
            <span className="text-foreground/40">{t("youSaid")}</span>
            <span className="font-[family-name:var(--font-mono)] text-[var(--accent-coral)] text-[var(--text-ipa)]">
              {spokenIPA}
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between items-center text-sm">
            <span className="text-foreground/40">{t("target")}</span>
            <span className="font-[family-name:var(--font-mono)] text-success text-[var(--text-ipa)]">
              {correctIPA}
            </span>
          </div>
        </div>

        <p className="text-sm text-foreground/60 leading-relaxed">{explanation}</p>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<Volume2 className="h-4 w-4" />}
            className="flex-1"
            onClick={handleListen}
            disabled={isPlaying}
          >
            {isPlaying ? t("playing") : t("listen")}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<X className="h-4 w-4" />}
            onClick={onClose}
            className="flex-1"
          >
            {t("close")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
