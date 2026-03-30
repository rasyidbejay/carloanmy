import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-surface/92 shadow-sm shadow-black/5 transition-all duration-300 dark:shadow-black/25",
        className,
      )}
      {...props}
    />
  );
}
