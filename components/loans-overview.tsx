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

interface Loan {
  id: string
  name: string
  type: string
  balance: number
  originalAmount: number
  interestRate: number
  minimumPayment: number
  dueDate: string
  transactions: Transaction[]
  lastUpdated: Date | string
  updateMethod?: "plaid" | "csv" | "manual"
  institution?: string
}

export function LoansOverview() {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)

  // Sample loans data
  const loans: Loan[] = [
    {
      id: "1",
      name: "Student Loan",
      type: "Student",
      balance: 15750.23,
      originalAmount: 25000,
      interestRate: 4.5,
      minimumPayment: 250,
      dueDate: "2023-05-15",
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      updateMethod: "plaid",
      institution: "Sallie Mae",
      transactions: [
        {
          id: uuidv4(),
          date: "2023-04-15",
          amount: 250,
          description: "Monthly Payment",
          category: "Loan Payment",
          type: "expense",
          status: "completed",
          notes: "Regular monthly payment",
        },
        {
          id: uuidv4(),
          date: "2023-04-01",
          amount: 59.06,
          description: "Interest Accrued",
          category: "Interest",
          type: "expense",
          status: "completed",
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-03-15",
          amount: 250,
          description: "Monthly Payment",
          category: "Loan Payment",
          type: "expense",
          status: "completed",
          notes: "Regular monthly payment",
        },
        {
          id: uuidv4(),
          date: "2023-03-01",
          amount: 60.12,
          description: "Interest Accrued",
          category: "Interest",
          type: "expense",
          status: "completed",
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-02-15",
          amount: 250,
          description: "Monthly Payment",
          category: "Loan Payment",
          type: "expense",
          status: "completed",
          notes: "Regular monthly payment",
        },
      ],
    },
    {
      id: "2",
      name: "Car Loan",
      type: "Auto",
      balance: 12450.67,
      originalAmount: 18000,
      interestRate: 3.9,
      minimumPayment: 320,
      dueDate: "2023-05-10",
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      updateMethod: "csv",
      institution: "Toyota Financial",
      transactions: [
        {
          id: uuidv4(),
          date: "2023-04-10",
          amount: 320,
          description: "Monthly Payment",
          category: "Loan Payment",
          type: "expense",
          status: "completed",
          notes: "Regular monthly payment",
        },
        {
          id: uuidv4(),
          date: "2023-04-01",
          amount: 40.46,
          description: "Interest Accrued",
          category: "Interest",
          type: "expense",
          status: "completed",
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-03-10",
          amount: 320,
          description: "Monthly Payment",
          category: "Loan Payment",
          type: "expense",
          status: "completed",
          notes: "Regular monthly payment",
        },
        {
          id: uuidv4(),
          date: "2023-03-01",
          amount: 41.23,
          description: "Interest Accrued",
          category: "Interest",
          type: "expense",
          status: "completed",
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-02-10",
          amount: 320,
          description: "Monthly Payment",
          category: "Loan Payment",
          type: "expense",
          status: "completed",
          notes: "Regular monthly payment",
        },
      ],
    },
    {
      id: "3",
      name: "Personal Loan",
      type: "Personal",
      balance: 5000,
      originalAmount: 5000,
      interestRate: 7.5,
      minimumPayment: 150,
      dueDate: "2023-05-20",
      lastUpdated: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      updateMethod: "manual",
      institution: "Local Credit Union",
      transactions: [
        {
          id: uuidv4(),
          date: "2023-04-20",
          amount: 5000,
          description: "Loan Origination",
          category: "Loan",
          type: "income",
          status: "completed",
          notes: "New personal loan",
        },
        {
          id: uuidv4(),
          date: "2023-04-20",
          amount: 75,
          description: "Origination Fee",
          category: "Fee",
          type: "expense",
          status: "completed",
          notes: "Loan origination fee",
        },
      ],
    },
  ]

  const handleLoanClick = (loan: Loan) => {
    setSelectedLoan(loan)
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
        <h2 className="text-xl font-bold">Loans</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add/Update Loan
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("Manual add loan")}>Add Loan Manually</DropdownMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Import from CSV</DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle>Import Loans from CSV</DialogTitle>
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
        {loans.map((loan) => {
          const percentPaid = ((loan.originalAmount - loan.balance) / loan.originalAmount) * 100

          return (
            <Card
              key={loan.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleLoanClick(loan)}
            >
              <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
                <CardTitle>{loan.name}</CardTitle>
                <CardDescription>
                  {loan.type} Loan • {loan.interestRate}% Interest
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 md:space-y-4 p-3 sm:p-4 pt-0 sm:pt-0">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Balance</span>
                    <span className="font-medium">${formatCurrency(loan.balance)}</span>
                  </div>
                  <Progress value={percentPaid} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Original: ${formatCurrency(loan.originalAmount)}</span>
                    <span>{percentPaid.toFixed(0)}% Paid</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Next Payment</span>
                  <span className="font-medium">
                    ${formatCurrency(loan.minimumPayment)} • Due {loan.dueDate}
                  </span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {getUpdateMethodIcon(loan.updateMethod)}
                        <span>Updated {formatLastUpdated(loan.lastUpdated)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Last updated via {loan.updateMethod || "unknown"}</p>
                      {loan.institution && <p>Institution: {loan.institution}</p>}
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
                    console.log(`Make payment for ${loan.name}`)
                  }}
                >
                  <span>Make Payment</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {selectedLoan && (
        <TransactionDetails
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          title={`${selectedLoan.name} Transactions`}
          description={`Current Balance: $${formatCurrency(selectedLoan.balance)} • Interest Rate: ${selectedLoan.interestRate}%`}
          transactions={selectedLoan.transactions}
          itemName={selectedLoan.name}
          allowAddTransaction={true}
          onAddTransaction={handleAddTransaction}
          lastUpdated={selectedLoan.lastUpdated}
          updateMethod={selectedLoan.updateMethod}
        />
      )}
    </div>
  )
}
