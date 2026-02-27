"use client";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeStyles = {
  sm: "max-w-xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-7xl",
} as const;

export default function PageContainer({
  children,
  className = "",
  size = "lg",
}: PageContainerProps) {
  return (
    <div className={`mx-auto px-4 sm:px-6 py-6 sm:py-12 ${sizeStyles[size]} ${className}`}>
      {children}
    </div>
  );
}
