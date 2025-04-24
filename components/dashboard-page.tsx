"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { AccountSummary } from "@/components/account-summary"
import { FinancialGoals } from "@/components/financial-goals"
import { AddTransactionForm } from "@/components/add-transaction-form"
import { Button } from "@/components/ui/button"
import { Info, Eye, EyeOff, ExternalLink, BanknoteIcon as Bank } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { TimePeriodFilter, type TimePeriod, type DateRange } from "@/components/time-period-filter"
import { startOfMonth, endOfMonth } from "date-fns"
import { MiniLineChart } from "@/components/mini-line-chart"
import {
  calculateNetWorth,
  calculateTotalAssets,
  calculateTotalLiabilities,
  generateNetWorthHistory,
  calculatePeriodChange,
  type Account,
  type Loan,
  type SavingsAccount,
} from "@/lib/net-worth"
import Link from "next/link"

// Initial sample data for accounts, loans, and savings
const initialAccounts = [
  {
    id: "1",
    name: "Main Checking",
    type: "checking",
    balance: 4580.21,
    institution: "Chase Bank",
    lastUpdated: "Today",
  },
  {
    id: "2",
    name: "Savings Account",
    type: "savings",
    balance: 8000.0,
    institution: "Chase Bank",
    lastUpdated: "Today",
  },
  {
    id: "3",
    name: "Credit Card",
    type: "credit",
    balance: -1250.3,
    limit: 5000,
    institution: "American Express",
    lastUpdated: "Yesterday",
  },
]

const initialLoans = [
  {
    id: "1",
    name: "Mortgage",
    originalAmount: 250000,
    currentBalance: 198450.32,
    interestRate: 3.25,
    monthlyPayment: 1087.62,
    nextPaymentDate: "Apr 1, 2025",
    loanType: "mortgage",
  },
  {
    id: "2",
    name: "Car Loan",
    originalAmount: 28000,
    currentBalance: 12450.75,
    interestRate: 4.5,
    monthlyPayment: 450.3,
    nextPaymentDate: "Mar 15, 2025",
    loanType: "car",
  },
  {
    id: "3",
    name: "Student Loan",
    originalAmount: 45000,
    currentBalance: 22340.18,
    interestRate: 5.25,
    monthlyPayment: 380.45,
    nextPaymentDate: "Mar 21, 2025",
    loanType: "student",
  },
]

const initialSavingsAccounts = [
  {
    id: "1",
    name: "Emergency Fund",
    currentAmount: 12000,
    targetAmount: 15000,
    monthlyContribution: 300,
    savingsType: "emergency",
  },
  {
    id: "2",
    name: "Vacation Fund",
    currentAmount: 2450,
    targetAmount: 5000,
    monthlyContribution: 200,
    targetDate: "Dec 2025",
    savingsType: "vacation",
  },
  {
    id: "3",
    name: "House Down Payment",
    currentAmount: 35000,
    targetAmount: 60000,
    monthlyContribution: 800,
    targetDate: "Jun 2026",
    savingsType: "house",
  },
  {
    id: "4",
    name: "Retirement",
    currentAmount: 78500,
    monthlyContribution: 500,
    savingsType: "retirement",
  },
]

export default function DashboardPage() {
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<TimePeriod>("month")
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })
  const [hideNetWorth, setHideNetWorth] = useState(false)

  // State for financial data
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts)
  const [loans, setLoans] = useState<Loan[]>(initialLoans)
  const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>(initialSavingsAccounts)

  // State for net worth data
  const [currentNetWorth, setCurrentNetWorth] = useState(0)
  const [totalAssets, setTotalAssets] = useState(0)
  const [totalLiabilities, setTotalLiabilities] = useState(0)
  const [periodChange, setPeriodChange] = useState({ amount: 0, percentage: 0 })
  const [netWorthHistory, setNetWorthHistory] = useState<Array<{ value: number; date: string }>>([])

  // Calculate net worth when financial data or time period changes
  useEffect(() => {
    // Calculate current net worth
    const netWorth = calculateNetWorth(accounts, loans, savingsAccounts)
    setCurrentNetWorth(netWorth)

    // Calculate total assets and liabilities
    const assets = calculateTotalAssets(accounts, savingsAccounts)
    const liabilities = calculateTotalLiabilities(accounts, loans)
    setTotalAssets(assets)
    setTotalLiabilities(liabilities)

    // Generate historical net worth data based on selected time period
    const history = generateNetWorthHistory(accounts, loans, savingsAccounts, selectedTimePeriod, dateRange)
    setNetWorthHistory(history)

    // Calculate period change
    const change = calculatePeriodChange(history)
    setPeriodChange(change)
  }, [accounts, loans, savingsAccounts, selectedTimePeriod, dateRange])

  // Calculate summary data based on the selected time period
  const getSummaryData = () => {
    // In a real app, this would filter actual transaction data
    // For demo purposes, we'll return different values based on the time period
    switch (selectedTimePeriod) {
      case "week":
        return {
          balance: 12580,
          income: 1095,
          expenses: 720,
          savingsRate: 34.2,
          changeBalance: 375,
          changeIncome: 3.1,
          changeExpenses: 5.2,
          changeSavingsRate: -2.1,
        }
      case "month":
        return {
          balance: 12580,
          income: 4395,
          expenses: 2860,
          savingsRate: 34.9,
          changeBalance: 1245,
          changeIncome: 2.5,
          changeExpenses: 18.1,
          changeSavingsRate: -4.0,
        }
      case "quarter":
        return {
          balance: 12580,
          income: 13185,
          expenses: 8580,
          savingsRate: 34.9,
          changeBalance: 3735,
          changeIncome: 4.2,
          changeExpenses: 12.5,
          changeSavingsRate: -2.8,
        }
      case "year":
        return {
          balance: 12580,
          income: 52740,
          expenses: 34320,
          savingsRate: 34.9,
          changeBalance: 14940,
          changeIncome: 5.8,
          changeExpenses: 8.3,
          changeSavingsRate: 1.2,
        }
      default:
        // Custom period - calculate based on date range
        // For demo, we'll just return the monthly values
        return {
          balance: 12580,
          income: 4395,
          expenses: 2860,
          savingsRate: 34.9,
          changeBalance: 1245,
          changeIncome: 2.5,
          changeExpenses: 18.1,
          changeSavingsRate: -4.0,
        }
    }
  }

  const summaryData = getSummaryData()

  // Get the period label based on selected time period
  const getPeriodLabel = () => {
    switch (selectedTimePeriod) {
      case "week":
        return "Week"
      case "month":
        return "Month"
      case "quarter":
        return "Quarter"
      case "year":
        return "Year"
      default:
        return "Period"
    }
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto py-3 sm:py-4 md:py-6 px-3 sm:px-4 md:px-6">
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-3 sm:mb-4 md:mb-6 gap-3 sm:gap-4">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>

      {/* Daily, Weekly, Monthly Spending Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-3 mb-4 sm:mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-sm font-medium">What I Spent Today</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(85.42)}</div>
            <p className="text-xs text-muted-foreground">{-12.5}% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-sm font-medium">What I Spent This Week</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(437.65)}</div>
            <p className="text-xs text-muted-foreground">{+8.3}% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-sm font-medium">What I Spent This Month</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(1842.3)}</div>
            <p className="text-xs text-muted-foreground">{-3.7}% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 sm:mb-6">
        <TimePeriodFilter
          selectedPeriod={selectedTimePeriod}
          dateRange={dateRange}
          onPeriodChange={setSelectedTimePeriod}
          onDateRangeChange={setDateRange}
        />
      </div>

      {accounts.length === 0 && (
        <Card className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-shrink-0 bg-white p-3 rounded-full">
                <Bank className="h-8 w-8 text-blue-500" />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-lg font-medium mb-1">Connect Your Accounts</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Get started by connecting your bank accounts or importing your financial data
                </p>
                <Button asChild>
                  <Link href="/connect-accounts">Connect Accounts</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showAddTransaction && (
        <Card className="mb-4">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Add New Transaction</CardTitle>
            <CardDescription>Record a new expense or income</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <AddTransactionForm onComplete={() => setShowAddTransaction(false)} />
          </CardContent>
        </Card>
      )}

      {/* Net Worth Card - With chart next to values */}
      <Card className="mb-4 sm:mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <h3 className="text-lg sm:text-xl text-gray-600 font-medium">Net Worth</h3>
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 ml-2" />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setHideNetWorth(!hideNetWorth)} className="h-8 w-8">
                {hideNetWorth ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Left side - Net Worth Value and Change */}
            <div>
              <div className="mb-4 sm:mb-6">
                <h2
                  className={`text-3xl sm:text-5xl font-bold flex items-center ${!hideNetWorth && (currentNetWorth >= 0 ? "text-green-600" : "text-red-600")}`}
                >
                  {!hideNetWorth ? (
                    <>
                      {currentNetWorth >= 0 ? "+" : "-"}
                      {formatCurrency(Math.abs(currentNetWorth))}
                    </>
                  ) : (
                    "$••••••"
                  )}
                </h2>
              </div>

              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl text-gray-600 font-medium mb-1">{getPeriodLabel()} Change</h3>
                <p
                  className={`text-xl sm:text-2xl font-bold ${periodChange.amount >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {periodChange.amount >= 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(periodChange.amount))} ({periodChange.percentage}%)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Assets</p>
                  <p className="font-medium">{hideNetWorth ? "$••••••" : formatCurrency(totalAssets)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Liabilities</p>
                  <p className="font-medium">{hideNetWorth ? "$••••••" : formatCurrency(totalLiabilities)}</p>
                </div>
              </div>
            </div>

            {/* Right side - Chart */}
            <div className="h-[200px] md:h-full bg-blue-50 rounded-lg">
              <MiniLineChart
                data={netWorthHistory}
                color="#3b82f6"
                height="100%"
                showGrid={true}
                showAxis={true}
                timePeriod={selectedTimePeriod}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 xs:grid-cols-2 md:grid-cols-4 mb-3 sm:mb-4 md:mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(summaryData.balance)}</div>
            <p className="text-xs text-muted-foreground">
              +{formatCurrency(summaryData.changeBalance)} from last {selectedTimePeriod}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-sm font-medium">
              {selectedTimePeriod.charAt(0).toUpperCase() + selectedTimePeriod.slice(1)}ly Income
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(summaryData.income)}</div>
            <p className="text-xs text-muted-foreground">
              +{summaryData.changeIncome}% from last {selectedTimePeriod}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-sm font-medium">
              {selectedTimePeriod.charAt(0).toUpperCase() + selectedTimePeriod.slice(1)}ly Expenses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(summaryData.expenses)}</div>
            <p className="text-xs text-muted-foreground">
              +{summaryData.changeExpenses}% from last {selectedTimePeriod}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{summaryData.savingsRate}%</div>
            <p className="text-xs text-muted-foreground">
              {summaryData.changeSavingsRate >= 0 ? "+" : ""}
              {summaryData.changeSavingsRate}% from last {selectedTimePeriod}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="w-full overflow-x-auto flex flex-nowrap justify-start sm:justify-center p-0.5 h-auto">
          <div className="flex min-w-full sm:min-w-0 px-1">
            <TabsTrigger value="overview" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-1.5 h-auto">
              Overview
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-1.5 h-auto">
              Accounts
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-1.5 h-auto">
              Goals
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2 p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[500px]">
                    <Overview timePeriod={selectedTimePeriod} dateRange={dateRange} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
                <CardDescription>You made 12 transactions this {selectedTimePeriod}.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <RecentTransactions timePeriod={selectedTimePeriod} dateRange={dateRange} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="accounts" className="space-y-4">
          <AccountSummary />
        </TabsContent>
        <TabsContent value="goals" className="space-y-4">
          <FinancialGoals />
        </TabsContent>
      </Tabs>
    </div>
  )
}
