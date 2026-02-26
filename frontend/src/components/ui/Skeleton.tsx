"use client";

interface SkeletonProps {
  variant?: "text" | "circle" | "rect";
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
  const baseStyles =
    "animate-pulse bg-foreground/10 rounded-lg";

  if (variant === "circle") {
    return (
      <div
        className={`${baseStyles} rounded-full ${className}`}
        style={{ width: width || "40px", height: height || "40px" }}
      />
    );
  }

  if (variant === "rect") {
    return (
      <div
        className={`${baseStyles} ${className}`}
        style={{ width: width || "100%", height: height || "100px" }}
      />
    );
  }

  return (
    <div
      className={`${baseStyles} h-4 ${className}`}
      style={{ width: width || "100%" }}
    />
  );
}
