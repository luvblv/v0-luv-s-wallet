"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import { ArrowUpRight, Plus, RefreshCw, Clock, FileText } from "lucide-react"
import { type Transaction, TransactionDetails } from "./transaction-details"
import { v4 as uuidv4 } from "uuid"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CsvImporter } from "./csv-importer"
import { formatDistanceToNow } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Goal {
  id: string
  name: string
  category: string
  currentAmount: number
  targetAmount: number
  targetDate: string
  transactions: Transaction[]
  lastUpdated: Date | string
  updateMethod?: "plaid" | "csv" | "manual"
}

export function FinancialGoals() {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)

  // Sample goals data
  const goals: Goal[] = [
    {
      id: "1",
      name: "New Car",
      category: "Purchase",
      currentAmount: 5200,
      targetAmount: 15000,
      targetDate: "2024-06-30",
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      updateMethod: "manual",
      transactions: [
        {
          id: uuidv4(),
          date: "2023-04-15",
          amount: 300,
          description: "Monthly Contribution",
          category: "Deposit",
          type: "income",
          status: "completed",
          notes: "Regular monthly deposit",
        },
        {
          id: uuidv4(),
          date: "2023-04-01",
          amount: 8.67,
          description: "Interest Earned",
          category: "Interest",
          type: "income",
          status: "completed",
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-03-15",
          amount: 300,
          description: "Monthly Contribution",
          category: "Deposit",
          type: "income",
          status: "completed",
          notes: "Regular monthly deposit",
        },
        {
          id: uuidv4(),
          date: "2023-03-01",
          amount: 8.15,
          description: "Interest Earned",
          category: "Interest",
          type: "income",
          status: "completed",
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-02-15",
          amount: 300,
          description: "Monthly Contribution",
          category: "Deposit",
          type: "income",
          status: "completed",
          notes: "Regular monthly deposit",
        },
      ],
    },
    {
      id: "2",
      name: "European Vacation",
      category: "Travel",
      currentAmount: 3500,
      targetAmount: 8000,
      targetDate: "2023-12-15",
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      updateMethod: "csv",
      transactions: [
        {
          id: uuidv4(),
          date: "2023-04-15",
          amount: 250,
          description: "Monthly Contribution",
          category: "Deposit",
          type: "income",
          status: "completed",
          notes: "Regular monthly deposit",
        },
        {
          id: uuidv4(),
          date: "2023-04-01",
          amount: 5.42,
          description: "Interest Earned",
          category: "Interest",
          type: "income",
          status: "completed",
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-03-15",
          amount: 250,
          description: "Monthly Contribution",
          category: "Deposit",
          type: "income",
          status: "completed",
          notes: "Regular monthly deposit",
        },
        {
          id: uuidv4(),
          date: "2023-03-01",
          amount: 4.98,
          description: "Interest Earned",
          category: "Interest",
          type: "income",
          status: "completed",
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-02-15",
          amount: 250,
          description: "Monthly Contribution",
          category: "Deposit",
          type: "income",
          status: "completed",
          notes: "Regular monthly deposit",
        },
      ],
    },
    {
      id: "3",
      name: "Home Renovation",
      category: "Home",
      currentAmount: 7800,
      targetAmount: 25000,
      targetDate: "2024-09-30",
      lastUpdated: new Date(), // Just now
      updateMethod: "manual",
      transactions: [
        {
          id: uuidv4(),
          date: "2023-04-15",
          amount: 500,
          description: "Monthly Contribution",
          category: "Deposit",
          type: "income",
          status: "completed",
          notes: "Regular monthly deposit",
        },
        {
          id: uuidv4(),
          date: "2023-04-01",
          amount: 12.17,
          description: "Interest Earned",
          category: "Interest",
          type: "income",
          status: "completed",
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-03-15",
          amount: 500,
          description: "Monthly Contribution",
          category: "Deposit",
          type: "income",
          status: "completed",
          notes: "Regular monthly deposit",
        },
        {
          id: uuidv4(),
          date: "2023-03-01",
          amount: 11.38,
          description: "Interest Earned",
          category: "Interest",
          type: "income",
          status: "completed",
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-02-15",
          amount: 1000,
          description: "Bonus Contribution",
          category: "Deposit",
          type: "income",
          status: "completed",
          notes: "Tax refund contribution",
        },
      ],
    },
  ]

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal)
    setIsTransactionModalOpen(true)
  }

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    // In a real app, this would update the database
    console.log("Adding transaction:", transaction)
  }

  const formatLastUpdated = (date: Date | string) => {
    if (typeof date === "string") {
      date = new Date(date)
    }
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const getUpdateMethodIcon = (method?: string) => {
    switch (method) {
      case "plaid":
        return <RefreshCw className="h-3 w-3 mr-1" />
      case "csv":
        return <FileText className="h-3 w-3 mr-1" />
      case "manual":
        return <Clock className="h-3 w-3 mr-1" />
      default:
        return <Clock className="h-3 w-3 mr-1" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Financial Goals</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add/Update Goal
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("Manual add goal")}>Add Goal Manually</DropdownMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Import from CSV</DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle>Import Goals from CSV</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <CsvImporter
                    onImport={(data) => {
                      console.log("Imported data:", data)
                      // Here you would process the imported data
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {goals.map((goal) => {
          const percentComplete = (goal.currentAmount / goal.targetAmount) * 100

          return (
            <Card
              key={goal.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleGoalClick(goal)}
            >
              <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
                <CardTitle>{goal.name}</CardTitle>
                <CardDescription>
                  {goal.category} • Target: {goal.targetDate}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 md:space-y-4 p-3 sm:p-4 pt-0 sm:pt-0">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-medium">
                      ${formatCurrency(goal.currentAmount)} of ${formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  <Progress value={percentComplete} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>${formatCurrency(goal.targetAmount - goal.currentAmount)} to go</span>
                    <span>{percentComplete.toFixed(0)}% Complete</span>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {getUpdateMethodIcon(goal.updateMethod)}
                        <span>Updated {formatLastUpdated(goal.lastUpdated)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Last updated via {goal.updateMethod || "unknown"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
              <CardFooter className="pt-0 sm:pt-1 p-3 sm:p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={(e) => {
                    e.stopPropagation() // Prevent opening the transaction modal
                    console.log(`Add funds to ${goal.name}`)
                  }}
                >
                  <span>Add Funds</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {selectedGoal && (
        <TransactionDetails
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          title={`${selectedGoal.name} Transactions`}
          description={`Current Amount: $${formatCurrency(selectedGoal.currentAmount)} • Target: $${formatCurrency(selectedGoal.targetAmount)} by ${selectedGoal.targetDate}`}
          transactions={selectedGoal.transactions}
          itemName={selectedGoal.name}
          allowAddTransaction={true}
          onAddTransaction={handleAddTransaction}
          lastUpdated={selectedGoal.lastUpdated}
          updateMethod={selectedGoal.updateMethod}
        />
      )}
    </div>
  )
}
