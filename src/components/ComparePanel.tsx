"use client";

import type { Car } from "@/types/car";
import type { CompareScenario } from "@/types/loan";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import {
  DEFAULT_LOAN_RESULT,
  getLoanTypeLabel,
  sanitizeLoanInputs,
} from "@/lib/calculator";
import {
  formatCurrencyMYR,
  formatPercent,
  formatRate,
} from "@/lib/format";

type ComparePanelProps = {
  selectedCar?: Car | null;
  scenarios?: CompareScenario[] | null;
  canSaveScenario?: boolean;
  onSaveScenario?: () => void;
  onRemoveScenario?: (scenarioId: string) => void;
  onClearScenarios?: () => void;
  onLoadScenario?: (scenario: CompareScenario) => void;
};

type ScenarioMetricProps = {
  label: string;
  value: string;
  delta?: string;
  toneClassName?: string;
  highlightLabel?: string;
  subtle?: boolean;
};

function ScenarioMetric({
  label,
  value,
  delta,
  toneClassName,
  highlightLabel,
  subtle = false,
}: ScenarioMetricProps) {
  return (
    <div
      className={`rounded-xl border border-border/60 bg-background/35 px-3 py-3 ${
        subtle ? "text-muted-foreground" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3 text-sm">
        <span className="text-muted-foreground">{label}</span>
        {highlightLabel ? <Badge variant="accent">{highlightLabel}</Badge> : null}
      </div>
      <p className="mt-2 text-right font-medium text-foreground">{value}</p>
      {delta ? (
        <p className={`mt-1 text-right text-xs ${toneClassName ?? "text-muted-foreground"}`}>
          {delta}
        </p>
      ) : null}
    </div>
  );
}

function toSafeNumber(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function isBestValue(value: number, bestValue: number, enabled: boolean) {
  if (!enabled) {
    return false;
  }

  return Math.abs(toSafeNumber(value) - toSafeNumber(bestValue)) < 0.01;
}

function formatDeltaLabel(
  value: number,
  {
    suffix = "",
    baselineLabel = "baseline",
    sameLabel = `Same as ${baselineLabel}`,
  }: {
    suffix?: string;
    baselineLabel?: string;
    sameLabel?: string;
  } = {},
) {
  const safeValue = toSafeNumber(value);

  if (Math.abs(safeValue) < 0.01) {
    return sameLabel;
  }

  const prefix = safeValue > 0 ? "+" : "-";

  return `${prefix}${formatCurrencyMYR(Math.abs(safeValue))}${suffix} vs ${baselineLabel}`;
}

function getDeltaToneClass(value: number) {
  const safeValue = toSafeNumber(value);

  if (safeValue < -0.01) {
    return "text-emerald-700 dark:text-emerald-300";
  }

  if (safeValue > 0.01) {
    return "text-amber-700 dark:text-amber-300";
  }

  return "text-muted-foreground";
}

export default function ComparePanel({
  selectedCar,
  scenarios,
  canSaveScenario = false,
  onSaveScenario,
  onRemoveScenario,
  onClearScenarios,
  onLoadScenario,
}: ComparePanelProps) {
  const safeScenarios = Array.isArray(scenarios) ? scenarios : [];
  const normalizedScenarios = safeScenarios.map((scenario, index) => {
    const safeInputs = sanitizeLoanInputs(scenario.inputs);
    const safeResult = {
      ...DEFAULT_LOAN_RESULT,
      ...scenario.result,
    };
    const downPaymentRatio =
      safeInputs.price > 0 ? safeInputs.downPayment / safeInputs.price : 0;

    return {
      ...scenario,
      safeInputs,
      safeResult,
      downPaymentRatio,
      originalIndex: index,
    };
  });
  const sortedScenarios = normalizedScenarios
    .slice()
    .sort((a, b) => {
      const diff =
        toSafeNumber(a.safeResult.monthlyPayment) -
        toSafeNumber(b.safeResult.monthlyPayment);
      if (Math.abs(diff) < 0.01) {
        return a.originalIndex - b.originalIndex;
      }
      return diff;
    });
  const hasScenarios = sortedScenarios.length > 0;
  const baselineScenario = sortedScenarios[0] ?? null;
  const comparisonReady = sortedScenarios.length > 1;
  const bestMonthlyPayment = comparisonReady
    ? toSafeNumber(baselineScenario?.safeResult.monthlyPayment)
    : Number.POSITIVE_INFINITY;
  const bestTotalRepayment = comparisonReady
    ? Math.min(
        ...sortedScenarios.map((scenario) =>
          toSafeNumber(scenario.safeResult.totalRepayment),
        ),
      )
    : Number.POSITIVE_INFINITY;
  const bestTotalInterest = comparisonReady
    ? Math.min(
        ...sortedScenarios.map((scenario) =>
          toSafeNumber(scenario.safeResult.totalInterest),
        ),
      )
    : Number.POSITIVE_INFINITY;
  const baselineMonthly = toSafeNumber(
    baselineScenario?.safeResult.monthlyPayment,
  );
  const baselineRepayment = toSafeNumber(
    baselineScenario?.safeResult.totalRepayment,
  );

  if (!selectedCar) {
    return (
      <Card className="p-7 sm:p-8">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
          Compare Scenarios
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-foreground">
          Select a car to start comparing financing setups
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          Once a car is selected, you can save up to three loan scenarios and
          compare monthly payments, total repayment, and affordability side by
          side.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border/70 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Compare Scenarios
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-foreground">
              Saved financing setups for {selectedCar.brand} {selectedCar.model}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Compare different financing setups to find the most suitable
              option for this car. Save the live calculator state to compare
              down payment, tenure, and loan type combinations side by side.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={onSaveScenario}
              disabled={!canSaveScenario}
            >
              Save scenario
            </Button>
            {hasScenarios ? (
              <Button variant="secondary" onClick={onClearScenarios}>
                Clear all
              </Button>
            ) : null}
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {canSaveScenario
            ? `You can save ${3 - normalizedScenarios.length} more scenario${
                3 - normalizedScenarios.length === 1 ? "" : "s"
              } for this car.`
            : "Maximum 3 scenarios reached for this car. Remove one to save another."}
        </p>
      </div>

      {!hasScenarios ? (
        <div className="px-5 py-12 text-center sm:px-6">
          <p className="text-sm font-medium text-foreground">
            No saved scenarios yet
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Tune the current inputs, then save the setup when you want to
            compare it against another option.
          </p>
        </div>
      ) : (
        <div className="px-5 py-5 sm:px-6">
          <div className="mb-4 rounded-2xl border border-border/70 bg-surface/60 px-4 py-3 text-sm text-muted-foreground">
            {comparisonReady && baselineScenario ? (
              <>
                <span className="text-foreground">Recommended:</span>{" "}
                <span className="font-medium text-foreground">
                  {baselineScenario.label}
                </span>{" "}
                · Lowest monthly payment among saved scenarios.
              </>
            ) : (
              "Save at least two scenarios to see a recommendation."
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sortedScenarios.map((scenario, index) => {
              const safeInputs = scenario.safeInputs;
              const safeResult = scenario.safeResult;
              const baselineLabel = baselineScenario?.label ?? "baseline";
              const monthlyDelta =
                index > 0 && baselineScenario
                  ? toSafeNumber(safeResult.monthlyPayment) -
                    toSafeNumber(baselineScenario.safeResult.monthlyPayment)
                  : 0;
              const totalRepaymentDelta =
                index > 0 && baselineScenario
                  ? toSafeNumber(safeResult.totalRepayment) -
                    toSafeNumber(baselineScenario.safeResult.totalRepayment)
                  : 0;
              const monthlyPercentDelta =
                index > 0 && baselineMonthly > 0
                  ? monthlyDelta / baselineMonthly
                  : 0;
              const totalRepaymentPercentDelta =
                index > 0 && baselineRepayment > 0
                  ? totalRepaymentDelta / baselineRepayment
                  : 0;
              const isBestMonthly = isBestValue(
                safeResult.monthlyPayment,
                bestMonthlyPayment,
                comparisonReady,
              );
              const isBestRepayment = isBestValue(
                safeResult.totalRepayment,
                bestTotalRepayment,
                comparisonReady,
              );
              const isBestInterest = isBestValue(
                safeResult.totalInterest,
                bestTotalInterest,
                comparisonReady,
              );
              const monthlyDeltaLabel =
                index === 0
                  ? "Baseline scenario for the comparison."
                  : `${formatDeltaLabel(monthlyDelta, {
                      suffix: "/month",
                      baselineLabel,
                    })}${
                      Math.abs(monthlyPercentDelta) > 0.0005
                        ? ` (${formatPercent(monthlyPercentDelta, {
                            fromFraction: true,
                            maximumFractionDigits: 1,
                          })})`
                        : ""
                    }`;
              const totalRepaymentDeltaLabel =
                index > 0
                  ? `${formatDeltaLabel(totalRepaymentDelta, {
                      baselineLabel,
                      sameLabel: `Same total cost as ${baselineLabel}`,
                    })}${
                      Math.abs(totalRepaymentPercentDelta) > 0.0005
                        ? ` (${formatPercent(totalRepaymentPercentDelta, {
                            fromFraction: true,
                            maximumFractionDigits: 1,
                          })})`
                        : ""
                    }`
                  : undefined;

              return (
                <div
                  key={scenario.id}
                  className="flex h-full flex-col rounded-2xl border border-border/70 bg-surface/70 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold tracking-[-0.02em] text-foreground">
                          {scenario.label}
                        </p>
                        {index === 0 ? (
                          <Badge variant="accent">Lowest monthly</Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedCar.brand} {selectedCar.model} {selectedCar.variant}
                      </p>
                    </div>
                    <Badge variant="accent">
                      {getLoanTypeLabel(safeInputs.loanType)}
                    </Badge>
                  </div>

                  <div className="mt-5 rounded-2xl border border-border/70 bg-muted/45 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-muted-foreground">
                        Monthly instalment
                      </p>
                    </div>
                    <p className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground">
                      {formatCurrencyMYR(safeResult.monthlyPayment)}
                    </p>
                    <p
                      className={`mt-2 text-sm ${
                        index === 0
                          ? "text-muted-foreground"
                          : getDeltaToneClass(monthlyDelta)
                      }`}
                    >
                      {monthlyDeltaLabel}
                    </p>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <ScenarioMetric
                      label="Down payment"
                      value={`${formatCurrencyMYR(
                        safeInputs.downPayment,
                      )} (${formatPercent(scenario.downPaymentRatio, {
                        fromFraction: true,
                        maximumFractionDigits: 0,
                      })})`}
                    />
                    <ScenarioMetric
                      label="Annual rate"
                      value={formatRate(safeInputs.annualRate)}
                    />
                    <ScenarioMetric
                      label="Tenure"
                      value={`${safeInputs.tenureYears} year${
                        safeInputs.tenureYears === 1 ? "" : "s"
                      }`}
                    />
                    <ScenarioMetric
                      label="Total repayment"
                      value={formatCurrencyMYR(safeResult.totalRepayment)}
                      delta={index > 0 ? totalRepaymentDeltaLabel : undefined}
                      toneClassName={
                        index > 0
                          ? getDeltaToneClass(totalRepaymentDelta)
                          : undefined
                      }
                      subtle={!isBestRepayment}
                    />
                    <ScenarioMetric
                      label={
                        safeInputs.loanType === "islamic"
                          ? "Total profit"
                          : "Total interest"
                      }
                      value={formatCurrencyMYR(safeResult.totalInterest)}
                      subtle={!isBestInterest}
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-background/50 p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Affordability
                      </p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {safeResult.affordabilityStatus === "neutral"
                          ? "Add monthly income to evaluate affordability."
                          : safeResult.affordabilityLabel}
                      </p>
                    </div>
                    <Badge
                      variant={
                        safeResult.affordabilityStatus === "neutral"
                          ? "neutral"
                          : safeResult.affordabilityStatus
                      }
                    >
                      {safeResult.affordabilityStatus === "neutral"
                        ? "Income not set"
                        : safeResult.affordabilityLabel}
                    </Badge>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {onLoadScenario ? (
                      <Button
                        className="flex-1"
                        onClick={() => onLoadScenario(scenario)}
                      >
                        Apply scenario
                      </Button>
                    ) : null}
                    <Button
                      variant="secondary"
                      className="flex-1"
                      onClick={() => onRemoveScenario?.(scenario.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
