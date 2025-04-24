"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DebtInputForm } from "@/components/debt-input-form"
import { DebtPayoffResults } from "@/components/debt-payoff-results"
import { DebtComparisonChart } from "@/components/debt-comparison-chart"
import { DebtPayoffTimeline } from "@/components/debt-payoff-timeline"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateDebtPayoff } from "@/lib/debt-calculator"
import { DebtSummary } from "@/components/debt-summary"
import type { Debt, DebtPayoffPlan } from "@/types/debt"
import { Info } from "lucide-react"

export function DebtCalculatorPage() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [extraPayment, setExtraPayment] = useState<number>(0)
  const [avalanchePlan, setAvalanchePlan] = useState<DebtPayoffPlan | null>(null)
  const [snowballPlan, setSnowballPlan] = useState<DebtPayoffPlan | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<"avalanche" | "snowball">("avalanche")

  const calculatePayoffPlans = () => {
    if (debts.length === 0) return

    // Calculate avalanche method (highest interest first)
    const avalancheResult = calculateDebtPayoff(debts, extraPayment, "avalanche")
    setAvalanchePlan(avalancheResult)

    // Calculate snowball method (lowest balance first)
    const snowballResult = calculateDebtPayoff(debts, extraPayment, "snowball")
    setSnowballPlan(snowballResult)
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Debt Calculator</h1>
        <p className="text-muted-foreground">
          Plan your debt payoff strategy, compare methods, and visualize your path to financial freedom.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-5 lg:col-span-4">
          <CardHeader>
            <CardTitle>Your Debts</CardTitle>
            <CardDescription>Enter your debts to calculate payoff strategies</CardDescription>
          </CardHeader>
          <CardContent>
            <DebtInputForm
              debts={debts}
              setDebts={setDebts}
              extraPayment={extraPayment}
              setExtraPayment={setExtraPayment}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={calculatePayoffPlans} className="w-full" disabled={debts.length === 0}>
              Calculate Payoff Plan
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          {(avalanchePlan || snowballPlan) && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Debt Payoff Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <DebtSummary
                    avalanchePlan={avalanchePlan}
                    snowballPlan={snowballPlan}
                    selectedMethod={selectedMethod}
                    setSelectedMethod={setSelectedMethod}
                  />
                </CardContent>
              </Card>

              <Tabs defaultValue="results" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="comparison">Comparison</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="results" className="space-y-4">
                  <DebtPayoffResults
                    plan={selectedMethod === "avalanche" ? avalanchePlan : snowballPlan}
                    methodName={selectedMethod}
                  />
                </TabsContent>

                <TabsContent value="comparison">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2">
                        Method Comparison
                        <div className="relative group">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-64 p-2 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                            <p>
                              <strong>Avalanche Method:</strong> Pay highest interest debts first to minimize interest
                              costs.
                            </p>
                            <p className="mt-1">
                              <strong>Snowball Method:</strong> Pay smallest balances first to build momentum with quick
                              wins.
                            </p>
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DebtComparisonChart avalanchePlan={avalanchePlan} snowballPlan={snowballPlan} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Payoff Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DebtPayoffTimeline plan={selectedMethod === "avalanche" ? avalanchePlan : snowballPlan} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}

          {!avalanchePlan && !snowballPlan && debts.length > 0 && (
            <div className="flex items-center justify-center h-60 border rounded-lg">
              <p className="text-muted-foreground">Click "Calculate Payoff Plan" to see your debt payoff strategy</p>
            </div>
          )}

          {debts.length === 0 && (
            <div className="flex items-center justify-center h-60 border rounded-lg">
              <p className="text-muted-foreground">Add your debts to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
