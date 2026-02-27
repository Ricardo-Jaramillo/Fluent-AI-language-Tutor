"use client";

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
} as const;

interface AvatarProps {
  name?: string;
  src?: string;
  size?: keyof typeof sizeStyles;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({
  name,
  src,
  size = "md",
  className = "",
}: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name || "Avatar"}
        className={`rounded-full object-cover ring-2 ring-border ${sizeStyles[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-primary-600/15 text-primary-400 font-medium flex items-center justify-center ring-2 ring-border ${sizeStyles[size]} ${className}`}
      aria-label={name || "User avatar"}
    >
      {name ? getInitials(name) : "?"}
    </div>
  );
}
