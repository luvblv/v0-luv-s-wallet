"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"
import type { InvestmentResult } from "@/types/investment"
import { ClientOnly } from "@/components/client-only"

interface InvestmentTableProps {
  result: InvestmentResult
}

export function InvestmentTable({ result }: InvestmentTableProps) {
  const [displayMode, setDisplayMode] = useState<"all" | "5year" | "10year">("all")

  // Filter the schedule based on display mode
  const filteredSchedule = result.schedule.filter((item) => {
    if (displayMode === "all") return true
    if (displayMode === "5year") return item.year % 5 === 0 || item.year === 1 || item.year === result.schedule.length
    if (displayMode === "10year") return item.year % 10 === 0 || item.year === 1 || item.year === result.schedule.length
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex items-center space-x-2 bg-muted rounded-md p-1 text-xs">
          <button
            onClick={() => setDisplayMode("all")}
            className={`px-2 py-1 rounded ${
              displayMode === "all" ? "bg-background shadow-sm" : "hover:bg-background/50"
            }`}
          >
            All Years
          </button>
          <button
            onClick={() => setDisplayMode("5year")}
            className={`px-2 py-1 rounded ${
              displayMode === "5year" ? "bg-background shadow-sm" : "hover:bg-background/50"
            }`}
          >
            5 Year Intervals
          </button>
          <button
            onClick={() => setDisplayMode("10year")}
            className={`px-2 py-1 rounded ${
              displayMode === "10year" ? "bg-background shadow-sm" : "hover:bg-background/50"
            }`}
          >
            10 Year Intervals
          </button>
        </div>
      </div>

      <ClientOnly>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Starting Balance</TableHead>
                <TableHead>Contributions</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Ending Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedule.map((yearData) => (
                <TableRow key={yearData.year}>
                  <TableCell>{yearData.year}</TableCell>
                  <TableCell>{formatCurrency(yearData.startBalance)}</TableCell>
                  <TableCell>{formatCurrency(yearData.contributions)}</TableCell>
                  <TableCell>{formatCurrency(yearData.interest)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(yearData.endBalance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ClientOnly>
    </div>
  )
}
