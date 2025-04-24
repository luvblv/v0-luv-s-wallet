"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DebtPayoffPlan } from "@/types/debt"
import { formatCurrency } from "@/lib/utils"
import { getPayoffMonths, getTotalInterestByDebt } from "@/lib/debt-calculator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, DollarSign } from "lucide-react"

interface DebtPayoffResultsProps {
  plan: DebtPayoffPlan | null
  methodName: "avalanche" | "snowball"
}

export function DebtPayoffResults({ plan, methodName }: DebtPayoffResultsProps) {
  if (!plan) return null

  const payoffMonths = getPayoffMonths(plan)
  const interestByDebt = getTotalInterestByDebt(plan)

  // Calculate years and months
  const years = Math.floor(plan.totalMonths / 12)
  const months = plan.totalMonths % 12
  const timeDisplay =
    years > 0
      ? `${years} year${years > 1 ? "s" : ""}${months > 0 ? `, ${months} month${months > 1 ? "s" : ""}` : ""}`
      : `${months} month${months > 1 ? "s" : ""}`

  // Format the end date
  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + plan.totalMonths)
  const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" })
  const formattedEndDate = dateFormatter.format(endDate)

  // Calculate monthly payment (total paid / total months)
  const avgMonthlyPayment = plan.totalPaid / plan.totalMonths

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Payoff Time</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {timeDisplay}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Debt-free by {formattedEndDate}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Interest Paid</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              {formatCurrency(plan.totalInterestPaid)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {((plan.totalInterestPaid / plan.totalPaid) * 100).toFixed(1)}% of your payments go to interest
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg. Monthly Payment</CardDescription>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {formatCurrency(avgMonthlyPayment)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total paid: {formatCurrency(plan.totalPaid)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Debt Payoff Order ({methodName})</CardTitle>
          <CardDescription>
            {methodName === "avalanche"
              ? "Highest interest rate first to minimize interest paid"
              : "Smallest balance first to build momentum with quick wins"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Debt</TableHead>
                <TableHead>Interest Rate</TableHead>
                <TableHead className="text-right">Original Balance</TableHead>
                <TableHead className="text-right">Interest Paid</TableHead>
                <TableHead className="text-right">Payoff Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.payoffOrder.map((debt, index) => (
                <TableRow key={debt.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{debt.name}</TableCell>
                  <TableCell>{debt.interestRate}%</TableCell>
                  <TableCell className="text-right">{formatCurrency(debt.balance)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(interestByDebt[debt.id])}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{payoffMonths[debt.id]} months</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
