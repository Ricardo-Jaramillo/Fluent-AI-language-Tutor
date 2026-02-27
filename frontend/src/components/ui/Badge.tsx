"use client";

const variantStyles = {
  default: "bg-foreground/10 text-foreground/70",
  primary: "bg-primary-500/15 text-primary-400",
  success: "bg-[hsl(152,55%,48%)]/15 text-[hsl(152,55%,48%)]",
  warning: "bg-[hsl(38,85%,55%)]/15 text-[hsl(38,85%,55%)]",
  error: "bg-[hsl(0,72%,58%)]/15 text-[hsl(0,72%,58%)]",
  info: "bg-[hsl(210,65%,55%)]/15 text-[hsl(210,65%,55%)]",
  /* Level badges per Section 25 */
  "level-a1": "bg-[hsl(152,55%,48%)]/15 text-[hsl(152,55%,48%)]",
  "level-a2": "bg-[hsl(168,45%,42%)]/15 text-[hsl(168,45%,42%)]",
  "level-b1": "bg-[hsl(210,65%,55%)]/15 text-[hsl(210,65%,55%)]",
  "level-b2": "bg-[hsl(232,50%,55%)]/15 text-[hsl(232,50%,55%)]",
  "level-c1": "bg-[hsl(38,90%,58%)]/15 text-[hsl(38,90%,58%)]",
} as const;

const sizeStyles = {
  sm: "px-2 py-0.5 text-[var(--text-caption)]",
  md: "px-3 py-1 text-[var(--text-caption)]",
} as const;

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
}

export default function Badge({
  variant = "default",
  size = "sm",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
