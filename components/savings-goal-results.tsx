"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import { Calendar, Clock, PiggyBank } from "lucide-react"
import type { SavingsGoalData, SavingsGoalResult } from "./savings-goal-calculator-page"

interface SavingsGoalResultsProps {
  result: SavingsGoalResult
  data: SavingsGoalData
}

export function SavingsGoalResults({ result, data }: SavingsGoalResultsProps) {
  const { timeToGoalMonths, timeToGoalWeeks, timeToGoalDays, finalAmount, totalContributions, totalInterest } = result
  const { goalAmount } = data

  // Format time display
  const years = Math.floor(timeToGoalMonths / 12)
  const remainingMonths = timeToGoalMonths % 12
  const timeDisplay =
    years > 0
      ? `${years} year${years > 1 ? "s" : ""}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}` : ""}`
      : `${timeToGoalMonths} month${timeToGoalMonths > 1 ? "s" : ""}`

  // Calculate percentage of goal reached
  const percentComplete = Math.min(100, (finalAmount / goalAmount) * 100)

  // Calculate future date
  const targetDate = new Date()
  targetDate.setMonth(targetDate.getMonth() + timeToGoalMonths)
  const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" })
  const formattedTargetDate = dateFormatter.format(targetDate)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Time to Goal</span>
            </div>
            <div className="text-2xl font-bold">{timeDisplay}</div>
            <div className="text-sm text-muted-foreground">
              {timeToGoalWeeks} weeks or {timeToGoalDays} days
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Target Date</span>
            </div>
            <div className="text-2xl font-bold">{formattedTargetDate}</div>
            <div className="text-sm text-muted-foreground">Based on your current contributions</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PiggyBank className="h-4 w-4" />
              <span>Final Amount</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(finalAmount)}</div>
            <div className="text-sm text-muted-foreground">
              {formatCurrency(totalContributions)} contributions + {formatCurrency(totalInterest)} interest
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress to Goal</span>
          <span className="font-medium">
            {formatCurrency(finalAmount)} of {formatCurrency(goalAmount)}
          </span>
        </div>
        <Progress value={percentComplete} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Current: {formatCurrency(data.initialDeposit)}</span>
          <span>{percentComplete.toFixed(1)}% of goal</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Total Contributions</p>
          <p className="font-medium">{formatCurrency(totalContributions)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Interest Earned</p>
          <p className="font-medium">{formatCurrency(totalInterest)}</p>
        </div>
      </div>
    </div>
  )
}
