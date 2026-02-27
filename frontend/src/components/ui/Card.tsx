"use client";

import { motion } from "framer-motion";

const variantStyles = {
  elevated: "bg-surface-elevated border border-border shadow-md",
  outlined: "border border-border bg-transparent",
  glass: "glass",
} as const;

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

interface CardProps {
  variant?: keyof typeof variantStyles;
  padding?: keyof typeof paddingStyles;
  hoverable?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function Card({
  variant = "elevated",
  padding = "md",
  hoverable = false,
  className = "",
  children,
}: CardProps) {
  if (hoverable) {
    return (
      <motion.div
        whileHover={{ y: -2, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
        className={`rounded-[var(--radius-lg)] transition-shadow duration-[var(--duration-normal)] hover:shadow-lg hover:border-border-strong ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={`rounded-[var(--radius-lg)] ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
