"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

interface SavingsComparisonTableProps {
  comparisonTable: {
    daily: number
    weekly: number
    biweekly: number
    monthly: number
  }
  currentFrequency: string
  goalAmount: number
  initialDeposit: number
  interestRate: number
  compoundingFrequency: string
}

export function SavingsComparisonTable({
  comparisonTable,
  currentFrequency,
  goalAmount,
  initialDeposit,
  interestRate,
  compoundingFrequency,
}: SavingsComparisonTableProps) {
  // Calculate time to goal for each frequency
  const calculateTimeToGoal = (contributionAmount: number, frequency: string) => {
    // Convert contribution to monthly equivalent
    let monthlyContribution = contributionAmount
    switch (frequency) {
      case "daily":
        monthlyContribution = contributionAmount * 30.4167 // Average days in a month
        break
      case "weekly":
        monthlyContribution = contributionAmount * 4.34524 // Average weeks in a month
        break
      case "biweekly":
        monthlyContribution = contributionAmount * 2.17262 // Average bi-weeks in a month
        break
      case "monthly":
        // Already monthly
        break
    }

    // Convert interest rate to monthly rate based on compounding frequency
    let monthlyInterestRate = 0
    switch (compoundingFrequency) {
      case "daily":
        monthlyInterestRate = Math.pow(1 + interestRate / 100 / 365, 30.4167) - 1
        break
      case "monthly":
        monthlyInterestRate = interestRate / 100 / 12
        break
      case "quarterly":
        monthlyInterestRate = Math.pow(1 + interestRate / 100 / 4, 1 / 3) - 1
        break
      case "annually":
        monthlyInterestRate = Math.pow(1 + interestRate / 100, 1 / 12) - 1
        break
    }

    // Calculate time to goal
    let currentBalance = initialDeposit
    let month = 0

    while (currentBalance < goalAmount && month < 600) {
      // Cap at 50 years
      month++

      // Add contribution
      currentBalance += monthlyContribution

      // Add interest
      const interestEarned = currentBalance * monthlyInterestRate
      currentBalance += interestEarned
    }

    return {
      months: month,
      years: (month / 12).toFixed(1),
    }
  }

  const dailyTime = calculateTimeToGoal(comparisonTable.daily, "daily")
  const weeklyTime = calculateTimeToGoal(comparisonTable.weekly, "weekly")
  const biweeklyTime = calculateTimeToGoal(comparisonTable.biweekly, "biweekly")
  const monthlyTime = calculateTimeToGoal(comparisonTable.monthly, "monthly")

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Frequency</TableHead>
            <TableHead>Contribution</TableHead>
            <TableHead>Monthly Total</TableHead>
            <TableHead>Time to Goal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className={currentFrequency === "daily" ? "bg-muted" : ""}>
            <TableCell className="font-medium">Daily</TableCell>
            <TableCell>{formatCurrency(comparisonTable.daily)}/day</TableCell>
            <TableCell>{formatCurrency(comparisonTable.daily * 30.4167)}</TableCell>
            <TableCell>
              {dailyTime.years} years ({dailyTime.months} months)
            </TableCell>
          </TableRow>
          <TableRow className={currentFrequency === "weekly" ? "bg-muted" : ""}>
            <TableCell className="font-medium">Weekly</TableCell>
            <TableCell>{formatCurrency(comparisonTable.weekly)}/week</TableCell>
            <TableCell>{formatCurrency(comparisonTable.weekly * 4.34524)}</TableCell>
            <TableCell>
              {weeklyTime.years} years ({weeklyTime.months} months)
            </TableCell>
          </TableRow>
          <TableRow className={currentFrequency === "biweekly" ? "bg-muted" : ""}>
            <TableCell className="font-medium">Bi-Weekly</TableCell>
            <TableCell>{formatCurrency(comparisonTable.biweekly)}/2 weeks</TableCell>
            <TableCell>{formatCurrency(comparisonTable.biweekly * 2.17262)}</TableCell>
            <TableCell>
              {biweeklyTime.years} years ({biweeklyTime.months} months)
            </TableCell>
          </TableRow>
          <TableRow className={currentFrequency === "monthly" ? "bg-muted" : ""}>
            <TableCell className="font-medium">Monthly</TableCell>
            <TableCell>{formatCurrency(comparisonTable.monthly)}/month</TableCell>
            <TableCell>{formatCurrency(comparisonTable.monthly)}</TableCell>
            <TableCell>
              {monthlyTime.years} years ({monthlyTime.months} months)
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="text-sm text-muted-foreground">
        <p>
          This table shows equivalent contribution amounts across different frequencies. Your current selection is
          highlighted. All options result in approximately the same monthly contribution, but may have different
          psychological and practical benefits.
        </p>
        <p className="mt-2">
          <span className="font-medium">Tip:</span> Smaller, more frequent contributions can make saving easier and may
          help you reach your goal faster due to more frequent compounding.
        </p>
      </div>
    </div>
  )
}
