"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Position = "top" | "bottom" | "left" | "right";

const positionStyles: Record<Position, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const originMap: Record<Position, string> = {
  top: "bottom center",
  bottom: "top center",
  left: "right center",
  right: "left center",
};

interface TooltipProps {
  content: string;
  position?: Position;
  children: React.ReactNode;
  className?: string;
}

export default function Tooltip({
  content,
  position = "top",
  children,
  className = "",
}: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            style={{ transformOrigin: originMap[position] }}
            className={`absolute ${positionStyles[position]} px-3 py-2 text-xs font-medium bg-[var(--bg-overlay)] backdrop-blur-lg border border-border text-foreground/90 rounded-[var(--radius-md)] whitespace-nowrap pointer-events-none shadow-lg max-w-[260px]`}
            role="tooltip"
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
