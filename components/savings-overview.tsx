"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Briefcase, Home, Plane, Plus, Umbrella } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"

const initialSavingsAccounts = [
  {
    id: "1",
    name: "Emergency Fund",
    currentAmount: 12000,
    targetAmount: 15000,
    monthlyContribution: 300,
    icon: Umbrella,
    savingsType: "emergency",
  },
  {
    id: "2",
    name: "Vacation Fund",
    currentAmount: 2450,
    targetAmount: 5000,
    monthlyContribution: 200,
    targetDate: "Dec 2025",
    icon: Plane,
    savingsType: "vacation",
  },
  {
    id: "3",
    name: "House Down Payment",
    currentAmount: 35000,
    targetAmount: 60000,
    monthlyContribution: 800,
    targetDate: "Jun 2026",
    icon: Home,
    savingsType: "house",
  },
  {
    id: "4",
    name: "Retirement",
    currentAmount: 78500,
    monthlyContribution: 500,
    icon: Briefcase,
    savingsType: "retirement",
  },
]

export function SavingsOverview() {
  const [savingsAccounts, setSavingsAccounts] = useState(initialSavingsAccounts)
  const [showAddSavings, setShowAddSavings] = useState(false)
  const [showUpdateSavings, setShowUpdateSavings] = useState(false)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [selectedSavingsId, setSelectedSavingsId] = useState<string | null>(null)
  const [fundAmount, setFundAmount] = useState("")
  const [newSavings, setNewSavings] = useState({
    name: "",
    currentAmount: "",
    targetAmount: "",
    monthlyContribution: "",
    targetDate: "",
    savingsType: "emergency",
  })
  const [updateSavings, setUpdateSavings] = useState({
    name: "",
    currentAmount: "",
    targetAmount: "",
    monthlyContribution: "",
    targetDate: "",
    savingsType: "emergency",
  })

  const handleAddSavings = () => {
    if (newSavings.name && newSavings.currentAmount && newSavings.monthlyContribution) {
      const savingsToAdd = {
        id: Date.now().toString(),
        name: newSavings.name,
        currentAmount: Number.parseFloat(newSavings.currentAmount),
        monthlyContribution: Number.parseFloat(newSavings.monthlyContribution),
        ...(newSavings.targetAmount ? { targetAmount: Number.parseFloat(newSavings.targetAmount) } : {}),
        ...(newSavings.targetDate ? { targetDate: newSavings.targetDate } : {}),
        icon:
          newSavings.savingsType === "emergency"
            ? Umbrella
            : newSavings.savingsType === "vacation"
              ? Plane
              : newSavings.savingsType === "house"
                ? Home
                : Briefcase,
        savingsType: newSavings.savingsType,
      }

      setSavingsAccounts([...savingsAccounts, savingsToAdd])
      setNewSavings({
        name: "",
        currentAmount: "",
        targetAmount: "",
        monthlyContribution: "",
        targetDate: "",
        savingsType: "emergency",
      })
      setShowAddSavings(false)
      toast({
        title: "Savings Added",
        description: `${savingsToAdd.name} has been added to your savings accounts.`,
      })
    }
  }

  const handleUpdateClick = (savings: any) => {
    setSelectedSavingsId(savings.id)
    setUpdateSavings({
      name: savings.name,
      currentAmount: savings.currentAmount.toString(),
      targetAmount: savings.targetAmount ? savings.targetAmount.toString() : "",
      monthlyContribution: savings.monthlyContribution.toString(),
      targetDate: savings.targetDate || "",
      savingsType: savings.savingsType,
    })
    setShowUpdateSavings(true)
  }

  const handleUpdateSavings = () => {
    if (updateSavings.name && updateSavings.currentAmount && updateSavings.monthlyContribution && selectedSavingsId) {
      setSavingsAccounts(
        savingsAccounts.map((savings) => {
          if (savings.id === selectedSavingsId) {
            return {
              ...savings,
              name: updateSavings.name,
              currentAmount: Number.parseFloat(updateSavings.currentAmount),
              monthlyContribution: Number.parseFloat(updateSavings.monthlyContribution),
              ...(updateSavings.targetAmount
                ? { targetAmount: Number.parseFloat(updateSavings.targetAmount) }
                : { targetAmount: undefined }),
              ...(updateSavings.targetDate ? { targetDate: updateSavings.targetDate } : { targetDate: undefined }),
              icon:
                updateSavings.savingsType === "emergency"
                  ? Umbrella
                  : updateSavings.savingsType === "vacation"
                    ? Plane
                    : updateSavings.savingsType === "house"
                      ? Home
                      : Briefcase,
              savingsType: updateSavings.savingsType,
            }
          }
          return savings
        }),
      )
      setShowUpdateSavings(false)
      setSelectedSavingsId(null)
      toast({
        title: "Savings Updated",
        description: "Your savings information has been updated successfully.",
      })
    }
  }

  const handleAddFundsClick = (savings: any) => {
    setSelectedSavingsId(savings.id)
    setFundAmount(savings.monthlyContribution.toString())
    setShowAddFunds(true)
  }

  const handleAddFunds = () => {
    if (fundAmount && selectedSavingsId) {
      const fundAmountNum = Number.parseFloat(fundAmount)

      if (isNaN(fundAmountNum) || fundAmountNum <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid amount to add.",
          variant: "destructive",
        })
        return
      }

      setSavingsAccounts(
        savingsAccounts.map((savings) => {
          if (savings.id === selectedSavingsId) {
            // Calculate new balance
            const newAmount = savings.currentAmount + fundAmountNum

            return {
              ...savings,
              currentAmount: newAmount,
            }
          }
          return savings
        }),
      )
      setShowAddFunds(false)
      setSelectedSavingsId(null)
      setFundAmount("")
      toast({
        title: "Funds Added",
        description: `$${formatCurrency(fundAmountNum)} has been added to your savings account.`,
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Savings</h2>
        <Button onClick={() => setShowAddSavings(!showAddSavings)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Savings
        </Button>
      </div>

      {showAddSavings && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Savings</CardTitle>
            <CardDescription>Track a new savings goal or account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="savings-name">Savings Name</Label>
                <Input
                  id="savings-name"
                  placeholder="e.g., Emergency Fund"
                  value={newSavings.name}
                  onChange={(e) => setNewSavings({ ...newSavings, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="savings-type">Savings Type</Label>
                <Select
                  value={newSavings.savingsType}
                  onValueChange={(value) => setNewSavings({ ...newSavings, savingsType: value })}
                >
                  <SelectTrigger id="savings-type">
                    <SelectValue placeholder="Select savings type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency Fund</SelectItem>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="house">House Down Payment</SelectItem>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-amount">Current Amount</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="current-amount"
                      type="number"
                      step="0.01"
                      placeholder="1000.00"
                      className="pl-7"
                      value={newSavings.currentAmount}
                      onChange={(e) => setNewSavings({ ...newSavings, currentAmount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="target-amount">Target Amount (optional)</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="target-amount"
                      type="number"
                      step="0.01"
                      placeholder="10000.00"
                      className="pl-7"
                      value={newSavings.targetAmount}
                      onChange={(e) => setNewSavings({ ...newSavings, targetAmount: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="monthly-contribution">Monthly Contribution</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="monthly-contribution"
                      type="number"
                      step="0.01"
                      placeholder="200.00"
                      className="pl-7"
                      value={newSavings.monthlyContribution}
                      onChange={(e) => setNewSavings({ ...newSavings, monthlyContribution: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="target-date">Target Date (optional)</Label>
                  <Input
                    id="target-date"
                    type="month"
                    value={newSavings.targetDate}
                    onChange={(e) => setNewSavings({ ...newSavings, targetDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddSavings(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSavings}>Add Savings</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showUpdateSavings && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Update Savings</CardTitle>
            <CardDescription>Update your savings goal or account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="update-savings-name">Savings Name</Label>
                <Input
                  id="update-savings-name"
                  placeholder="e.g., Emergency Fund"
                  value={updateSavings.name}
                  onChange={(e) => setUpdateSavings({ ...updateSavings, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="update-savings-type">Savings Type</Label>
                <Select
                  value={updateSavings.savingsType}
                  onValueChange={(value) => setUpdateSavings({ ...updateSavings, savingsType: value })}
                >
                  <SelectTrigger id="update-savings-type">
                    <SelectValue placeholder="Select savings type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency Fund</SelectItem>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="house">House Down Payment</SelectItem>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="update-current-amount">Current Amount</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="update-current-amount"
                      type="number"
                      step="0.01"
                      placeholder="1000.00"
                      className="pl-7"
                      value={updateSavings.currentAmount}
                      onChange={(e) => setUpdateSavings({ ...updateSavings, currentAmount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="update-target-amount">Target Amount (optional)</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="update-target-amount"
                      type="number"
                      step="0.01"
                      placeholder="10000.00"
                      className="pl-7"
                      value={updateSavings.targetAmount}
                      onChange={(e) => setUpdateSavings({ ...updateSavings, targetAmount: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="update-monthly-contribution">Monthly Contribution</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="update-monthly-contribution"
                      type="number"
                      step="0.01"
                      placeholder="200.00"
                      className="pl-7"
                      value={updateSavings.monthlyContribution}
                      onChange={(e) => setUpdateSavings({ ...updateSavings, monthlyContribution: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="update-target-date">Target Date (optional)</Label>
                  <Input
                    id="update-target-date"
                    type="month"
                    value={updateSavings.targetDate}
                    onChange={(e) => setUpdateSavings({ ...updateSavings, targetDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowUpdateSavings(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateSavings}>Update Savings</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showAddFunds && selectedSavingsId && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Funds</CardTitle>
            <CardDescription>
              Add funds to {savingsAccounts.find((savings) => savings.id === selectedSavingsId)?.name}
            </CardDescription>
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
                <p className="text-xs text-muted-foreground mt-1">
                  Suggested amount: $
                  {formatCurrency(
                    savingsAccounts.find((savings) => savings.id === selectedSavingsId)?.monthlyContribution || 0,
                  )}
                </p>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {savingsAccounts.map((account) => (
          <Card key={account.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <account.icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg font-medium">{account.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${formatCurrency(account.currentAmount)}</div>
              <p className="text-xs text-muted-foreground">
                ${formatCurrency(account.monthlyContribution)}/month contribution
              </p>

              {account.targetAmount && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{Math.round((account.currentAmount / account.targetAmount) * 100)}%</span>
                  </div>
                  <Progress value={(account.currentAmount / account.targetAmount) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    ${formatCurrency(account.currentAmount)} of ${formatCurrency(account.targetAmount)} goal
                    {account.targetDate && ` • Target: ${account.targetDate}`}
                  </p>
                </div>
              )}

              <div className="mt-4 flex justify-between">
                <Button size="sm" variant="outline" onClick={() => handleUpdateClick(account)}>
                  Update
                </Button>
                <Button size="sm" onClick={() => handleAddFundsClick(account)}>
                  Add Funds
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
