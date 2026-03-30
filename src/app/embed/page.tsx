import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";

export const metadata: Metadata = {
  title: "Embedded Car Loan Widget | CarLoan.my",
  description: "Compact embed-friendly Malaysian car loan calculator widget.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EmbedPage() {
  return (
    <Calculator
      compact
      heroTag="Embedded widget"
      title="Compact Malaysia car-loan widget."
      description="A simplified iframe-ready view for publishers, dealers, and partner sites that want quick instalment estimates without rebuilding the calculator."
      showCorrectionForm={false}
      showThemeToggle={false}
    />
  );
}
