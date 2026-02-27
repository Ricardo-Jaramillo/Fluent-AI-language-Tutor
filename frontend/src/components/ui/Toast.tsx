"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import { useToastStore } from "@/stores/toast";

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

const borderColorMap = {
  success: "border-l-[var(--success)]",
  error: "border-l-[var(--accent-coral)]",
  warning: "border-l-[var(--accent-warm)]",
  info: "border-l-[var(--accent-sky)]",
} as const;

const iconColorMap = {
  success: "text-[hsl(152,55%,48%)]",
  error: "text-[hsl(12,80%,62%)]",
  warning: "text-[hsl(38,90%,58%)]",
  info: "text-[hsl(210,70%,60%)]",
} as const;

const progressColorMap = {
  success: "bg-[hsl(152,55%,48%)]",
  error: "bg-[hsl(12,80%,62%)]",
  warning: "bg-[hsl(38,90%,58%)]",
  info: "bg-[hsl(210,70%,60%)]",
} as const;

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  const visibleToasts = toasts.slice(-3);

  return (
    <>
      {/* Desktop: top-right */}
      <div
        className="fixed top-6 right-6 hidden md:flex flex-col gap-2 w-[360px]"
        style={{ zIndex: "var(--z-toast)" }}
      >
        <AnimatePresence mode="popLayout">
          {visibleToasts.map((toast, i) => {
            const Icon = iconMap[toast.type];
            const isCompressed = i < visibleToasts.length - 1 && visibleToasts.length >= 3;
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, x: 80, scale: 0.95 }}
                animate={{
                  opacity: isCompressed ? 0.8 : 1,
                  x: 0,
                  scale: isCompressed ? 0.95 : 1,
                }}
                exit={{ opacity: 0, x: 80, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={`relative overflow-hidden flex items-start gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-border border-l-4 ${borderColorMap[toast.type]} bg-surface-elevated shadow-md`}
              >
                <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconColorMap[toast.type]}`} />
                <p className="flex-1 text-sm text-foreground">
                  {toast.message}
                </p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 text-foreground/30 hover:text-foreground/60 transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
                {toast.type !== "error" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5">
                    <div className={`h-full ${progressColorMap[toast.type]} toast-progress`} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Mobile: top-center */}
      <div
        className="fixed top-4 left-4 right-4 flex flex-col gap-2 md:hidden"
        style={{ zIndex: "var(--z-toast)" }}
      >
        <AnimatePresence mode="popLayout">
          {visibleToasts.map((toast) => {
            const Icon = iconMap[toast.type];
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={`relative overflow-hidden flex items-start gap-3 px-4 py-3 rounded-[var(--radius-md)] border border-border border-l-4 ${borderColorMap[toast.type]} bg-surface-elevated shadow-md`}
              >
                <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconColorMap[toast.type]}`} />
                <p className="flex-1 text-sm text-foreground">
                  {toast.message}
                </p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 text-foreground/30 hover:text-foreground/60 transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
                {toast.type !== "error" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5">
                    <div className={`h-full ${progressColorMap[toast.type]} toast-progress`} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
}
