import type { Variants, Transition } from "framer-motion";

/* === SPRING CONFIGS (Section 6) === */

/** Default spring for most interactions */
export const spring = { type: "spring" as const, stiffness: 300, damping: 24 };

/** Snappy spring for buttons, toggles */
export const snappy = { type: "spring" as const, stiffness: 400, damping: 20 };

/** Gentle spring for page transitions, modals */
export const gentle = { type: "spring" as const, stiffness: 200, damping: 28 };

/** Bouncy spring for celebrations, score reveals */
export const bouncy = { type: "spring" as const, stiffness: 350, damping: 15 };

/* === PAGE TRANSITIONS === */

export const pageTransition: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const pageTransitionConfig: Transition = gentle;

/* === MESSAGE BUBBLES === */

export const messageBubble: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export const messageBubbleConfig: Transition = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1], // ease-out-expo
};

/* === STAGGER CONTAINERS === */

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/* === LIST ITEMS === */

export const listItem: Variants = {
  initial: { opacity: 0, x: -12 },
  animate: { opacity: 1, x: 0 },
};

/* === PRESS FEEDBACK === */

export const pressScale = {
  whileTap: { scale: 0.97 },
  transition: snappy,
};

/* === RECORDING PULSE RINGS === */

export const recordingPulse: Variants = {
  animate: {
    scale: [1, 2.5],
    opacity: [0.4, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeOut",
    },
  },
};

/* === SCROLL REVEAL === */

export const scrollReveal: Variants = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
};

export const scrollRevealConfig: Transition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
};

/* === BASIC VARIANTS === */

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

/* === MODAL / IPA MODAL === */

export const modalOverlay: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.85, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.85, y: 10 },
};

/* === CARD HOVER === */

export const cardHover = {
  whileHover: { y: -2, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

/* === TOAST === */

export const toastEnter: Variants = {
  initial: { opacity: 0, x: 80, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 80, scale: 0.95 },
};

/* === CORRECTION SLIDE-IN === */

export const correctionSlideIn: Variants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
};

/* === CHIP PRESS === */

export const chipPress = {
  whileTap: { scale: 0.95 },
  transition: snappy,
};

/* === SCORE COUNT-UP === */

export const scoreReveal: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
};

export const scoreRevealConfig: Transition = bouncy;
