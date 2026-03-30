"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="secondary"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "group relative h-11 w-11 rounded-full border-border/70 bg-surface/80 p-0 shadow-sm backdrop-blur-sm hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-surface",
        className,
      )}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <span className="relative h-5 w-5">
        <Sun
          className={cn(
            "absolute inset-0 m-auto h-4 w-4 transition-all duration-300",
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0",
          )}
        />
        <Moon
          className={cn(
            "absolute inset-0 m-auto h-4 w-4 transition-all duration-300",
            isDark
              ? "-rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100",
          )}
        />
      </span>
    </Button>
  );
}
