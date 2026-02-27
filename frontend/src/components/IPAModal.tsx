"use client";

import { Modal, Badge, Button } from "@/components/ui";
import { Volume2, X } from "lucide-react";

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
  const config = severityConfig[severity];

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
            <span className="text-foreground/40">You said</span>
            <span className="font-[family-name:var(--font-mono)] text-[var(--accent-coral)] text-[var(--text-ipa)]">
              {spokenIPA}
            </span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between items-center text-sm">
            <span className="text-foreground/40">Target</span>
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
          >
            Listen
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<X className="h-4 w-4" />}
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
