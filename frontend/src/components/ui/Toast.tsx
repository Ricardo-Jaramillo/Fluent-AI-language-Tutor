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

const colorMap = {
  success: "border-success/30 bg-success/10 text-success",
  error: "border-error/30 bg-error/10 text-error",
  warning: "border-warning/30 bg-warning/10 text-warning",
  info: "border-info/30 bg-info/10 text-info",
} as const;

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      className="fixed bottom-4 right-4 flex flex-col gap-2 w-80"
      style={{ zIndex: "var(--z-toast)" }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const Icon = iconMap[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg ${colorMap[toast.type]}`}
            >
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="flex-1 text-sm font-medium text-foreground">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-foreground/40 hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
