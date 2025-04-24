"use client"

import type { DebtPayoffPlan } from "@/types/debt"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowDownNarrowWide, Percent, ArrowDown, Check, TrendingDown } from "lucide-react"

interface DebtSummaryProps {
  avalanchePlan: DebtPayoffPlan | null
  snowballPlan: DebtPayoffPlan | null
  selectedMethod: "avalanche" | "snowball"
  setSelectedMethod: (method: "avalanche" | "snowball") => void
}

export function DebtSummary({ avalanchePlan, snowballPlan, selectedMethod, setSelectedMethod }: DebtSummaryProps) {
  if (!avalanchePlan || !snowballPlan) return null

  // Calculate the difference between methods
  const timeDiff = snowballPlan.totalMonths - avalanchePlan.totalMonths
  const interestDiff = snowballPlan.totalInterestPaid - avalanchePlan.totalInterestPaid

  // Determine if the avalanche method provides significant savings
  const hasSignificantSavings = interestDiff > 100

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Percent className="h-5 w-5 text-blue-600" />
            Avalanche Method
          </h3>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">{formatCurrency(avalanchePlan.totalInterestPaid)}</div>
            <div className="text-sm text-muted-foreground">total interest</div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-lg font-medium">{avalanchePlan.totalMonths} months</div>
            <div className="text-sm text-muted-foreground">to debt-free</div>
          </div>
          <div className="text-sm text-muted-foreground">Pays highest interest debts first</div>
          <Button
            variant={selectedMethod === "avalanche" ? "default" : "outline"}
            className="w-full mt-2"
            onClick={() => setSelectedMethod("avalanche")}
          >
            {selectedMethod === "avalanche" ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Selected
              </>
            ) : (
              "Select Avalanche"
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <ArrowDownNarrowWide className="h-5 w-5 text-indigo-600" />
            Snowball Method
          </h3>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">{formatCurrency(snowballPlan.totalInterestPaid)}</div>
            <div className="text-sm text-muted-foreground">total interest</div>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-lg font-medium">{snowballPlan.totalMonths} months</div>
            <div className="text-sm text-muted-foreground">to debt-free</div>
          </div>
          <div className="text-sm text-muted-foreground">Pays smallest balances first</div>
          <Button
            variant={selectedMethod === "snowball" ? "default" : "outline"}
            className="w-full mt-2"
            onClick={() => setSelectedMethod("snowball")}
          >
            {selectedMethod === "snowball" ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Selected
              </>
            ) : (
              "Select Snowball"
            )}
          </Button>
        </div>
      </div>

      {hasSignificantSavings && (
        <div className="rounded-md bg-muted p-3 text-sm">
          <div className="font-medium flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-green-600" />
            Potential savings with Avalanche
          </div>
          <div className="mt-1 space-y-1">
            {interestDiff > 0 && (
              <div className="flex items-center gap-2">
                <ArrowDown className="h-3 w-3 text-green-600" />
                <span>Save {formatCurrency(interestDiff)} in interest</span>
              </div>
            )}
            {timeDiff > 0 && (
              <div className="flex items-center gap-2">
                <ArrowDown className="h-3 w-3 text-green-600" />
                <span>
                  Pay off {timeDiff} month{timeDiff !== 1 ? "s" : ""} faster
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
