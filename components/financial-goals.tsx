"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, Car, Home, Plus, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"

const initialGoals = [
  {
    id: "1",
    name: "Buy a House",
    currentAmount: 35000,
    targetAmount: 60000,
    targetDate: "2026-06-30",
    category: "housing",
    icon: Home,
  },
  {
    id: "2",
    name: "New Car",
    currentAmount: 8000,
    targetAmount: 25000,
    targetDate: "2025-12-31",
    category: "transportation",
    icon: Car,
  },
  {
    id: "3",
    name: "Early Retirement",
    currentAmount: 78500,
    targetAmount: 500000,
    targetDate: "2040-01-01",
    category: "retirement",
    icon: Briefcase,
  },
]

export function FinancialGoals() {
  const [goals, setGoals] = useState(initialGoals)
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showUpdateGoal, setShowUpdateGoal] = useState(false)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null)
  const [fundAmount, setFundAmount] = useState("")
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
    category: "",
  })
  const [updateGoal, setUpdateGoal] = useState({
    name: "",
    currentAmount: "",
    targetAmount: "",
    targetDate: "",
    category: "",
  })

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.targetDate && newGoal.category) {
      const goalToAdd = {
        id: Date.now().toString(),
        name: newGoal.name,
        currentAmount: 0,
        targetAmount: Number.parseFloat(newGoal.targetAmount),
        targetDate: newGoal.targetDate,
        category: newGoal.category,
        icon: newGoal.category === "housing" ? Home : newGoal.category === "transportation" ? Car : Briefcase,
      }

      setGoals([...goals, goalToAdd])
      setNewGoal({ name: "", targetAmount: "", targetDate: "", category: "" })
      setShowAddGoal(false)
      toast({
        title: "Goal Added",
        description: `${goalToAdd.name} has been added to your financial goals.`,
      })
    }
  }

  const handleUpdateClick = (goal: any) => {
    setSelectedGoalId(goal.id)
    setUpdateGoal({
      name: goal.name,
      currentAmount: goal.currentAmount.toString(),
      targetAmount: goal.targetAmount.toString(),
      targetDate: goal.targetDate,
      category: goal.category,
    })
    setShowUpdateGoal(true)
  }

  const handleUpdateGoal = () => {
    if (updateGoal.name && updateGoal.targetAmount && updateGoal.targetDate && updateGoal.category && selectedGoalId) {
      setGoals(
        goals.map((goal) => {
          if (goal.id === selectedGoalId) {
            return {
              ...goal,
              name: updateGoal.name,
              currentAmount: Number.parseFloat(updateGoal.currentAmount),
              targetAmount: Number.parseFloat(updateGoal.targetAmount),
              targetDate: updateGoal.targetDate,
              category: updateGoal.category,
              icon:
                updateGoal.category === "housing" ? Home : updateGoal.category === "transportation" ? Car : Briefcase,
            }
          }
          return goal
        }),
      )
      setShowUpdateGoal(false)
      setSelectedGoalId(null)
      toast({
        title: "Goal Updated",
        description: "Your financial goal has been updated successfully.",
      })
    }
  }

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id))
    toast({
      title: "Goal Deleted",
      description: "Your financial goal has been deleted.",
    })
  }

  const handleAddFundsClick = (goal: any) => {
    setSelectedGoalId(goal.id)
    setFundAmount("")
    setShowAddFunds(true)
  }

  const handleAddFunds = () => {
    if (fundAmount && selectedGoalId) {
      const fundAmountNum = Number.parseFloat(fundAmount)

      if (isNaN(fundAmountNum) || fundAmountNum <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid amount to add.",
          variant: "destructive",
        })
        return
      }

      setGoals(
        goals.map((goal) => {
          if (goal.id === selectedGoalId) {
            // Calculate new amount
            const newAmount = goal.currentAmount + fundAmountNum

            return {
              ...goal,
              currentAmount: newAmount,
            }
          }
          return goal
        }),
      )
      setShowAddFunds(false)
      setSelectedGoalId(null)
      setFundAmount("")
      toast({
        title: "Funds Added",
        description: `$${formatCurrency(fundAmountNum)} has been added to your goal.`,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Financial Goals</h2>
        <Button onClick={() => setShowAddGoal(!showAddGoal)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>

      {showAddGoal && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Goal</CardTitle>
            <CardDescription>Set a new financial goal to track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input
                  id="goal-name"
                  placeholder="e.g., Buy a House"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="target-amount">Target Amount ($)</Label>
                <Input
                  id="target-amount"
                  type="number"
                  placeholder="50000"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="target-date">Target Date</Label>
                <Input
                  id="target-date"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newGoal.category} onValueChange={(value) => setNewGoal({ ...newGoal, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddGoal}>Create Goal</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showUpdateGoal && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Update Goal</CardTitle>
            <CardDescription>Update your financial goal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="update-goal-name">Goal Name</Label>
                <Input
                  id="update-goal-name"
                  placeholder="e.g., Buy a House"
                  value={updateGoal.name}
                  onChange={(e) => setUpdateGoal({ ...updateGoal, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="update-current-amount">Current Amount ($)</Label>
                <Input
                  id="update-current-amount"
                  type="number"
                  placeholder="10000"
                  value={updateGoal.currentAmount}
                  onChange={(e) => setUpdateGoal({ ...updateGoal, currentAmount: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="update-target-amount">Target Amount ($)</Label>
                <Input
                  id="update-target-amount"
                  type="number"
                  placeholder="50000"
                  value={updateGoal.targetAmount}
                  onChange={(e) => setUpdateGoal({ ...updateGoal, targetAmount: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="update-target-date">Target Date</Label>
                <Input
                  id="update-target-date"
                  type="date"
                  value={updateGoal.targetDate}
                  onChange={(e) => setUpdateGoal({ ...updateGoal, targetDate: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="update-category">Category</Label>
                <Select
                  value={updateGoal.category}
                  onValueChange={(value) => setUpdateGoal({ ...updateGoal, category: value })}
                >
                  <SelectTrigger id="update-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowUpdateGoal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateGoal}>Update Goal</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showAddFunds && selectedGoalId && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Add Funds to Goal</CardTitle>
            <CardDescription>Add funds to {goals.find((goal) => goal.id === selectedGoalId)?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fund-amount">Amount to Add</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                  <Input
                    id="fund-amount"
                    type="number"
                    step="0.01"
                    placeholder="500.00"
                    className="pl-7"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddFunds(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddFunds}>Add Funds</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <goal.icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg font-medium">{goal.name}</CardTitle>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteGoal(goal.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${formatCurrency(goal.currentAmount)}</div>
              <p className="text-xs text-muted-foreground">
                of ${formatCurrency(goal.targetAmount)} goal • Target: {new Date(goal.targetDate).toLocaleDateString()}
              </p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                </div>
                <Progress value={(goal.currentAmount / goal.targetAmount) * 100} className="h-2" />

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleUpdateClick(goal)}>
                    Update
                  </Button>
                  <Button size="sm" onClick={() => handleAddFundsClick(goal)}>
                    Add Funds
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
