"use client"

import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts"
import type { SavingsGoalResult } from "./savings-goal-calculator-page"
import { ClientOnly } from "@/components/client-only"

interface SavingsTimelineChartProps {
  result: SavingsGoalResult
  goalAmount: number
}

export function SavingsTimelineChart({ result, goalAmount }: SavingsTimelineChartProps) {
  const [chartType, setChartType] = useState<"line" | "area" | "composed">("area")

  // Prepare data for the chart
  const chartData = result.monthlyBreakdown.map((item) => {
    // Get the actual date by adding months to current date
    const date = new Date()
    date.setMonth(date.getMonth() + item.month)

    return {
      month: item.month,
      date: date, // Add actual date
      balance: item.balance,
      contributions: item.contributions,
      interest: item.interest,
      contributionToDate: item.contributionToDate,
      interestToDate: item.interestToDate,
      label: item.month === 1 ? "Start" : item.month % 12 === 0 ? `Year ${item.month / 12}` : `Month ${item.month}`,
    }
  })

  // Format tooltip values
  const formatTooltipValue = (value: number) => formatCurrency(value)

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload

      return (
        <div className="bg-background border rounded p-3 shadow-md">
          <p className="font-medium">{data.label}</p>
          <p className="text-sm">Balance: {formatCurrency(data.balance)}</p>
          <p className="text-sm">Total Contributions: {formatCurrency(data.contributionToDate)}</p>
          <p className="text-sm">Total Interest: {formatCurrency(data.interestToDate)}</p>
          {data.month > 1 && (
            <>
              <p className="text-xs text-muted-foreground mt-1">This month:</p>
              <p className="text-xs">Contribution: {formatCurrency(data.contributions)}</p>
              <p className="text-xs">Interest: {formatCurrency(data.interest)}</p>
            </>
          )}
        </div>
      )
    }
    return null
  }

  // Determine appropriate tick interval based on total months
  const tickInterval = Math.max(1, Math.ceil(result.timeToGoalMonths / 12))

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2 mb-2">
        <div className="flex items-center space-x-2 bg-muted rounded-md p-1 text-xs">
          <button
            onClick={() => setChartType("area")}
            className={`px-2 py-1 rounded ${
              chartType === "area" ? "bg-background shadow-sm" : "hover:bg-background/50"
            }`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`px-2 py-1 rounded ${
              chartType === "line" ? "bg-background shadow-sm" : "hover:bg-background/50"
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType("composed")}
            className={`px-2 py-1 rounded ${
              chartType === "composed" ? "bg-background shadow-sm" : "hover:bg-background/50"
            }`}
          >
            Detailed
          </button>
        </div>
      </div>

      <div className="h-80" style={{ width: "100%", minHeight: "320px", position: "relative" }}>
        <ClientOnly
          fallback={
            <div className="flex items-center justify-center h-full w-full bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Loading chart data...</p>
            </div>
          }
        >
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" aspect={undefined}>
              {chartType === "area" ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => {
                      const dataPoint = chartData.find((d) => d.month === value)
                      if (!dataPoint) return ""
                      const date = dataPoint.date
                      return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }).toUpperCase()
                    }}
                    label={{ value: "Timeline", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                    label={{ value: "Amount ($)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <ReferenceLine y={goalAmount} label="Goal" stroke="#ff0000" strokeDasharray="3 3" />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    name="Balance"
                    stroke="#4f46e5"
                    fill="#4f46e580"
                    activeDot={{ r: 8 }}
                  />
                </AreaChart>
              ) : chartType === "line" ? (
                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => {
                      const dataPoint = chartData.find((d) => d.month === value)
                      if (!dataPoint) return ""
                      const date = dataPoint.date
                      return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }).toUpperCase()
                    }}
                    label={{ value: "Timeline", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                    label={{ value: "Amount ($)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <ReferenceLine y={goalAmount} label="Goal" stroke="#ff0000" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    name="Balance"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ r: 1 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              ) : (
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={(value) => {
                      const dataPoint = chartData.find((d) => d.month === value)
                      if (!dataPoint) return ""
                      const date = dataPoint.date
                      return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }).toUpperCase()
                    }}
                    label={{ value: "Timeline", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                    label={{ value: "Amount ($)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <ReferenceLine y={goalAmount} label="Goal" stroke="#ff0000" strokeDasharray="3 3" />
                  <Area
                    type="monotone"
                    dataKey="contributionToDate"
                    name="Contributions"
                    fill="#22c55e80"
                    stroke="#22c55e"
                  />
                  <Area type="monotone" dataKey="interestToDate" name="Interest" fill="#f59e0b80" stroke="#f59e0b" />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    name="Total Balance"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8 }}
                  />
                </ComposedChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-muted/20 rounded-md">
              <p className="text-muted-foreground">No chart data available</p>
            </div>
          )}
        </ClientOnly>
      </div>

      <div className="text-xs text-muted-foreground">
        <p>
          This chart shows your savings growth over time, including your initial deposit, regular contributions, and
          compound interest. The red line represents your target goal amount.
        </p>
        <p className="mt-1">
          <span className="font-medium">Tip:</span> Toggle between different chart types to see various visualizations
          of your savings growth.
        </p>
      </div>
    </div>
  )
}
