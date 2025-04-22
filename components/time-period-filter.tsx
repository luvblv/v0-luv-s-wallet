"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Filter } from "lucide-react"
import {
  format,
  subDays,
  subMonths,
  subYears,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from "date-fns"
import { cn } from "@/lib/utils"

export type TimePeriod = "week" | "month" | "quarter" | "year" | "custom"
export type DateRange = { from: Date; to: Date }

interface TimePeriodFilterProps {
  onPeriodChange: (period: TimePeriod) => void
  onDateRangeChange: (range: DateRange) => void
  selectedPeriod: TimePeriod
  dateRange: DateRange
}

export function TimePeriodFilter({
  onPeriodChange,
  onDateRangeChange,
  selectedPeriod,
  dateRange,
}: TimePeriodFilterProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handlePeriodChange = (value: string) => {
    const period = value as TimePeriod
    onPeriodChange(period)

    const today = new Date()
    let from: Date
    let to: Date = today

    switch (period) {
      case "week":
        from = startOfWeek(today)
        to = endOfWeek(today)
        break
      case "month":
        from = startOfMonth(today)
        to = endOfMonth(today)
        break
      case "quarter":
        from = startOfQuarter(today)
        to = endOfQuarter(today)
        break
      case "year":
        from = startOfYear(today)
        to = endOfYear(today)
        break
      default:
        // Keep current date range for custom
        from = dateRange.from
        to = dateRange.to
    }

    onDateRangeChange({ from, to })
  }

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    if (range.from && range.to) {
      onDateRangeChange({ from: range.from, to: range.to })
      onPeriodChange("custom")
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-center">
      <div className="flex items-center">
        <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Time Period:</span>
      </div>

      <Tabs value={selectedPeriod} onValueChange={handlePeriodChange} className="w-full sm:w-auto">
        <TabsList className="grid grid-cols-4 sm:grid-cols-5 w-full sm:w-auto">
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="quarter">Quarter</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
          <TabsTrigger value="custom" className="hidden sm:block">
            Custom
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal w-full sm:w-auto",
              selectedPeriod !== "custom" && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedPeriod === "custom"
              ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
              : "Custom Range"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange.from}
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                handleDateRangeChange(range)
                setIsCalendarOpen(false)
              }
            }}
            numberOfMonths={2}
            initialFocus
          />
          <div className="flex items-center justify-between p-3 border-t">
            <Select
              onValueChange={(value) => {
                const today = new Date()
                let from: Date

                switch (value) {
                  case "7days":
                    from = subDays(today, 7)
                    break
                  case "30days":
                    from = subDays(today, 30)
                    break
                  case "90days":
                    from = subDays(today, 90)
                    break
                  case "6months":
                    from = subMonths(today, 6)
                    break
                  case "1year":
                    from = subYears(today, 1)
                    break
                  default:
                    from = subDays(today, 30)
                }

                handleDateRangeChange({ from, to: today })
                setIsCalendarOpen(false)
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => setIsCalendarOpen(false)}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
