"use client";

import { Modal, Badge, Button } from "@/components/ui";
import { Volume2 } from "lucide-react";

interface IPAModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: string;
  spokenIPA: string;
  correctIPA: string;
  explanation: string;
  severity: "minor" | "moderate" | "severe";
}

const severityVariant = {
  minor: "warning" as const,
  moderate: "warning" as const,
  severe: "error" as const,
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
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={word}>
      <div className="space-y-4">
        <Badge variant={severityVariant[severity]} size="md">
          {severity}
        </Badge>

        <div className="space-y-2 p-3 rounded-lg bg-surface">
          <div className="flex justify-between items-center text-sm">
            <span className="text-foreground/50">You said:</span>
            <span className="font-mono text-error">{spokenIPA}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-foreground/50">Correct:</span>
            <span className="font-mono text-success">{correctIPA}</span>
          </div>
        </div>

        <p className="text-sm text-foreground/70 leading-relaxed">{explanation}</p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Volume2 className="h-4 w-4" />}
            className="flex-1"
          >
            Listen
          </Button>
          <Button variant="secondary" size="sm" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
