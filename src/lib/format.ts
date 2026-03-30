const currencyMYRFormatter = new Intl.NumberFormat("ms-MY", {
  style: "currency",
  currency: "MYR",
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("ms-MY", {
  style: "currency",
  currency: "MYR",
  notation: "compact",
  maximumFractionDigits: 1,
});

type FormatPercentOptions = {
  fromFraction?: boolean;
  maximumFractionDigits?: number;
};

function toFiniteNumber(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function formatCurrencyMYR(value?: number | null) {
  return currencyMYRFormatter.format(toFiniteNumber(value));
}

export function formatCurrency(value?: number | null) {
  return formatCurrencyMYR(value);
}

export function formatCompactCurrency(value?: number | null) {
  return compactCurrencyFormatter.format(toFiniteNumber(value));
}

export function formatPercent(
  value?: number | null,
  { fromFraction = false, maximumFractionDigits = 2 }: FormatPercentOptions = {},
) {
  const normalizedValue = fromFraction
    ? toFiniteNumber(value) * 100
    : toFiniteNumber(value);

  return `${normalizedValue.toFixed(maximumFractionDigits)}%`;
}

export function formatPercentage(value?: number | null) {
  return formatPercent(value);
}

export function formatRate(value?: number | null) {
  return `${formatPercent(value)} p.a.`;
}
