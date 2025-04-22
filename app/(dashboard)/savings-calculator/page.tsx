import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Savings Goal Calculator | Personal Wallet",
  description: "Calculate how to reach your savings goals",
}

export default function SavingsCalculatorPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Savings Goal Calculator</h1>
      <p className="text-muted-foreground">
        This page will contain tools to help you calculate how to reach your savings goals, including monthly
        contribution calculations, timeline projections, and interest earnings estimates.
      </p>
    </div>
  )
}
