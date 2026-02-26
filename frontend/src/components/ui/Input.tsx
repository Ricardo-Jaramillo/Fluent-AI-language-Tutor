"use client";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground/80"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-lg border bg-surface px-4 py-2.5 text-foreground placeholder:text-foreground/30 transition-all duration-[var(--transition-base)] focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 ${
              leftIcon ? "pl-10" : ""
            } ${
              error
                ? "border-error focus:ring-error/50 focus:border-error"
                : "border-border hover:border-border-strong"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-foreground/40">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
