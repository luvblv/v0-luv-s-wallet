"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { DateRange, TimePeriod } from "@/components/time-period-filter"
import { formatCurrency } from "@/lib/utils"
import { useMemo } from "react"
import {
  format,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  startOfWeek,
  endOfWeek,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
} from "date-fns"

// Generate data for each day in a week
const generateDailyData = (dateRange: DateRange) => {
  const days = eachDayOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  })

  return days.map((day) => {
    const dayLabel = format(day, "EEE")

    // Generate random data for demo purposes
    const income = 150 + Math.random() * 100
    const expenses = 80 + Math.random() * 70
    const savings = income - expenses

    return {
      name: dayLabel,
      date: format(day, "MMM d"),
      Income: income,
      Expenses: expenses,
      Savings: savings,
    }
  })
}

// Generate data for each week in a month
const generateWeeklyData = (dateRange: DateRange) => {
  const weeks = eachWeekOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  })

  return weeks.map((week, index) => {
    const weekStart = startOfWeek(week)
    const weekEnd = endOfWeek(week)
    const weekLabel = `Week ${index + 1}`

    // Generate random data for demo purposes
    const income = 1000 + Math.random() * 500
    const expenses = 600 + Math.random() * 400
    const savings = income - expenses

    return {
      name: weekLabel,
      date: `${format(weekStart, "MMM d")}-${format(weekEnd, "d")}`,
      Income: income,
      Expenses: expenses,
      Savings: savings,
    }
  })
}

// Generate data for each month in a quarter or year
const generateMonthlyData = (dateRange: DateRange) => {
  const months = eachMonthOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  })

  return months.map((month) => {
    const monthLabel = format(month, "MMM")

    // Generate random data for demo purposes
    const income = 4000 + Math.random() * 1000
    const expenses = 2500 + Math.random() * 800
    const savings = income - expenses

    return {
      name: monthLabel,
      date: format(month, "MMM yyyy"),
      Income: income,
      Expenses: expenses,
      Savings: savings,
    }
  })
}

// Generate data for each quarter in a year
const generateQuarterlyData = (dateRange: DateRange) => {
  const quarters = eachQuarterOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  })

  return quarters.map((quarter) => {
    const quarterLabel = `Q${Math.floor(quarter.getMonth() / 3) + 1}`

    // Generate random data for demo purposes
    const income = 12000 + Math.random() * 3000
    const expenses = 7500 + Math.random() * 2000
    const savings = income - expenses

    return {
      name: quarterLabel,
      date: `${quarterLabel} ${format(quarter, "yyyy")}`,
      Income: income,
      Expenses: expenses,
      Savings: savings,
    }
  })
}

// Original monthly data for backward compatibility
const originalData = [
  {
    name: "Jan",
    Income: 4000,
    Expenses: 2400,
    Savings: 1600,
  },
  {
    name: "Feb",
    Income: 4200,
    Expenses: 2800,
    Savings: 1400,
  },
  {
    name: "Mar",
    Income: 4100,
    Expenses: 2700,
    Savings: 1400,
  },
  {
    name: "Apr",
    Income: 4500,
    Expenses: 2900,
    Savings: 1600,
  },
  {
    name: "May",
    Income: 4300,
    Expenses: 3100,
    Savings: 1200,
  },
  {
    name: "Jun",
    Income: 4800,
    Expenses: 3000,
    Savings: 1800,
  },
]

interface OverviewProps {
  timePeriod: TimePeriod
  dateRange: DateRange
}

export function Overview({ timePeriod, dateRange }: OverviewProps) {
  const data = useMemo(() => {
    // If date range is invalid, return original data
    if (dateRange.from > dateRange.to) {
      return originalData
    }

    switch (timePeriod) {
      case "week":
        // For weekly view, show daily data
        return generateDailyData(dateRange)
      case "month":
        // For monthly view, show weekly data
        return generateWeeklyData(dateRange)
      case "quarter":
        // For quarterly view, show monthly data
        return generateMonthlyData(dateRange)
      case "year":
        // For yearly view, show monthly data
        return generateMonthlyData(dateRange)
      case "custom":
        // For custom, determine the appropriate interval based on the date range
        const daysDiff = differenceInDays(dateRange.to, dateRange.from)
        const weeksDiff = differenceInWeeks(dateRange.to, dateRange.from)
        const monthsDiff = differenceInMonths(dateRange.to, dateRange.from)

        if (daysDiff <= 14) {
          // If less than 2 weeks, show daily data
          return generateDailyData(dateRange)
        } else if (daysDiff <= 90) {
          // If less than 3 months, show weekly data
          return generateWeeklyData(dateRange)
        } else if (monthsDiff <= 24) {
          // If less than 2 years, show monthly data
          return generateMonthlyData(dateRange)
        } else {
          // If more than 2 years, show quarterly data
          return generateQuarterlyData(dateRange)
        }
      default:
        return originalData
    }
  }, [timePeriod, dateRange])

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`
    }
    return `${value}`
  }

  const formatTooltipValue = (value: number) => {
    return `${formatCurrency(value)}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload

      return (
        <div className="bg-background border rounded p-2 shadow-md">
          <p className="font-medium">{dataPoint.date || label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: ${formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <div className="w-full h-[250px] sm:h-[300px] md:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 5, left: 0, bottom: 15 }}
          barSize={window.innerWidth < 640 ? 15 : 20}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} tickMargin={8} />
          <YAxis tickFormatter={formatYAxis} tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} width={30} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: window.innerWidth < 640 ? "10px" : "12px", marginTop: "5px" }} />
          <Bar dataKey="Income" fill="#22c55e" />
          <Bar dataKey="Expenses" fill="#ef4444" />
          <Bar dataKey="Savings" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
