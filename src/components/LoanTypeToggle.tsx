"use client";

import { cn } from "@/lib/utils";
import type { LoanType } from "@/types/loan";

type LoanTypeToggleProps = {
  value: LoanType;
  onChange: (loanType: LoanType) => void;
  disabled?: boolean;
  className?: string;
};

const LOAN_TYPE_OPTIONS: Array<{ value: LoanType; label: string }> = [
  { value: "hire-purchase", label: "Hire Purchase" },
  { value: "islamic", label: "Islamic Financing" },
];

export default function LoanTypeToggle({
  className,
  disabled = false,
  onChange,
  value,
}: LoanTypeToggleProps) {
  const activeValue = value === "islamic" ? "islamic" : "hire-purchase";

  return (
    <div
      className={cn(
        "inline-flex w-full rounded-2xl border border-border/70 bg-muted/55 p-1 transition-colors duration-200",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      {LOAN_TYPE_OPTIONS.map((option) => {
        const isActive = option.value === activeValue;

        return (
          <button
            key={option.value}
            type="button"
            className={cn(
              "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold tracking-[-0.02em] transition-all duration-200",
              isActive
                ? "bg-accent/15 text-foreground shadow-[0_6px_18px_-10px_rgba(99,102,241,0.8)] border border-accent/40"
                : "text-muted-foreground hover:text-foreground border border-transparent",
            )}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
