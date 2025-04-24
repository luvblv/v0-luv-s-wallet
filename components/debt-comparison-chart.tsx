"use client"

import { useState } from "react"
import type { DebtPayoffPlan } from "@/types/debt"
import { formatCurrency } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ClientOnly } from "@/components/client-only"

interface DebtComparisonChartProps {
  avalanchePlan: DebtPayoffPlan | null
  snowballPlan: DebtPayoffPlan | null
}

export function DebtComparisonChart({ avalanchePlan, snowballPlan }: DebtComparisonChartProps) {
  const [activeTab, setActiveTab] = useState<"cost" | "time" | "breakdown">("cost")

  if (!avalanchePlan || !snowballPlan) return null

  // Prepare data for the bar chart comparing methods
  const barData = [
    {
      name: "Avalanche",
      interest: avalanchePlan.totalInterestPaid,
      months: avalanchePlan.totalMonths,
    },
    {
      name: "Snowball",
      interest: snowballPlan.totalInterestPaid,
      months: snowballPlan.totalMonths,
    },
  ]

  // Prepare data for the breakdown pie chart (using avalanche plan)
  const totalPrincipal = avalanchePlan.totalPaid - avalanchePlan.totalInterestPaid
  const pieData = [
    { name: "Principal", value: totalPrincipal },
    { name: "Interest", value: avalanchePlan.totalInterestPaid },
  ]
  const COLORS = ["#4f46e5", "#f43f5e"]

  return (
    <div className="space-y-4">
      <div className="flex space-x-1 bg-muted rounded-lg p-1">
        <button
          className={`flex-1 text-sm px-3 py-1.5 rounded-md transition-colors ${
            activeTab === "cost" ? "bg-background shadow-sm" : "hover:bg-background/50"
          }`}
          onClick={() => setActiveTab("cost")}
        >
          Interest Cost
        </button>
        <button
          className={`flex-1 text-sm px-3 py-1.5 rounded-md transition-colors ${
            activeTab === "time" ? "bg-background shadow-sm" : "hover:bg-background/50"
          }`}
          onClick={() => setActiveTab("time")}
        >
          Payoff Time
        </button>
        <button
          className={`flex-1 text-sm px-3 py-1.5 rounded-md transition-colors ${
            activeTab === "breakdown" ? "bg-background shadow-sm" : "hover:bg-background/50"
          }`}
          onClick={() => setActiveTab("breakdown")}
        >
          Payment Breakdown
        </button>
      </div>

      <div className="h-72">
        <ClientOnly
          fallback={
            <div className="flex items-center justify-center h-full w-full bg-muted/20 rounded-md">
              <p className="text-muted-foreground">Loading chart data...</p>
            </div>
          }
        >
          {activeTab === "cost" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value, { minimumFractionDigits: 0 })} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), "Interest Paid"]} />
                <Bar dataKey="interest" name="Interest Paid" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeTab === "time" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value} mo`} />
                <Tooltip formatter={(value) => [`${value} months`, "Time to Debt-Free"]} />
                <Bar dataKey="months" name="Months to Debt-Free" fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeTab === "breakdown" && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(value as number), ""]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ClientOnly>
      </div>

      <div className="text-xs text-muted-foreground mt-2">
        {activeTab === "cost" && (
          <p>The avalanche method typically results in less interest paid over the life of your debts.</p>
        )}
        {activeTab === "time" && (
          <p>The avalanche method may help you become debt-free faster by minimizing interest accrual.</p>
        )}
        {activeTab === "breakdown" && (
          <p>This chart shows how much of your total payments go toward principal vs. interest.</p>
        )}
      </div>
    </div>
  )
}
