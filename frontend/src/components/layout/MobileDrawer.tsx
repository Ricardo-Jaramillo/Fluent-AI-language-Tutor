"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function MobileDrawer({
  isOpen,
  onClose,
  side = "right",
  title,
  children,
  className = "",
}: MobileDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const slideFrom = side === "right" ? { x: "100%" } : { x: "-100%" };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
            style={{ zIndex: "var(--z-overlay)" }}
            onClick={onClose}
          />
          <motion.div
            initial={slideFrom}
            animate={{ x: 0 }}
            exit={slideFrom}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed top-0 ${side}-0 bottom-0 w-80 max-w-[85vw] bg-surface-elevated border-${side === "right" ? "l" : "r"} border-border overflow-y-auto lg:hidden ${className}`}
            style={{ zIndex: "var(--z-modal)" }}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              {title && <h3 className="font-semibold">{title}</h3>}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors ml-auto"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
