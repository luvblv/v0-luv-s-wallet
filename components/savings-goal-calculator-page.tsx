"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SavingsGoalResults } from "./savings-goal-results"
import { SavingsTimelineChart } from "./savings-timeline-chart"
import { SavingsComparisonTable } from "./savings-comparison-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Percent, Calculator } from "lucide-react"

export interface SavingsGoalData {
  goalAmount: number
  initialDeposit: number
  contributionAmount: number
  contributionFrequency: "daily" | "weekly" | "biweekly" | "monthly"
  interestRate: number
  compoundingFrequency: "daily" | "monthly" | "quarterly" | "annually"
}

export interface MonthlyBreakdown {
  month: number
  balance: number
  contributions: number
  interest: number
  contributionToDate: number
  interestToDate: number
}

export interface SavingsGoalResult {
  timeToGoalMonths: number
  timeToGoalWeeks: number
  timeToGoalDays: number
  finalAmount: number
  totalContributions: number
  totalInterest: number
  monthlyBreakdown: MonthlyBreakdown[]
  comparisonTable: {
    daily: number
    weekly: number
    biweekly: number
    monthly: number
  }
}

export function SavingsGoalCalculatorPage() {
  const [formData, setFormData] = useState<SavingsGoalData>({
    goalAmount: 10000,
    initialDeposit: 1000,
    contributionAmount: 200,
    contributionFrequency: "monthly",
    interestRate: 3,
    compoundingFrequency: "monthly",
  })

  const [result, setResult] = useState<SavingsGoalResult | null>(null)

  const handleInputChange = (field: keyof SavingsGoalData, value: string | number) => {
    setFormData({
      ...formData,
      [field]:
        typeof value === "string" && field !== "contributionFrequency" && field !== "compoundingFrequency"
          ? Number.parseFloat(value) || 0
          : value,
    })
  }

  const calculateSavings = () => {
    // Convert contribution to monthly equivalent
    let monthlyContribution = formData.contributionAmount
    switch (formData.contributionFrequency) {
      case "daily":
        monthlyContribution = formData.contributionAmount * 30.4167 // Average days in a month
        break
      case "weekly":
        monthlyContribution = formData.contributionAmount * 4.34524 // Average weeks in a month
        break
      case "biweekly":
        monthlyContribution = formData.contributionAmount * 2.17262 // Average bi-weeks in a month
        break
      case "monthly":
        // Already monthly
        break
    }

    // Convert interest rate to monthly rate based on compounding frequency
    let monthlyInterestRate = 0
    switch (formData.compoundingFrequency) {
      case "daily":
        monthlyInterestRate = Math.pow(1 + formData.interestRate / 100 / 365, 30.4167) - 1
        break
      case "monthly":
        monthlyInterestRate = formData.interestRate / 100 / 12
        break
      case "quarterly":
        monthlyInterestRate = Math.pow(1 + formData.interestRate / 100 / 4, 1 / 3) - 1
        break
      case "annually":
        monthlyInterestRate = Math.pow(1 + formData.interestRate / 100, 1 / 12) - 1
        break
    }

    // Calculate time to goal
    let currentBalance = formData.initialDeposit
    let month = 0
    let totalContributions = formData.initialDeposit
    let totalInterest = 0
    const monthlyBreakdown: MonthlyBreakdown[] = [
      {
        month: 0,
        balance: currentBalance,
        contributions: 0,
        interest: 0,
        contributionToDate: formData.initialDeposit,
        interestToDate: 0,
      },
    ]

    while (currentBalance < formData.goalAmount && month < 600) {
      // Cap at 50 years
      month++

      // Add contribution
      currentBalance += monthlyContribution
      totalContributions += monthlyContribution

      // Add interest
      const interestEarned = currentBalance * monthlyInterestRate
      currentBalance += interestEarned
      totalInterest += interestEarned

      // Add to breakdown
      monthlyBreakdown.push({
        month,
        balance: currentBalance,
        contributions: monthlyContribution,
        interest: interestEarned,
        contributionToDate: totalContributions,
        interestToDate: totalInterest,
      })
    }

    // Calculate time in different units
    const timeToGoalMonths = month
    const timeToGoalWeeks = month * 4.34524
    const timeToGoalDays = month * 30.4167

    // Calculate comparison table
    const dailyAmount =
      formData.contributionAmount *
      (formData.contributionFrequency === "daily"
        ? 1
        : formData.contributionFrequency === "weekly"
          ? 1 / 7
          : formData.contributionFrequency === "biweekly"
            ? 1 / 14
            : 1 / 30.4167)

    const weeklyAmount =
      formData.contributionAmount *
      (formData.contributionFrequency === "daily"
        ? 7
        : formData.contributionFrequency === "weekly"
          ? 1
          : formData.contributionFrequency === "biweekly"
            ? 1 / 2
            : 12 / 52)

    const biweeklyAmount =
      formData.contributionAmount *
      (formData.contributionFrequency === "daily"
        ? 14
        : formData.contributionFrequency === "weekly"
          ? 2
          : formData.contributionFrequency === "biweekly"
            ? 1
            : 12 / 26)

    const monthlyAmount =
      formData.contributionAmount *
      (formData.contributionFrequency === "daily"
        ? 30.4167
        : formData.contributionFrequency === "weekly"
          ? 4.34524
          : formData.contributionFrequency === "biweekly"
            ? 2.17262
            : 1)

    setResult({
      timeToGoalMonths,
      timeToGoalWeeks,
      timeToGoalDays,
      finalAmount: currentBalance,
      totalContributions,
      totalInterest,
      monthlyBreakdown,
      comparisonTable: {
        daily: dailyAmount,
        weekly: weeklyAmount,
        biweekly: biweeklyAmount,
        monthly: monthlyAmount,
      },
    })
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Savings Goal Calculator</h1>
        <p className="text-muted-foreground">
          Plan your savings strategy and see how long it will take to reach your financial goals.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-5 lg:col-span-4">
          <CardHeader>
            <CardTitle>Your Savings Goal</CardTitle>
            <CardDescription>Enter your target amount and contribution details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-amount">Target Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="goal-amount"
                  type="number"
                  min="0"
                  step="100"
                  className="pl-8"
                  value={formData.goalAmount}
                  onChange={(e) => handleInputChange("goalAmount", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initial-deposit">Initial Deposit</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="initial-deposit"
                  type="number"
                  min="0"
                  step="100"
                  className="pl-8"
                  value={formData.initialDeposit}
                  onChange={(e) => handleInputChange("initialDeposit", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contribution-amount">Regular Contribution</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contribution-amount"
                  type="number"
                  min="0"
                  step="10"
                  className="pl-8"
                  value={formData.contributionAmount}
                  onChange={(e) => handleInputChange("contributionAmount", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contribution-frequency">Contribution Frequency</Label>
              <Select
                value={formData.contributionFrequency}
                onValueChange={(value) => handleInputChange("contributionFrequency", value)}
              >
                <SelectTrigger id="contribution-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
              <div className="relative">
                <Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="interest-rate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  className="pl-8"
                  value={formData.interestRate}
                  onChange={(e) => handleInputChange("interestRate", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="compounding-frequency">Compounding Frequency</Label>
              <Select
                value={formData.compoundingFrequency}
                onValueChange={(value) => handleInputChange("compoundingFrequency", value)}
              >
                <SelectTrigger id="compounding-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={calculateSavings} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          {result ? (
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="comparison">Comparison</TabsTrigger>
              </TabsList>

              <TabsContent value="results">
                <Card>
                  <CardHeader>
                    <CardTitle>Savings Goal Results</CardTitle>
                    <CardDescription>
                      Based on your inputs, here's how long it will take to reach your goal
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SavingsGoalResults result={result} data={formData} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle>Savings Growth Timeline</CardTitle>
                    <CardDescription>Visualize how your savings will grow over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SavingsTimelineChart result={result} goalAmount={formData.goalAmount} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comparison">
                <Card>
                  <CardHeader>
                    <CardTitle>Contribution Comparison</CardTitle>
                    <CardDescription>Compare different contribution frequencies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SavingsComparisonTable
                      comparisonTable={result.comparisonTable}
                      currentFrequency={formData.contributionFrequency}
                      goalAmount={formData.goalAmount}
                      initialDeposit={formData.initialDeposit}
                      interestRate={formData.interestRate}
                      compoundingFrequency={formData.compoundingFrequency}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-60 border rounded-lg">
              <p className="text-muted-foreground">
                Enter your savings goal details and click "Calculate" to see results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
