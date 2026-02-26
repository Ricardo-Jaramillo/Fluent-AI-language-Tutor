"use client";

import { motion } from "framer-motion";

const colorStyles = {
  primary: "bg-primary-500",
  accent: "bg-accent-500",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
  info: "bg-info",
} as const;

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: keyof typeof colorStyles;
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  color = "primary",
  showLabel = false,
  className = "",
}: ProgressBarProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-2 rounded-full bg-foreground/10 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorStyles[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-foreground/60 tabular-nums w-10 text-right">
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
}
