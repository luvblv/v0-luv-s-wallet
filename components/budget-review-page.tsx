"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, ArrowLeft, Plus, Save, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import Link from "next/link"
import { format, addMonths, subMonths } from "date-fns"

// Define budget category type
interface BudgetCategory {
  id: string
  name: string
  budgeted: number
  actual: number
}

export function BudgetReviewPage() {
  // State for current month
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isCurrentMonth, setIsCurrentMonth] = useState(true)

  // State for income, savings goal, and spending goal
  const [monthlyIncome, setMonthlyIncome] = useState(5000)
  const [savingsGoal, setSavingsGoal] = useState(1000)
  const [spendingGoal, setSpendingGoal] = useState(4000)

  // State for budget categories
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: "1", name: "Housing", budgeted: 1500, actual: 1450 },
    { id: "2", name: "Groceries", budgeted: 600, actual: 720 },
    { id: "3", name: "Transportation", budgeted: 400, actual: 385 },
    { id: "4", name: "Utilities", budgeted: 300, actual: 310 },
    { id: "5", name: "Entertainment", budgeted: 200, actual: 275 },
    { id: "6", name: "Dining Out", budgeted: 300, actual: 420 },
    { id: "7", name: "Healthcare", budgeted: 150, actual: 95 },
    { id: "8", name: "Personal Care", budgeted: 100, actual: 115 },
    { id: "9", name: "Subscriptions", budgeted: 50, actual: 65 },
    { id: "10", name: "Miscellaneous", budgeted: 400, actual: 325 },
  ])

  // State for new category
  const [newCategory, setNewCategory] = useState("")
  const [newBudgetAmount, setNewBudgetAmount] = useState("")

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const prevMonth = subMonths(currentDate, 1)
    setCurrentDate(prevMonth)
    setIsCurrentMonth(false)
    loadBudgetData(prevMonth)
  }

  // Navigate to next month
  const goToNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1)
    const now = new Date()

    // Don't allow navigating to future months
    if (nextMonth.getMonth() > now.getMonth() && nextMonth.getFullYear() >= now.getFullYear()) {
      return
    }

    setCurrentDate(nextMonth)
    setIsCurrentMonth(nextMonth.getMonth() === now.getMonth() && nextMonth.getFullYear() === now.getFullYear())
    loadBudgetData(nextMonth)
  }

  // Simulate loading budget data for a specific month
  const loadBudgetData = (date: Date) => {
    // In a real app, this would fetch data from an API or database
    // For demo purposes, we'll generate some sample data based on the month

    const monthIndex = date.getMonth()
    const year = date.getFullYear()

    // Generate different data for different months
    if (monthIndex === new Date().getMonth() && year === new Date().getFullYear()) {
      // Current month - use the default data
      setMonthlyIncome(5000)
      setSavingsGoal(1000)
      setSpendingGoal(4000)
      setCategories([
        { id: "1", name: "Housing", budgeted: 1500, actual: 1450 },
        { id: "2", name: "Groceries", budgeted: 600, actual: 720 },
        { id: "3", name: "Transportation", budgeted: 400, actual: 385 },
        { id: "4", name: "Utilities", budgeted: 300, actual: 310 },
        { id: "5", name: "Entertainment", budgeted: 200, actual: 275 },
        { id: "6", name: "Dining Out", budgeted: 300, actual: 420 },
        { id: "7", name: "Healthcare", budgeted: 150, actual: 95 },
        { id: "8", name: "Personal Care", budgeted: 100, actual: 115 },
        { id: "9", name: "Subscriptions", budgeted: 50, actual: 65 },
        { id: "10", name: "Miscellaneous", budgeted: 400, actual: 325 },
      ])
    } else {
      // Past months - generate some variation
      const monthFactor = (monthIndex + 1) / 12 // 0.08 to 1.0

      setMonthlyIncome(4800 + Math.floor(monthFactor * 400))
      setSavingsGoal(800 + Math.floor(monthFactor * 300))
      setSpendingGoal(3800 + Math.floor(monthFactor * 400))

      setCategories([
        { id: "1", name: "Housing", budgeted: 1500, actual: 1500 - Math.floor(Math.random() * 100) },
        {
          id: "2",
          name: "Groceries",
          budgeted: 550 + Math.floor(monthFactor * 100),
          actual: 600 + Math.floor(Math.random() * 150),
        },
        {
          id: "3",
          name: "Transportation",
          budgeted: 350 + Math.floor(monthFactor * 100),
          actual: 375 - Math.floor(Math.random() * 50),
        },
        {
          id: "4",
          name: "Utilities",
          budgeted: 280 + Math.floor(monthFactor * 40),
          actual: 290 + Math.floor(Math.random() * 40),
        },
        {
          id: "5",
          name: "Entertainment",
          budgeted: 180 + Math.floor(monthFactor * 40),
          actual: 200 + Math.floor(Math.random() * 100),
        },
        {
          id: "6",
          name: "Dining Out",
          budgeted: 250 + Math.floor(monthFactor * 100),
          actual: 350 + Math.floor(Math.random() * 100),
        },
        { id: "7", name: "Healthcare", budgeted: 150, actual: 80 + Math.floor(Math.random() * 100) },
        { id: "8", name: "Personal Care", budgeted: 100, actual: 90 + Math.floor(Math.random() * 40) },
        { id: "9", name: "Subscriptions", budgeted: 50, actual: 50 + Math.floor(Math.random() * 20) },
        {
          id: "10",
          name: "Miscellaneous",
          budgeted: 350 + Math.floor(monthFactor * 100),
          actual: 300 + Math.floor(Math.random() * 100),
        },
      ])
    }
  }

  // Calculate totals
  const totalBudgeted = categories.reduce((sum, category) => sum + category.budgeted, 0)
  const totalActual = categories.reduce((sum, category) => sum + category.actual, 0)
  const totalDifference = totalBudgeted - totalActual

  // Calculate remaining budget
  const remainingBudget = monthlyIncome - savingsGoal - totalBudgeted

  // Add new category
  const handleAddCategory = () => {
    if (newCategory.trim() === "" || !newBudgetAmount || Number.parseFloat(newBudgetAmount) <= 0) {
      return
    }

    const newCategoryItem: BudgetCategory = {
      id: Date.now().toString(),
      name: newCategory,
      budgeted: Number.parseFloat(newBudgetAmount),
      actual: 0,
    }

    setCategories([...categories, newCategoryItem])
    setNewCategory("")
    setNewBudgetAmount("")
  }

  // Delete category
  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id))
  }

  // Update category budgeted amount
  const handleUpdateBudgeted = (id: string, value: string) => {
    const amount = Number.parseFloat(value) || 0
    setCategories(categories.map((category) => (category.id === id ? { ...category, budgeted: amount } : category)))
  }

  // Update category actual amount
  const handleUpdateActual = (id: string, value: string) => {
    const amount = Number.parseFloat(value) || 0
    setCategories(categories.map((category) => (category.id === id ? { ...category, actual: amount } : category)))
  }

  // Save budget
  const handleSaveBudget = () => {
    // In a real app, this would save to a database
    console.log("Saving budget:", {
      monthlyIncome,
      savingsGoal,
      spendingGoal,
      categories,
    })
    // Show success message
    alert("Budget saved successfully!")
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth} className="h-8 w-8 rounded-r-none">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Month</span>
            </Button>
            <div className="px-4 py-1 border-y text-sm font-medium min-w-[140px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextMonth}
              disabled={isCurrentMonth}
              className="h-8 w-8 rounded-l-none"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Month</span>
            </Button>
          </div>
          <Button onClick={handleSaveBudget} disabled={!isCurrentMonth}>
            <Save className="h-4 w-4 mr-2" />
            Save Budget
          </Button>
        </div>
      </div>

      {!isCurrentMonth && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md mb-4">
          <p className="text-sm">You are viewing a past budget. Changes cannot be saved for previous months.</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income</CardTitle>
            <CardDescription>Set your total monthly income</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="monthly-income">Income Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input
                  id="monthly-income"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number.parseFloat(e.target.value) || 0)}
                  className="pl-7"
                  disabled={!isCurrentMonth}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings Goal</CardTitle>
            <CardDescription>How much you want to save this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="savings-goal">Savings Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input
                  id="savings-goal"
                  type="number"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(Number.parseFloat(e.target.value) || 0)}
                  className="pl-7"
                  disabled={!isCurrentMonth}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending Goal</CardTitle>
            <CardDescription>How much you plan to spend this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="spending-goal">Spending Amount</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                <Input
                  id="spending-goal"
                  type="number"
                  value={spendingGoal}
                  onChange={(e) => setSpendingGoal(Number.parseFloat(e.target.value) || 0)}
                  className="pl-7"
                  disabled={!isCurrentMonth}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Budget Categories</CardTitle>
              <CardDescription>Manage your monthly budget by category</CardDescription>
            </div>
            <div className="flex items-end gap-2">
              <div className="space-y-1 flex-grow">
                <Label htmlFor="new-category">Category Name</Label>
                <Input
                  id="new-category"
                  placeholder="New category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  disabled={!isCurrentMonth}
                />
              </div>
              <div className="space-y-1 w-32">
                <Label htmlFor="new-budget">Budget</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                  <Input
                    id="new-budget"
                    type="number"
                    placeholder="Amount"
                    value={newBudgetAmount}
                    onChange={(e) => setNewBudgetAmount(e.target.value)}
                    className="pl-7"
                    disabled={!isCurrentMonth}
                  />
                </div>
              </div>
              <Button onClick={handleAddCategory} className="mb-0.5" disabled={!isCurrentMonth}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Budgeted</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Difference</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => {
                  const difference = category.budgeted - category.actual
                  const isOverBudget = difference < 0

                  return (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="relative w-24 ml-auto">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-1 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            value={category.budgeted}
                            onChange={(e) => handleUpdateBudgeted(category.id, e.target.value)}
                            className="pl-5 h-8 text-right"
                            disabled={!isCurrentMonth}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="relative w-24 ml-auto">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-1 text-muted-foreground">
                            $
                          </span>
                          <Input
                            type="number"
                            value={category.actual}
                            onChange={(e) => handleUpdateActual(category.id, e.target.value)}
                            className="pl-5 h-8 text-right"
                            disabled={!isCurrentMonth}
                          />
                        </div>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${isOverBudget ? "text-red-500" : "text-green-500"}`}
                      >
                        {isOverBudget ? "-" : "+"}
                        {formatCurrency(Math.abs(difference))}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="h-8 w-8"
                          disabled={!isCurrentMonth}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totalBudgeted)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(totalActual)}</TableCell>
                  <TableCell
                    className={`text-right font-bold ${totalDifference < 0 ? "text-red-500" : "text-green-500"}`}
                  >
                    {totalDifference < 0 ? "-" : "+"}
                    {formatCurrency(Math.abs(totalDifference))}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className={remainingBudget < 0 ? "border-red-200" : "border-green-200"}>
          <CardHeader className={remainingBudget < 0 ? "text-red-500" : "text-green-500"}>
            <CardTitle>Budget Summary</CardTitle>
            <CardDescription className="text-current opacity-90">
              {remainingBudget < 0
                ? "Your budget exceeds your income minus savings goal"
                : "Your budget is within your income minus savings goal"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Monthly Income:</span>
                <span className="font-medium">{formatCurrency(monthlyIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span>Savings Goal:</span>
                <span className="font-medium">-{formatCurrency(savingsGoal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Budgeted:</span>
                <span className="font-medium">-{formatCurrency(totalBudgeted)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                <span>Remaining:</span>
                <span className={remainingBudget < 0 ? "text-red-500" : "text-green-500"}>
                  {formatCurrency(remainingBudget)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget vs. Actual</CardTitle>
            <CardDescription>How your actual spending compares to your budget</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Budgeted:</span>
                <span className="font-medium">{formatCurrency(totalBudgeted)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Actual Spending:</span>
                <span className="font-medium">{formatCurrency(totalActual)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                <span>Difference:</span>
                <span className={totalDifference < 0 ? "text-red-500" : "text-green-500"}>
                  {totalDifference < 0 ? "-" : "+"}
                  {formatCurrency(Math.abs(totalDifference))}
                </span>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {totalDifference < 0
                  ? `You've spent ${formatCurrency(Math.abs(totalDifference))} more than budgeted`
                  : `You've spent ${formatCurrency(Math.abs(totalDifference))} less than budgeted`}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
