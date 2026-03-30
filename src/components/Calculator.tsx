import Card from "@/components/ui/Card";

export type CalculatorProps = {
  compact?: boolean;
  heroTag?: string;
  title?: string;
  description?: string;
  showCorrectionForm?: boolean;
  showThemeToggle?: boolean;
  allowedCarIds?: string[];
  featuredCarIds?: string[];
  initialCarId?: string;
  searchPlaceholder?: string;
};

export function Calculator({
  allowedCarIds,
  compact = false,
  description,
  featuredCarIds,
  heroTag = "Calculator Placeholder",
  initialCarId,
  searchPlaceholder,
  showCorrectionForm = false,
  showThemeToggle = true,
  title = "Loan inputs arrive next",
}: CalculatorProps) {
  const curatedCount = allowedCarIds?.length ?? 0;
  const featuredCount = featuredCarIds?.length ?? 0;

  return (
    <Card className={compact ? "p-6" : "p-7 sm:p-10"}>
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
            {heroTag}
          </p>
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-foreground">
            {title}
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            {description ??
              "The car discovery layer is now ready. In the next phase, this area will become the working calculator surface for down payment, rate, tenure, and repayment outputs."}
          </p>
        </div>

        <div className={compact ? "grid gap-3" : "grid gap-3 sm:grid-cols-3"}>
          <div className="rounded-xl border border-border/70 bg-muted/55 p-4">
            <p className="text-sm font-medium tracking-[-0.01em] text-foreground">
              Search Scope
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchPlaceholder
                ? `Search prompt ready: ${searchPlaceholder}`
                : "Model discovery is ready. Calculator inputs will be added in the next phase."}
            </p>
          </div>
          <div className="rounded-xl border border-border/70 bg-muted/55 p-4">
            <p className="text-sm font-medium tracking-[-0.01em] text-foreground">
              Curated Cars
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {curatedCount > 0
                ? `${curatedCount} allowed car IDs are queued for this calculator view.`
                : "Rate, tenure, and financing assumptions are still pending."}
            </p>
          </div>
          {!compact ? (
            <div className="rounded-xl border border-border/70 bg-muted/55 p-4">
              <p className="text-sm font-medium tracking-[-0.01em] text-foreground">
                Placeholder State
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {featuredCount > 0
                  ? `${featuredCount} featured car IDs are ready for the next calculator phase.`
                  : "Monthly instalment summaries will appear here after Phase 4."}
              </p>
            </div>
          ) : null}
        </div>

        {!compact ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {initialCarId
              ? `Initial car focus is prepared for "${initialCarId}".`
              : "No starting car is pinned yet."}{" "}
            {showCorrectionForm
              ? "Correction flows stay enabled for this view."
              : "Correction flows remain hidden for now."}{" "}
            {showThemeToggle
              ? "Theme support stays available."
              : "Theme controls are intentionally hidden in this surface."}
          </p>
        ) : null}
      </div>
    </Card>
  );
}

export default Calculator;
