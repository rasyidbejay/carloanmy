import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-border/60 bg-surface/85 px-4 py-3 text-sm text-foreground shadow-sm shadow-black/5 outline-none transition-all duration-200 placeholder:text-muted-foreground/80 focus:border-accent/60 focus:ring-4 focus:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
