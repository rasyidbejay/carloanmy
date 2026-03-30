"use client";

import { useMemo } from "react";
import { calculateLoanResult } from "@/lib/calculator";
import type { LoanInputs } from "@/types/loan";

export function useLoanCalculator(inputs?: Partial<LoanInputs> | null) {
  return useMemo(() => calculateLoanResult(inputs), [inputs]);
}
