"use client";

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
  xl: "h-12 w-12 border-[3px]",
} as const;

interface SpinnerProps {
  size?: keyof typeof sizeMap;
  className?: string;
}

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`${sizeMap[size]} animate-spin rounded-full border-primary-500/25 border-t-primary-400 ${className}`}
    />
  );
}
