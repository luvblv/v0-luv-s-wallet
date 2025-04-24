"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Calculator, Calendar, TrendingUp } from "lucide-react"
import type { InvestmentResult } from "@/types/investment"

interface InvestmentResultsProps {
  result: InvestmentResult
}

export function InvestmentResults({ result }: InvestmentResultsProps) {
  const { startingAmount, totalContributions, totalInterest, finalBalance } = result

  // Calculate percentages for the breakdown
  const startingPercentage = (startingAmount / finalBalance) * 100
  const contributionsPercentage = (totalContributions / finalBalance) * 100
  const interestPercentage = (totalInterest / finalBalance) * 100

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calculator className="h-4 w-4" />
              <span>Final Balance</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(finalBalance)}</div>
            <div className="text-sm text-muted-foreground">
              {formatCurrency(startingAmount)} + {formatCurrency(totalContributions)} + {formatCurrency(totalInterest)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Total Contributions</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(totalContributions)}</div>
            <div className="text-sm text-muted-foreground">{contributionsPercentage.toFixed(1)}% of final balance</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>Total Interest</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(totalInterest)}</div>
            <div className="text-sm text-muted-foreground">{interestPercentage.toFixed(1)}% of final balance</div>
          </CardContent>
        </Card>
      </div>

      <div className="relative pt-4">
        <div className="flex h-4 overflow-hidden rounded-full bg-muted">
          <div
            className="bg-blue-600 transition-all"
            style={{ width: `${startingPercentage}%` }}
            title={`Starting Amount: ${formatCurrency(startingAmount)} (${startingPercentage.toFixed(1)}%)`}
          />
          <div
            className="bg-green-600 transition-all"
            style={{ width: `${contributionsPercentage}%` }}
            title={`Contributions: ${formatCurrency(totalContributions)} (${contributionsPercentage.toFixed(1)}%)`}
          />
          <div
            className="bg-amber-500 transition-all"
            style={{ width: `${interestPercentage}%` }}
            title={`Interest: ${formatCurrency(totalInterest)} (${interestPercentage.toFixed(1)}%)`}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Starting: {startingPercentage.toFixed(1)}%</span>
          <span>Contributions: {contributionsPercentage.toFixed(1)}%</span>
          <span>Interest: {interestPercentage.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}
