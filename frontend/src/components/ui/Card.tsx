"use client";

const variantStyles = {
  elevated: "bg-surface-elevated border border-border shadow-md",
  outlined: "border border-border bg-transparent",
  glass: "glass",
} as const;

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantStyles;
  padding?: keyof typeof paddingStyles;
}

export default function Card({
  variant = "elevated",
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
