import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Debt Calculator | Personal Wallet",
  description: "Calculate your debt payoff strategies and timelines",
}

export default function DebtCalculatorPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Debt Calculator</h1>
      <p className="text-muted-foreground">
        This page will contain tools to help you calculate debt payoff strategies, including snowball and avalanche
        methods, interest savings calculations, and payoff timelines.
      </p>
    </div>
  )
}
