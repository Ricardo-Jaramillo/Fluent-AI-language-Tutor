"use client";

import { motion } from "framer-motion";
import Spinner from "./Spinner";

const variantStyles = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-500 shadow-md hover:shadow-glow-primary",
  secondary:
    "bg-surface-elevated text-foreground border border-border hover:border-border-strong",
  ghost: "text-foreground/70 hover:text-foreground hover:bg-surface-elevated",
  danger: "bg-error text-white hover:bg-red-500",
  outline:
    "border border-primary-600 text-primary-400 hover:bg-primary-600/10",
} as const;

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-lg gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2",
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
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
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
