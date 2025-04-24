"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { formatCurrency } from "@/lib/utils"
import { ClientOnly } from "@/components/client-only"

interface MiniLineChartProps {
  data: Array<{ value: number; date: string }>
  color?: string
  height?: number | string
  showGrid?: boolean
  showAxis?: boolean
  timePeriod?: string
}

export function MiniLineChart({
  data,
  color = "#3b82f6",
  height = "100%",
  showGrid = false,
  showAxis = false,
  timePeriod = "month",
}: MiniLineChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded p-2 shadow-md">
          <p className="font-medium">${formatCurrency(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">{payload[0].payload.date}</p>
        </div>
      )
    }
    return null
  }

  // Determine tick count based on time period
  const getTickCount = () => {
    switch (timePeriod) {
      case "week":
        return 7
      case "month":
        return 4
      case "quarter":
        return 3
      case "year":
        return 12
      default:
        return 5
    }
  }

  return (
    <ClientOnly
      fallback={
        <div className="flex items-center justify-center h-full w-full bg-muted/20 rounded-md">
          <p className="text-muted-foreground">Loading chart...</p>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={height || "100%"}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />}
          {showAxis && (
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickCount={getTickCount()}
            />
          )}
          {showAxis && <YAxis hide />}
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ClientOnly>
  )
}
