"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvestmentForm } from "./investment-form"
import { InvestmentResults } from "./investment-results"
import { InvestmentTable } from "./investment-table"
import { InvestmentChart } from "./investment-chart"
import { calculateInvestment } from "@/lib/investment-calculator"
import type { InvestmentParams, InvestmentResult } from "@/types/investment"
import { ClientOnly } from "@/components/client-only"

export function InvestmentProjectionCalculator() {
  const [formData, setFormData] = useState<InvestmentParams>({
    startingAmount: 10000,
    investmentLength: 30,
    annualReturnRate: 7,
    compoundingFrequency: "monthly",
    contributionAmount: 500,
    contributionFrequency: "monthly",
    contributionTiming: "end",
  })

  const [result, setResult] = useState<InvestmentResult | null>(null)

  const handleCalculate = (data: InvestmentParams) => {
    const calculationResult = calculateInvestment(data)
    setResult(calculationResult)
    setFormData(data)
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Investment Projection Calculator</h1>
        <p className="text-muted-foreground">
          Project your investment growth over time with compound interest and regular contributions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-5 lg:col-span-4">
          <CardHeader>
            <CardTitle>Investment Parameters</CardTitle>
            <CardDescription>Enter your investment details to calculate future growth</CardDescription>
          </CardHeader>
          <CardContent>
            <InvestmentForm initialData={formData} onCalculate={handleCalculate} />
          </CardContent>
        </Card>

        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          {result ? (
            <ClientOnly>
              <Tabs defaultValue="results" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>

                <TabsContent value="results">
                  <Card>
                    <CardHeader>
                      <CardTitle>Investment Results</CardTitle>
                      <CardDescription>
                        Based on your inputs, here's how your investment will grow over {formData.investmentLength}{" "}
                        years
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <InvestmentResults result={result} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="chart">
                  <Card>
                    <CardHeader>
                      <CardTitle>Investment Growth Chart</CardTitle>
                      <CardDescription>Visualize how your investment will grow over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <InvestmentChart result={result} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="table">
                  <Card>
                    <CardHeader>
                      <CardTitle>Year-by-Year Breakdown</CardTitle>
                      <CardDescription>Detailed view of your investment growth each year</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <InvestmentTable result={result} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </ClientOnly>
          ) : (
            <div className="flex items-center justify-center h-60 border rounded-lg">
              <p className="text-muted-foreground">
                Enter your investment parameters and click "Calculate" to see results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
