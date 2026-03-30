import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "neutral"
  | "accent"
  | "comfortable"
  | "manageable"
  | "stretch"
  | "risky";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const badgeVariants: Record<BadgeVariant, string> = {
  neutral: "border-border/70 bg-muted text-muted-foreground",
  accent: "border-accent/15 bg-accent/10 text-accent",
  comfortable:
    "border-emerald-500/15 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  manageable: "border-accent/15 bg-accent/10 text-accent",
  stretch:
    "border-amber-500/15 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  risky: "border-rose-500/15 bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export default function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.02em]",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
