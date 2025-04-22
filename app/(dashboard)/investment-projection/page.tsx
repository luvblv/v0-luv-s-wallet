import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Investment Projection | Personal Wallet",
  description: "Project your investment growth over time",
}

export default function InvestmentProjectionPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Investment Projection</h1>
      <p className="text-muted-foreground">
        This page will contain tools to help you project your investment growth over time, including compound interest
        calculations, portfolio diversification analysis, and retirement planning projections.
      </p>
    </div>
  )
}
