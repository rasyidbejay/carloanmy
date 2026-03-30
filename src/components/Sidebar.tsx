"use client";

import type { ReactNode } from "react";
import { ArrowLeftRight, BarChart3, Calculator, Search, Wallet, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

type ViewKey = "affordability" | "discover" | "calculator" | "compare" | "breakdown";

type SidebarProps = {
  active: ViewKey;
  onChange: (view: ViewKey) => void;
  open?: boolean;
  onClose?: () => void;
};

type NavItem = {
  key: ViewKey;
  label: string;
  icon: ReactNode;
};

const navItems: NavItem[] = [
  { key: "affordability", label: "Affordability", icon: <Wallet className="h-5 w-5" /> },
  { key: "discover", label: "Browse Cars", icon: <Search className="h-5 w-5" /> },
  { key: "calculator", label: "Calculator", icon: <Calculator className="h-5 w-5" /> },
  { key: "compare", label: "Compare", icon: <ArrowLeftRight className="h-5 w-5" /> },
  { key: "breakdown", label: "Breakdown", icon: <BarChart3 className="h-5 w-5" /> },
];

export default function Sidebar({ active, onChange, open, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 border-r border-border/50 bg-surface/85 px-4 py-5 shadow-lg shadow-black/10 lg:flex lg:flex-col">
        <div className="mb-4 rounded-2xl border border-border/50 bg-muted/30 px-3 py-3">
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-[-0.01em] text-foreground">CarLoan.my</p>
            <p className="text-xs text-muted-foreground">Affordability Suite</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = item.key === active;
            return (
              <button
                key={item.key}
                type="button"
                className={cn(
                  "flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:border-border/60 hover:text-foreground",
                  isActive &&
                    "border-accent/40 bg-accent/10 text-foreground shadow-sm shadow-accent/10",
                )}
                onClick={() => onChange(item.key)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-4">
          <div className="rounded-2xl border border-border/60 bg-muted/25 px-3 py-2.5">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      <MobileSidebar active={active} onChange={onChange} open={open} onClose={onClose} />
    </>
  );
}

type MobileSidebarProps = {
  active: ViewKey;
  onChange: (view: ViewKey) => void;
  open?: boolean;
  onClose?: () => void;
};

function MobileSidebar({ active, onChange, open = false, onClose }: MobileSidebarProps) {
  return (
    <div
      className={cn(
        "lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
        "fixed inset-0 z-40",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute inset-y-0 left-0 z-50 flex w-[260px] max-w-[82vw] flex-col border-r border-border/50 bg-surface/95 px-4 py-5 shadow-2xl shadow-black/30 transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-3 rounded-2xl border border-border/50 bg-muted/30 px-3 py-3">
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-[-0.01em] text-foreground">CarLoan.my</p>
            <p className="text-xs text-muted-foreground">Affordability Suite</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-border/60 bg-muted/40 p-2 text-muted-foreground hover:text-foreground"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = item.key === active;
            return (
              <button
                key={item.key}
                type="button"
                className={cn(
                  "flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors duration-150 hover:border-border/60 hover:text-foreground",
                  isActive &&
                    "border-accent/40 bg-accent/10 text-foreground shadow-sm shadow-accent/10",
                )}
                onClick={() => {
                  onChange(item.key);
                  onClose?.();
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-4">
          <div className="rounded-2xl border border-border/60 bg-muted/25 px-3 py-2.5">
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </div>
  );
}
