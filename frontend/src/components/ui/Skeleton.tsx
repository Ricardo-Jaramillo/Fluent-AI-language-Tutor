"use client";

interface SkeletonProps {
  variant?: "text" | "circle" | "rect" | "bubble";
  width?: string;
  height?: string;
  className?: string;
}

export default function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
}: SkeletonProps) {
  const baseStyles = "skeleton-shimmer rounded-[var(--radius-md)]";

  if (variant === "circle") {
    return (
      <div
        className={`${baseStyles} rounded-full ${className}`}
        style={{ width: width || "40px", height: height || "40px" }}
        aria-hidden="true"
      />
    );
  }

  if (variant === "rect") {
    return (
      <div
        className={`${baseStyles} ${className}`}
        style={{ width: width || "100%", height: height || "100px" }}
        aria-hidden="true"
      />
    );
  }

  if (variant === "bubble") {
    return (
      <div
        className={`${baseStyles} rounded-2xl rounded-bl-md ${className}`}
        style={{ width: width || "60%", height: height || "60px" }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={`${baseStyles} h-4 ${className}`}
      style={{ width: width || "100%" }}
      aria-hidden="true"
    />
  );
}
