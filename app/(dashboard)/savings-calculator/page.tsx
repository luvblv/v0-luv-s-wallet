import type { Metadata } from "next"
import { SavingsGoalCalculatorPage } from "@/components/savings-goal-calculator-page"

export const metadata: Metadata = {
  title: "Savings Goal Calculator | Finance Tracker",
  description: "Calculate how to reach your savings goals with customizable contribution plans",
}

export default function SavingsCalculatorPage() {
  return <SavingsGoalCalculatorPage />
}
