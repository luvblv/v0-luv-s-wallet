import type { Metadata } from "next"
import { DebtCalculatorPage } from "@/components/debt-calculator-page"

export const metadata: Metadata = {
  title: "Debt Calculator | Personal Wallet",
  description: "Calculate your debt payoff strategies and timelines",
}

export default function DebtCalculator() {
  return <DebtCalculatorPage />
}
