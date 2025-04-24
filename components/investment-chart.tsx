"use client"

import { useState } from "react"
import { formatCurrency } from "@/lib/utils"
import { ClientOnly } from "@/components/client-only"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from "recharts"
import type { InvestmentResult } from "@/types/investment"

interface InvestmentChartProps {
  result: InvestmentResult
}

export function InvestmentChart({ result }: InvestmentChartProps) {
  const [chartType, setChartType] = useState<"area" | "bar" | "composed">("area")

  // Prepare data for the chart
  const chartData = result.schedule.map((year) => ({
    year: year.year,
    startingAmount: result.startingAmount,
    contributions: year.contributionsToDate,
    interest: year.interestToDate,
    balance: year.endBalance,
  }))

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded p-3 shadow-md">
          <p className="font-medium">Year {label}</p>
          <p className="text-sm">Balance: {formatCurrency(payload[0].payload.balance)}</p>
          <p className="text-sm">Starting Amount: {formatCurrency(payload[0].payload.startingAmount)}</p>
          <p className="text-sm">Contributions: {formatCurrency(payload[0].payload.contributions)}</p>
          <p className="text-sm">Interest: {formatCurrency(payload[0].payload.interest)}</p>
        </div>
      )
    }
    return null
  }

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
            onClick={() => setChartType("bar")}
            className={`px-2 py-1 rounded ${
              chartType === "bar" ? "bg-background shadow-sm" : "hover:bg-background/50"
            }`}
          >
            Bar
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
                  <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} />
                  <YAxis
                    tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                    label={{ value: "Amount ($)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    name="Balance"
                    stroke="#4f46e5"
                    fill="#4f46e580"
                    activeDot={{ r: 8 }}
                  />
                </AreaChart>
              ) : chartType === "bar" ? (
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} />
                  <YAxis
                    tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                    label={{ value: "Amount ($)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="startingAmount" name="Starting Amount" stackId="a" fill="#4f46e5" />
                  <Bar dataKey="contributions" name="Contributions" stackId="a" fill="#22c55e" />
                  <Bar dataKey="interest" name="Interest" stackId="a" fill="#f59e0b" />
                </BarChart>
              ) : (
                <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: "Year", position: "insideBottom", offset: -5 }} />
                  <YAxis
                    tickFormatter={(value) => `$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                    label={{ value: "Amount ($)", angle: -90, position: "insideLeft" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="startingAmount" name="Starting Amount" stackId="a" fill="#4f46e5" />
                  <Bar dataKey="contributions" name="Contributions" stackId="a" fill="#22c55e" />
                  <Bar dataKey="interest" name="Interest" stackId="a" fill="#f59e0b" />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    name="Total Balance"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 5 }}
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
          This chart shows your investment growth over time, including your starting amount, regular contributions, and
          compound interest.
        </p>
        <p className="mt-1">
          <span className="font-medium">Tip:</span> Toggle between different chart types to see various visualizations
          of your investment growth.
        </p>
      </div>
    </div>
  )
}
