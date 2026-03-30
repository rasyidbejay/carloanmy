import type {
  AffordabilityStatus,
  AmortizationRow,
  LoanCalculationInput,
  LoanCalculationResult,
  LoanInputs,
  LoanResult,
  LoanType,
  YearlyRepaymentRow,
} from "@/types/loan";
export { formatCurrencyMYR as formatCurrency, formatPercent } from "@/lib/format";

export const DEFAULT_LOAN_INPUTS: LoanInputs = {
  price: 0,
  downPayment: 0,
  annualRate: 0,
  tenureYears: 7,
  loanType: "hire-purchase",
  monthlyIncome: 0,
};

export const DEFAULT_LOAN_RESULT: LoanResult = {
  loanAmount: 0,
  monthlyPayment: 0,
  totalRepayment: 0,
  totalInterest: 0,
  affordabilityRatio: undefined,
  affordabilityStatus: "neutral",
  affordabilityLabel: "Income not set",
};

function roundCurrency(value: number) {
  return Number((Number.isFinite(value) ? value : 0).toFixed(2));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toFiniteNumber(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeLoanType(value?: LoanType | null): LoanType {
  return value === "islamic" ? "islamic" : "hire-purchase";
}

export function sanitizeLoanInputs(
  inputs?: Partial<LoanInputs> | null,
): LoanInputs {
  const normalizedInputs = inputs ?? DEFAULT_LOAN_INPUTS;
  const price = roundCurrency(Math.max(toFiniteNumber(normalizedInputs.price), 0));
  const downPayment = roundCurrency(
    clamp(toFiniteNumber(normalizedInputs.downPayment), 0, price),
  );
  const annualRate = Number(
    Math.max(toFiniteNumber(normalizedInputs.annualRate), 0).toFixed(2),
  );
  const tenureYears = clamp(
    Math.round(toFiniteNumber(normalizedInputs.tenureYears)),
    1,
    9,
  );
  const monthlyIncome = roundCurrency(
    Math.max(toFiniteNumber(normalizedInputs.monthlyIncome), 0),
  );

  return {
    price,
    downPayment,
    annualRate,
    tenureYears,
    loanType: normalizeLoanType(normalizedInputs.loanType),
    monthlyIncome,
  };
}

export function calculateLoanAmount(price: number, downPayment: number) {
  return roundCurrency(Math.max(price - downPayment, 0));
}

export function calculateTotalInterest(
  loanAmount: number,
  annualRate: number,
  tenureYears: number,
) {
  return roundCurrency(loanAmount * (annualRate / 100) * tenureYears);
}

export function calculateTotalRepayment(
  loanAmount: number,
  totalInterest: number,
) {
  return roundCurrency(loanAmount + totalInterest);
}

export function calculateMonthlyPayment(
  totalRepayment: number,
  tenureYears: number,
) {
  const tenureMonths = Math.max(tenureYears, 0) * 12;

  if (tenureMonths === 0) {
    return 0;
  }

  return roundCurrency(totalRepayment / tenureMonths);
}

export function getAffordabilityLabel(status: AffordabilityStatus) {
  switch (status) {
    case "comfortable":
      return "Comfortable";
    case "manageable":
      return "Manageable";
    case "stretch":
      return "Stretch";
    case "risky":
      return "Risky";
    default:
      return "Income not set";
  }
}

export function getLoanTypeLabel(loanType: LoanType) {
  return loanType === "islamic" ? "Islamic Financing" : "Hire Purchase";
}

export function calculateAffordability(
  monthlyPayment: number,
  monthlyIncome?: number,
) {
  const safeMonthlyPayment = roundCurrency(Math.max(toFiniteNumber(monthlyPayment), 0));
  const safeMonthlyIncome = roundCurrency(Math.max(toFiniteNumber(monthlyIncome), 0));

  if (!safeMonthlyIncome || safeMonthlyIncome <= 0) {
    return {
      affordabilityRatio: undefined,
      affordabilityStatus: "neutral" as const,
      affordabilityLabel: getAffordabilityLabel("neutral"),
    };
  }

  const affordabilityRatio = Number(
    (safeMonthlyPayment / safeMonthlyIncome).toFixed(4),
  );

  let affordabilityStatus: AffordabilityStatus = "risky";

  if (affordabilityRatio <= 0.15) {
    affordabilityStatus = "comfortable";
  } else if (affordabilityRatio <= 0.3) {
    affordabilityStatus = "manageable";
  } else if (affordabilityRatio <= 0.4) {
    affordabilityStatus = "stretch";
  }

  return {
    affordabilityRatio,
    affordabilityStatus,
    affordabilityLabel: getAffordabilityLabel(affordabilityStatus),
  };
}

export function calculateLoanResult(
  inputs?: Partial<LoanInputs> | null,
): LoanResult {
  const sanitizedInputs = sanitizeLoanInputs(inputs);
  const loanAmount = calculateLoanAmount(
    sanitizedInputs.price,
    sanitizedInputs.downPayment,
  );
  const totalInterest = calculateTotalInterest(
    loanAmount,
    sanitizedInputs.annualRate,
    sanitizedInputs.tenureYears,
  );
  const totalRepayment = calculateTotalRepayment(loanAmount, totalInterest);
  const monthlyPayment = calculateMonthlyPayment(
    totalRepayment,
    sanitizedInputs.tenureYears,
  );
  const affordability = calculateAffordability(
    monthlyPayment,
    sanitizedInputs.monthlyIncome,
  );

  return {
    ...DEFAULT_LOAN_RESULT,
    loanAmount: roundCurrency(loanAmount),
    monthlyPayment: roundCurrency(monthlyPayment),
    totalRepayment: roundCurrency(totalRepayment),
    totalInterest: roundCurrency(totalInterest),
    affordabilityRatio: affordability.affordabilityRatio,
    affordabilityStatus: affordability.affordabilityStatus,
    affordabilityLabel: affordability.affordabilityLabel,
  };
}

export function calculateLoanSummary(
  input: LoanCalculationInput,
): LoanCalculationResult {
  return calculateLoanResult(input);
}

export function buildAmortizationSchedule(
  input?: Partial<LoanCalculationInput> | null,
): AmortizationRow[] {
  const sanitizedInputs = sanitizeLoanInputs(input);
  const loanAmount = calculateLoanAmount(
    sanitizedInputs.price,
    sanitizedInputs.downPayment,
  );
  const totalInterest = calculateTotalInterest(
    loanAmount,
    sanitizedInputs.annualRate,
    sanitizedInputs.tenureYears,
  );
  const totalRepayment = calculateTotalRepayment(loanAmount, totalInterest);
  const totalMonths = Math.max(sanitizedInputs.tenureYears, 0) * 12;

  if (loanAmount <= 0 || totalRepayment <= 0 || totalMonths <= 0) {
    return [];
  }

  const payment = calculateMonthlyPayment(
    totalRepayment,
    sanitizedInputs.tenureYears,
  );
  const principalPaid = roundCurrency(loanAmount / totalMonths);
  const interestPaid = roundCurrency(totalInterest / totalMonths);

  return Array.from({ length: totalMonths }, (_, index) => {
    const month = index + 1;
    const principalPaidToDate = principalPaid * month;
    const remainingBalance = roundCurrency(
      Math.max(loanAmount - principalPaidToDate, 0),
    );

    return {
      month,
      year: Math.ceil(month / 12),
      payment,
      principalPaid,
      interestPaid,
      remainingBalance,
    };
  });
}

export function buildYearlyRepaymentSummary(
  rows?: AmortizationRow[] | null,
): YearlyRepaymentRow[] {
  const safeRows = Array.isArray(rows) ? rows : [];

  if (safeRows.length === 0) {
    return [];
  }

  const yearlySummary = new Map<number, YearlyRepaymentRow>();

  for (const row of safeRows) {
    const year = Math.max(1, Math.round(toFiniteNumber(row.year)));
    const currentSummary = yearlySummary.get(year) ?? {
      year,
      yearLabel: `Year ${year}`,
      totalPayment: 0,
      totalPrincipalPaid: 0,
      totalInterestPaid: 0,
      remainingBalance: 0,
    };

    currentSummary.totalPayment = roundCurrency(
      currentSummary.totalPayment + toFiniteNumber(row.payment),
    );
    currentSummary.totalPrincipalPaid = roundCurrency(
      currentSummary.totalPrincipalPaid + toFiniteNumber(row.principalPaid),
    );
    currentSummary.totalInterestPaid = roundCurrency(
      currentSummary.totalInterestPaid + toFiniteNumber(row.interestPaid),
    );
    currentSummary.remainingBalance = roundCurrency(
      Math.max(toFiniteNumber(row.remainingBalance), 0),
    );

    yearlySummary.set(year, currentSummary);
  }

  return Array.from(yearlySummary.values()).sort((left, right) => left.year - right.year);
}

export function estimatePriceFromMonthlyBudget(
  monthlyBudget: number,
  downPayment: number,
  annualRate: number,
  tenureYears: number,
) {
  const safeMonthly = Math.max(toFiniteNumber(monthlyBudget), 0);
  const safeDown = Math.max(toFiniteNumber(downPayment), 0);
  const safeRate = Math.max(toFiniteNumber(annualRate), 0);
  const safeTenure = clamp(Math.round(toFiniteNumber(tenureYears)), 1, 9);
  const months = safeTenure * 12;
  const interestFactor = 1 + (safeRate / 100) * safeTenure;

  if (safeMonthly === 0 || interestFactor === 0) {
    return 0;
  }

  const loanAmount = (safeMonthly * months) / interestFactor;
  return roundCurrency(loanAmount + safeDown);
}
