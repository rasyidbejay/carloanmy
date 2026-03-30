import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background shadow-sm shadow-black/10 hover:bg-foreground/92",
  secondary:
    "border border-border/70 bg-surface text-foreground shadow-sm shadow-black/5 hover:bg-muted/70",
};

export default function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium tracking-[-0.02em] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
