"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Car, GraduationCap, Home, Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"

const initialLoans = [
  {
    id: "1",
    name: "Mortgage",
    originalAmount: 250000,
    currentBalance: 198450.32,
    interestRate: 3.25,
    monthlyPayment: 1087.62,
    nextPaymentDate: "Apr 1, 2025",
    icon: Home,
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
    icon: Car,
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
    icon: GraduationCap,
    loanType: "student",
  },
]

export function LoansOverview() {
  const [loans, setLoans] = useState(initialLoans)
  const [showAddLoan, setShowAddLoan] = useState(false)
  const [showUpdateLoan, setShowUpdateLoan] = useState(false)
  const [showMakePayment, setShowMakePayment] = useState(false)
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [newLoan, setNewLoan] = useState({
    name: "",
    originalAmount: "",
    currentBalance: "",
    interestRate: "",
    monthlyPayment: "",
    nextPaymentDate: "",
    loanType: "mortgage",
  })
  const [updateLoan, setUpdateLoan] = useState({
    name: "",
    originalAmount: "",
    currentBalance: "",
    interestRate: "",
    monthlyPayment: "",
    nextPaymentDate: "",
    loanType: "mortgage",
  })

  const handleAddLoan = () => {
    if (
      newLoan.name &&
      newLoan.originalAmount &&
      newLoan.currentBalance &&
      newLoan.interestRate &&
      newLoan.monthlyPayment &&
      newLoan.nextPaymentDate
    ) {
      const loanToAdd = {
        id: Date.now().toString(),
        name: newLoan.name,
        originalAmount: Number.parseFloat(newLoan.originalAmount),
        currentBalance: Number.parseFloat(newLoan.currentBalance),
        interestRate: Number.parseFloat(newLoan.interestRate),
        monthlyPayment: Number.parseFloat(newLoan.monthlyPayment),
        nextPaymentDate: newLoan.nextPaymentDate,
        icon: newLoan.loanType === "mortgage" ? Home : newLoan.loanType === "car" ? Car : GraduationCap,
        loanType: newLoan.loanType,
      }

      setLoans([...loans, loanToAdd])
      setNewLoan({
        name: "",
        originalAmount: "",
        currentBalance: "",
        interestRate: "",
        monthlyPayment: "",
        nextPaymentDate: "",
        loanType: "mortgage",
      })
      setShowAddLoan(false)
      toast({
        title: "Loan Added",
        description: `${loanToAdd.name} has been added to your loans.`,
      })
    }
  }

  const handleUpdateClick = (loan: any) => {
    setSelectedLoanId(loan.id)
    setUpdateLoan({
      name: loan.name,
      originalAmount: loan.originalAmount.toString(),
      currentBalance: loan.currentBalance.toString(),
      interestRate: loan.interestRate.toString(),
      monthlyPayment: loan.monthlyPayment.toString(),
      nextPaymentDate: loan.nextPaymentDate,
      loanType: loan.loanType,
    })
    setShowUpdateLoan(true)
  }

  const handleUpdateLoan = () => {
    if (
      updateLoan.name &&
      updateLoan.originalAmount &&
      updateLoan.currentBalance &&
      updateLoan.interestRate &&
      updateLoan.monthlyPayment &&
      updateLoan.nextPaymentDate &&
      selectedLoanId
    ) {
      setLoans(
        loans.map((loan) => {
          if (loan.id === selectedLoanId) {
            return {
              ...loan,
              name: updateLoan.name,
              originalAmount: Number.parseFloat(updateLoan.originalAmount),
              currentBalance: Number.parseFloat(updateLoan.currentBalance),
              interestRate: Number.parseFloat(updateLoan.interestRate),
              monthlyPayment: Number.parseFloat(updateLoan.monthlyPayment),
              nextPaymentDate: updateLoan.nextPaymentDate,
              icon: updateLoan.loanType === "mortgage" ? Home : updateLoan.loanType === "car" ? Car : GraduationCap,
              loanType: updateLoan.loanType,
            }
          }
          return loan
        }),
      )
      setShowUpdateLoan(false)
      setSelectedLoanId(null)
      toast({
        title: "Loan Updated",
        description: "Your loan information has been updated successfully.",
      })
    }
  }

  const handleMakePaymentClick = (loan: any) => {
    setSelectedLoanId(loan.id)
    setPaymentAmount(loan.monthlyPayment.toString())
    setShowMakePayment(true)
  }

  const handleMakePayment = () => {
    if (paymentAmount && selectedLoanId) {
      const paymentAmountNum = Number.parseFloat(paymentAmount)

      if (isNaN(paymentAmountNum) || paymentAmountNum <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid payment amount.",
          variant: "destructive",
        })
        return
      }

      setLoans(
        loans.map((loan) => {
          if (loan.id === selectedLoanId) {
            // Calculate new balance
            const newBalance = Math.max(0, loan.currentBalance - paymentAmountNum)

            // Calculate next payment date (add 1 month to current date)
            const currentDate = new Date()
            currentDate.setMonth(currentDate.getMonth() + 1)
            const nextPaymentDate = currentDate.toISOString().split("T")[0]

            return {
              ...loan,
              currentBalance: newBalance,
              nextPaymentDate: nextPaymentDate,
            }
          }
          return loan
        }),
      )
      setShowMakePayment(false)
      setSelectedLoanId(null)
      setPaymentAmount("")
      toast({
        title: "Payment Made",
        description: `Payment of $${formatCurrency(paymentAmountNum)} has been applied to your loan.`,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Loans</h2>
        <Button onClick={() => setShowAddLoan(!showAddLoan)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Loan
        </Button>
      </div>

      {showAddLoan && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Add New Loan</CardTitle>
            <CardDescription>Track a new loan or debt</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="loan-name">Loan Name</Label>
                <Input
                  id="loan-name"
                  placeholder="e.g., Home Mortgage"
                  value={newLoan.name}
                  onChange={(e) => setNewLoan({ ...newLoan, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="loan-type">Loan Type</Label>
                <Select value={newLoan.loanType} onValueChange={(value) => setNewLoan({ ...newLoan, loanType: value })}>
                  <SelectTrigger id="loan-type">
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                    <SelectItem value="car">Auto Loan</SelectItem>
                    <SelectItem value="student">Student Loan</SelectItem>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="original-amount">Original Amount</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="original-amount"
                      type="number"
                      step="0.01"
                      placeholder="50000.00"
                      className="pl-7"
                      value={newLoan.originalAmount}
                      onChange={(e) => setNewLoan({ ...newLoan, originalAmount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="current-balance">Current Balance</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="current-balance"
                      type="number"
                      step="0.01"
                      placeholder="45000.00"
                      className="pl-7"
                      value={newLoan.currentBalance}
                      onChange={(e) => setNewLoan({ ...newLoan, currentBalance: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="interest-rate">Interest Rate (%)</Label>
                  <Input
                    id="interest-rate"
                    type="number"
                    step="0.01"
                    placeholder="4.5"
                    value={newLoan.interestRate}
                    onChange={(e) => setNewLoan({ ...newLoan, interestRate: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="monthly-payment">Monthly Payment</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="monthly-payment"
                      type="number"
                      step="0.01"
                      placeholder="500.00"
                      className="pl-7"
                      value={newLoan.monthlyPayment}
                      onChange={(e) => setNewLoan({ ...newLoan, monthlyPayment: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="next-payment-date">Next Payment Date</Label>
                <Input
                  id="next-payment-date"
                  type="date"
                  value={newLoan.nextPaymentDate}
                  onChange={(e) => setNewLoan({ ...newLoan, nextPaymentDate: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddLoan(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddLoan}>Add Loan</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showUpdateLoan && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Update Loan</CardTitle>
            <CardDescription>Update your loan information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="update-loan-name">Loan Name</Label>
                <Input
                  id="update-loan-name"
                  placeholder="e.g., Home Mortgage"
                  value={updateLoan.name}
                  onChange={(e) => setUpdateLoan({ ...updateLoan, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="update-loan-type">Loan Type</Label>
                <Select
                  value={updateLoan.loanType}
                  onValueChange={(value) => setUpdateLoan({ ...updateLoan, loanType: value })}
                >
                  <SelectTrigger id="update-loan-type">
                    <SelectValue placeholder="Select loan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                    <SelectItem value="car">Auto Loan</SelectItem>
                    <SelectItem value="student">Student Loan</SelectItem>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="update-original-amount">Original Amount</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="update-original-amount"
                      type="number"
                      step="0.01"
                      placeholder="50000.00"
                      className="pl-7"
                      value={updateLoan.originalAmount}
                      onChange={(e) => setUpdateLoan({ ...updateLoan, originalAmount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="update-current-balance">Current Balance</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="update-current-balance"
                      type="number"
                      step="0.01"
                      placeholder="45000.00"
                      className="pl-7"
                      value={updateLoan.currentBalance}
                      onChange={(e) => setUpdateLoan({ ...updateLoan, currentBalance: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="update-interest-rate">Interest Rate (%)</Label>
                  <Input
                    id="update-interest-rate"
                    type="number"
                    step="0.01"
                    placeholder="4.5"
                    value={updateLoan.interestRate}
                    onChange={(e) => setUpdateLoan({ ...updateLoan, interestRate: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="update-monthly-payment">Monthly Payment</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="update-monthly-payment"
                      type="number"
                      step="0.01"
                      placeholder="500.00"
                      className="pl-7"
                      value={updateLoan.monthlyPayment}
                      onChange={(e) => setUpdateLoan({ ...updateLoan, monthlyPayment: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="update-next-payment-date">Next Payment Date</Label>
                <Input
                  id="update-next-payment-date"
                  type="date"
                  value={updateLoan.nextPaymentDate}
                  onChange={(e) => setUpdateLoan({ ...updateLoan, nextPaymentDate: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowUpdateLoan(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateLoan}>Update Loan</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showMakePayment && selectedLoanId && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Make Payment</CardTitle>
            <CardDescription>
              Make a payment towards {loans.find((loan) => loan.id === selectedLoanId)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="payment-amount">Payment Amount</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                  <Input
                    id="payment-amount"
                    type="number"
                    step="0.01"
                    placeholder="500.00"
                    className="pl-7"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Suggested payment: $
                  {formatCurrency(loans.find((loan) => loan.id === selectedLoanId)?.monthlyPayment || 0)}
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowMakePayment(false)}>
                  Cancel
                </Button>
                <Button onClick={handleMakePayment}>Make Payment</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loans.map((loan) => (
          <Card key={loan.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <loan.icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg font-medium">{loan.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${formatCurrency(loan.currentBalance)}</div>
              <p className="text-xs text-muted-foreground">
                {((loan.currentBalance / loan.originalAmount) * 100).toFixed(1)}% remaining • {loan.interestRate}%
                interest
              </p>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Paid Off</span>
                  <span>{(100 - (loan.currentBalance / loan.originalAmount) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={100 - (loan.currentBalance / loan.originalAmount) * 100} className="h-2" />
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-sm font-medium">Next Payment</p>
                    <p className="text-xs text-muted-foreground">
                      ${formatCurrency(loan.monthlyPayment)} on {loan.nextPaymentDate}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleUpdateClick(loan)}>
                      Update
                    </Button>
                    <Button size="sm" onClick={() => handleMakePaymentClick(loan)}>
                      Make Payment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
