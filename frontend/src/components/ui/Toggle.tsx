"use client";

import { motion } from "framer-motion";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export default function Toggle({
  checked,
  onChange,
  label,
  className = "",
}: ToggleProps) {
  return (
    <label className={`inline-flex items-center gap-3 cursor-pointer ${className}`}>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-[var(--transition-base)] ${
          checked ? "bg-primary-600" : "bg-foreground/20"
        }`}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm mt-0.5 ${
            checked ? "ml-[22px]" : "ml-0.5"
          }`}
        />
      </button>
      {label && <span className="text-sm text-foreground/80">{label}</span>}
    </label>
  );
}
