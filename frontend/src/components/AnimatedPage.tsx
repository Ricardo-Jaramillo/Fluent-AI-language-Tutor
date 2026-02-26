"use client";

import { motion } from "framer-motion";
import { pageTransition, pageTransitionConfig } from "@/lib/animations";

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedPage({ children, className = "" }: AnimatedPageProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransitionConfig}
      className={className}
    >
      {children}
    </motion.div>
  );
}
