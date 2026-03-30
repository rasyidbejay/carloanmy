export type LoanType = "hire-purchase" | "islamic";

export type AffordabilityStatus =
  | "comfortable"
  | "manageable"
  | "stretch"
  | "risky"
  | "neutral";

export interface LoanInputs {
  price: number;
  downPayment: number;
  annualRate: number;
  tenureYears: number;
  loanType: LoanType;
  monthlyIncome?: number;
}

export interface LoanResult {
  loanAmount: number;
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  affordabilityRatio?: number;
  affordabilityStatus: AffordabilityStatus;
  affordabilityLabel: string;
}

export type LoanCalculationInput = LoanInputs;

export type LoanCalculationResult = LoanResult;

export interface AmortizationRow {
  month: number;
  year: number;
  payment: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface YearlyRepaymentRow {
  year: number;
  yearLabel: string;
  totalPayment: number;
  totalPrincipalPaid: number;
  totalInterestPaid: number;
  remainingBalance: number;
}

export interface CompareScenario {
  id: string;
  carId: string;
  label: string;
  inputs: LoanInputs;
  result: LoanResult;
}
