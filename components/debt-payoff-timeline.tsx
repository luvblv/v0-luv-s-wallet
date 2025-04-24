"use client"
import type { DebtPayoffPlan } from "@/types/debt"
import { formatCurrency } from "@/lib/utils"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ClientOnly } from "@/components/client-only"

interface DebtPayoffTimelineProps {
  plan: DebtPayoffPlan | null
}

export function DebtPayoffTimeline({ plan }: DebtPayoffTimelineProps) {
  if (!plan) return null

  // Get unique debt IDs from the original debts
  const debtIds = plan.originalDebts.map((debt) => debt.id)

  // Create a map of debt ID to name
  const debtNames: Record<string, string> = {}
  plan.originalDebts.forEach((debt) => {
    debtNames[debt.id] = debt.name
  })

  // Prepare data for the line chart showing balances over time
  const lineData = plan.monthlyPayments.map((payment) => {
    const dataPoint: Record<string, any> = {
      month: payment.month,
      date: payment.date.toLocaleDateString("default", { month: "short", year: "numeric" }),
    }

    // Add remaining balance for each debt
    payment.debtPayments.forEach((debtPayment) => {
      dataPoint[debtPayment.debtId] = debtPayment.remainingBalance
    })

    return dataPoint
  })

  // Generate a random color for each debt
  const colors = [
    "#4f46e5",
    "#f43f5e",
    "#06b6d4",
    "#16a34a",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#6366f1",
    "#84cc16",
    "#14b8a6",
  ]

  // Only show every nth month on the X-axis for better readability
  const tickInterval = Math.max(1, Math.ceil(plan.totalMonths / 12))

  return (
    <div className="space-y-4">
      <div className="h-72">
        <ClientOnly
          fallback={
            <div className="flex items-center justify-center h-full w-full bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Loading chart data...</p>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                ticks={lineData
                  .filter((_, i) => i % tickInterval === 0 || i === lineData.length - 1)
                  .map((d) => d.month)}
              />
              <YAxis tickFormatter={(value) => formatCurrency(value, { minimumFractionDigits: 0 })} />
              <Tooltip
                formatter={(value) => [formatCurrency(value as number), "Balance"]}
                labelFormatter={(label) => `Month ${label}`}
              />
              <Legend />
              {debtIds.map((debtId, index) => (
                <Line
                  key={debtId}
                  type="monotone"
                  dataKey={debtId}
                  name={debtNames[debtId]}
                  stroke={colors[index % colors.length]}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ClientOnly>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>
          This chart shows the remaining balance for each debt over time using the {plan.method} method. Debts are paid
          off in order, with each completed debt freeing up more money to pay down the next one.
        </p>
      </div>
    </div>
  )
}
