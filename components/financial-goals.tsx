"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"
import { Plus, RefreshCw, Clock, FileText, ChevronUp, ChevronDown } from "lucide-react"
import { type Transaction, TransactionDetails } from "./transaction-details"
import { v4 as uuidv4 } from "uuid"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
  const [updateAmount, setUpdateAmount] = useState<string>("")
  const [updateType, setUpdateType] = useState<"add" | "subtract">("add")
  const [goals, setGoals] = useState<Goal[]>([
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
  ])

  const handleGoalClick = (goal: Goal) => {
    if (editingGoalId !== goal.id) {
      setSelectedGoal(goal)
      setIsTransactionModalOpen(true)
    }
  }

  const handleAddTransaction = (transaction: Omit<Transaction, "id">, goalId: string) => {
    // In a real app, this would update the database
    console.log("Adding transaction:", transaction)

    // Update the goals state with the new transaction
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id === goalId) {
          // Create a new transaction with ID
          const newTransaction = {
            ...transaction,
            id: uuidv4(),
          }

          // Calculate new current amount
          const newAmount =
            transaction.type === "income"
              ? goal.currentAmount + transaction.amount
              : goal.currentAmount - transaction.amount

          return {
            ...goal,
            currentAmount: newAmount,
            lastUpdated: new Date(),
            transactions: [newTransaction, ...goal.transactions],
          }
        }
        return goal
      }),
    )
  }

  const handleUpdateGoal = (goalId: string) => {
    const amount = Number.parseFloat(updateAmount)

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount greater than 0")
      return
    }

    const goal = goals.find((g) => g.id === goalId)
    if (!goal) return

    // Create a transaction record
    const transaction = {
      date: new Date().toISOString().split("T")[0],
      amount: updateType === "add" ? amount : amount,
      description: updateType === "add" ? "Added to goal" : "Withdrawn from goal",
      category: updateType === "add" ? "Deposit" : "Withdrawal",
      type: updateType === "add" ? "income" : "expense",
      status: "completed",
      notes: `Manual ${updateType === "add" ? "contribution to" : "withdrawal from"} goal`,
    }

    // Add the transaction and update the goal
    handleAddTransaction(transaction, goalId)

    // Reset form
    setUpdateAmount("")
    setUpdateType("add")
    setEditingGoalId(null)
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {goals.map((goal) => {
          const percentComplete = (goal.currentAmount / goal.targetAmount) * 100
          const isEditing = editingGoalId === goal.id

          return (
            <Card
              key={goal.id}
              className={`hover:shadow-md transition-shadow ${isEditing ? "" : "cursor-pointer"}`}
              onClick={isEditing ? undefined : () => handleGoalClick(goal)}
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
                      {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  <Progress value={percentComplete} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatCurrency(goal.targetAmount - goal.currentAmount)} to go</span>
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

                {isEditing && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`amount-${goal.id}`} className="text-sm">
                          Amount
                        </Label>
                        <div className="relative mt-1">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                            $
                          </span>
                          <Input
                            id={`amount-${goal.id}`}
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-7"
                            value={updateAmount}
                            onChange={(e) => setUpdateAmount(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm">Action</Label>
                        <RadioGroup
                          value={updateType}
                          onValueChange={(value) => setUpdateType(value as "add" | "subtract")}
                          className="flex gap-4 mt-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="add" id={`add-${goal.id}`} />
                            <Label htmlFor={`add-${goal.id}`} className="text-sm cursor-pointer">
                              Add
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="subtract" id={`subtract-${goal.id}`} />
                            <Label htmlFor={`subtract-${goal.id}`} className="text-sm cursor-pointer">
                              Subtract
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button size="sm" className="flex-1" onClick={() => handleUpdateGoal(goal.id)}>
                          Update
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setEditingGoalId(null)
                            setUpdateAmount("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 sm:pt-1 p-3 sm:p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={(e) => {
                    e.stopPropagation() // Prevent opening the transaction modal
                    if (editingGoalId === goal.id) {
                      setEditingGoalId(null)
                    } else {
                      setEditingGoalId(goal.id)
                      setUpdateAmount("")
                      setUpdateType("add")
                    }
                  }}
                >
                  <span>{editingGoalId === goal.id ? "Cancel" : "Update Goal"}</span>
                  {editingGoalId === goal.id ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4" />
                  )}
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
          description={`Current Amount: ${formatCurrency(selectedGoal.currentAmount)} • Target: ${formatCurrency(selectedGoal.targetAmount)} by ${selectedGoal.targetDate}`}
          transactions={selectedGoal.transactions}
          itemName={selectedGoal.name}
          allowAddTransaction={true}
          onAddTransaction={(transaction) => handleAddTransaction(transaction, selectedGoal.id)}
          lastUpdated={selectedGoal.lastUpdated}
          updateMethod={selectedGoal.updateMethod}
        />
      )}
    </div>
  )
}
