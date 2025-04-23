"use client"

import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ArrowDownIcon,
  ShoppingBag,
  Home,
  Car,
  Coffee,
  Utensils,
  CreditCard,
  Briefcase,
  Smartphone,
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { DateRange, TimePeriod } from "@/components/time-period-filter"
import { useMemo } from "react"
import { isWithinInterval, parseISO, format } from "date-fns"

// Sample transaction data
const allTransactions = [
  {
    id: "1",
    description: "Grocery Shopping",
    amount: -120.5,
    date: "2025-03-22", // Today
    category: "Food",
    icon: ShoppingBag,
  },
  {
    id: "2",
    description: "Salary Deposit",
    amount: 2400.0,
    date: "2025-03-21", // Yesterday
    category: "Income",
    icon: ArrowDownIcon,
  },
  {
    id: "3",
    description: "Rent Payment",
    amount: -1200.0,
    date: "2025-03-01",
    category: "Housing",
    icon: Home,
  },
  {
    id: "4",
    description: "Car Insurance",
    amount: -89.99,
    date: "2025-02-28",
    category: "Insurance",
    icon: Car,
  },
  {
    id: "5",
    description: "Coffee Shop",
    amount: -4.5,
    date: "2025-02-27",
    category: "Food",
    icon: Coffee,
  },
  {
    id: "6",
    description: "Restaurant Dinner",
    amount: -65.3,
    date: "2025-02-26",
    category: "Food",
    icon: Utensils,
  },
  {
    id: "7",
    description: "Credit Card Payment",
    amount: -450.0,
    date: "2025-02-15",
    category: "Debt",
    icon: CreditCard,
  },
  {
    id: "8",
    description: "Freelance Income",
    amount: 850.0,
    date: "2025-02-10",
    category: "Income",
    icon: Briefcase,
  },
  {
    id: "9",
    description: "Phone Bill",
    amount: -75.0,
    date: "2025-01-25",
    category: "Utilities",
    icon: Smartphone,
  },
  {
    id: "10",
    description: "Bonus Payment",
    amount: 1200.0,
    date: "2025-01-15",
    category: "Income",
    icon: ArrowDownIcon,
  },
  {
    id: "11",
    description: "Grocery Shopping",
    amount: -95.75,
    date: "2025-01-10",
    category: "Food",
    icon: ShoppingBag,
  },
  {
    id: "12",
    description: "Restaurant Dinner",
    amount: -78.5,
    date: "2025-01-05",
    category: "Food",
    icon: Utensils,
  },
]

interface RecentTransactionsProps {
  timePeriod?: TimePeriod
  dateRange?: DateRange
}

export function RecentTransactions({
  timePeriod = "month",
  dateRange = { from: new Date(2025, 2, 1), to: new Date(2025, 2, 31) },
}: RecentTransactionsProps) {
  const transactions = useMemo(() => {
    // Filter transactions based on date range
    return allTransactions
      .filter((transaction) => {
        const transactionDate = parseISO(transaction.date)
        return isWithinInterval(transactionDate, { start: dateRange.from, end: dateRange.to })
      })
      .slice(0, 6) // Show only the 6 most recent transactions
  }, [dateRange])

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
      return "Today"
    } else if (format(date, "yyyy-MM-dd") === format(yesterday, "yyyy-MM-dd")) {
      return "Yesterday"
    } else {
      return format(date, "MMM d")
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center">
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border flex-shrink-0">
              <transaction.icon className="h-3 w-3 sm:h-4 sm:w-4" />
            </Avatar>
            <div className="ml-3 sm:ml-4 space-y-0 sm:space-y-1 flex-grow min-w-0">
              <p className="text-sm font-medium leading-none truncate">{transaction.description}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
            </div>
            <div className="ml-auto font-medium text-right flex-shrink-0">
              <span className={transaction.amount > 0 ? "text-green-500" : "text-red-500"}>
                {transaction.amount > 0 ? "+" : ""}${formatCurrency(Math.abs(transaction.amount))}
              </span>
            </div>
            <Badge variant="outline" className="ml-2 hidden sm:inline-flex text-xs whitespace-nowrap">
              {transaction.category}
            </Badge>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-muted-foreground">No transactions found for this time period.</div>
      )}
    </div>
  )
}
