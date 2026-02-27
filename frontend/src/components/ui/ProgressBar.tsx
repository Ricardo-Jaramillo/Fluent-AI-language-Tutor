"use client";

import { motion } from "framer-motion";

const colorStyles = {
  primary: "bg-primary-400",
  accent: "bg-accent-400",
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
  thin?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  color = "primary",
  showLabel = false,
  thin = false,
  className = "",
}: ProgressBarProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);
  const height = thin ? "h-1" : "h-2";

  return (
    <div className={`flex items-center gap-3 ${className}`} role="progressbar" aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100}>
      <div className={`flex-1 ${height} rounded-full bg-foreground/8 overflow-hidden`}>
        <motion.div
          className={`h-full rounded-full ${colorStyles[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-foreground/50 tabular-nums w-10 text-right">
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
}
