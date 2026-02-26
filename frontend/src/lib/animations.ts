import type { Variants, Transition } from "framer-motion";

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export const pageTransitionConfig: Transition = {
  duration: 0.25,
  ease: "easeOut",
};

export const messageBubble: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const listItem: Variants = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
};

export const pressScale = {
  whileTap: { scale: 0.97 },
  transition: { type: "spring" as const, stiffness: 400, damping: 17 },
};

export const recordingPulse: Variants = {
  animate: {
    scale: [1, 1.15, 1],
    opacity: [0.6, 0, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const scrollReveal: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
};

export const scrollRevealConfig: Transition = {
  duration: 0.5,
  ease: "easeOut",
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const slideDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
};

export const slideLeft: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const slideRight: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};
