"use client";

import { motion } from "framer-motion";
import Spinner from "./Spinner";

const variantStyles = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-500 hover:-translate-y-px hover:shadow-glow-primary active:bg-primary-700 active:translate-y-0 active:scale-[0.98]",
  secondary:
    "bg-transparent border border-border text-foreground/65 hover:bg-surface hover:border-border-strong hover:text-foreground",
  ghost:
    "text-foreground/45 hover:text-foreground/65 hover:underline underline-offset-4",
  danger:
    "bg-error text-white hover:brightness-110",
  outline:
    "border border-primary-600 text-primary-400 hover:bg-primary-600/10",
} as const;

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
} as const;

interface ButtonProps {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconRight,
  children,
  disabled,
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-semibold rounded-[var(--radius-md)] transition-all duration-[var(--duration-normal)] focus-visible:outline-2 focus-visible:outline-primary-400 focus-visible:outline-offset-2 disabled:opacity-40 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </motion.button>
  );
}
