"use client";

import { forwardRef } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = "", id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={selectId}
            className="text-[var(--text-body-sm)] font-medium text-foreground/65"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none rounded-[var(--radius-md)] border bg-surface px-4 py-2.5 pr-10 text-foreground transition-all duration-[var(--duration-normal)] focus:outline-none focus:ring-2 focus:border-primary-500 ${
              error
                ? "border-error/60 focus:ring-error/30 focus:border-error"
                : "border-border hover:border-border-strong focus:ring-primary-500/30"
            } ${className}`}
            aria-invalid={error ? "true" : undefined}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40 pointer-events-none" />
        </div>
        {error && (
          <p className="flex items-center gap-1.5 text-sm text-error">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
