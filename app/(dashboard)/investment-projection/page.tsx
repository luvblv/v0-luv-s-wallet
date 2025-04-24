import type { Metadata } from "next"
import { InvestmentProjectionCalculator } from "@/components/investment-projection-calculator"

export const metadata: Metadata = {
  title: "Investment Projection | Finance Tracker",
  description: "Project your investment growth over time with compound interest",
}

export default function InvestmentProjectionPage() {
  return <InvestmentProjectionCalculator />
}
