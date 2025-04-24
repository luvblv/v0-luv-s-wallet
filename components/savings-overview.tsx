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

interface SavingsAccount {
  id: string
  name: string
  type: string
  balance: number
  interestRate: number
  goal?: number
  transactions: Transaction[]
  lastUpdated: Date | string
  updateMethod?: "plaid" | "csv" | "manual"
  institution?: string
}

export function SavingsOverview() {
  const [selectedAccount, setSelectedAccount] = useState<SavingsAccount | null>(null)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)

  // Sample savings accounts data
  const savingsAccounts: SavingsAccount[] = [
    {
      id: "1",
      name: "Emergency Fund",
      type: "High-Yield Savings",
      balance: 8500,
      interestRate: 3.5,
      goal: 10000,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      updateMethod: "plaid",
      institution: "Ally Bank",
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
          amount: 24.79,
          description: "Interest Payment",
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
          amount: 23.12,
          description: "Interest Payment",
          category: "Interest",
          type: "income",
          status: "completed",
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-02-15",
          amount: 500,
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
      name: "Vacation Fund",
      type: "Savings",
      balance: 2750,
      interestRate: 2.1,
      goal: 5000,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
      updateMethod: "csv",
      institution: "Capital One",
      transactions: [
        {
          id: uuidv4(),
          date: "2023-04-15",
          amount: 200,
          description: "Monthly Contribution",
          category: "Deposit",
          type: "income",
          status: "completed",
          notes: "Regular monthly deposit",
        },
        {
          id: uuidv4(),
          date: "2023-04-01",
          amount: 4.48,
          description: "Interest Payment",
          category: "Interest",
          type: "income",
          status: "completed",
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-03-15",
          amount: 200,
          description: "Monthly Contribution",
          category: "Deposit",
          type: "income",
          status: "completed",
          notes: "Regular monthly deposit",
        },
        {
          id: uuidv4(),
          date: "2023-03-01",
          amount: 4.12,
          description: "Interest Payment",
          category: "Interest",
          type: "income",
          status: "completed",
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-02-15",
          amount: 200,
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
      name: "Home Down Payment",
      type: "Certificate of Deposit",
      balance: 15000,
      interestRate: 4.2,
      goal: 50000,
      lastUpdated: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      updateMethod: "manual",
      institution: "Marcus by Goldman Sachs",
      transactions: [
        {
          id: uuidv4(),
          date: "2023-04-01",
          amount: 52.5,
          description: "Interest Payment",
          category: "Interest",
          type: "income",
          status: "completed",
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-03-15",
          amount: 5000,
          description: "Bonus Contribution",
          category: "Deposit",
          type: "income",
          status: "completed",
          notes: "Annual bonus deposit",
        },
        {
          id: uuidv4(),
          date: "2023-03-01",
          amount: 35.0,
          description: "Interest Payment",
          category: "Interest",
          type: "income",
          status: "completed",
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-02-15",
          amount: 1000,
          description: "Monthly Contribution",
          category: "Deposit",
          type: "income",
          status: "completed",
          notes: "Regular monthly deposit",
        },
        {
          id: uuidv4(),
          date: "2023-02-01",
          amount: 31.5,
          description: "Interest Payment",
          category: "Interest",
          type: "income",
          status: "completed",
          notes: "Monthly interest",
        },
      ],
    },
  ]

  const handleAccountClick = (account: SavingsAccount) => {
    setSelectedAccount(account)
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
        <h2 className="text-xl font-bold">Savings</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add/Update Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("Manual add savings account")}>
              Add Savings Account Manually
            </DropdownMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Import from CSV</DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                  <DialogTitle>Import Savings Accounts from CSV</DialogTitle>
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
        {savingsAccounts.map((account) => {
          const percentToGoal = account.goal ? (account.balance / account.goal) * 100 : 100

          return (
            <Card
              key={account.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleAccountClick(account)}
            >
              <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
                <CardTitle>{account.name}</CardTitle>
                <CardDescription>
                  {account.type} • {account.interestRate}% APY
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 md:space-y-4 p-3 sm:p-4 pt-0 sm:pt-0">
                <div className="text-2xl font-bold">${formatCurrency(account.balance)}</div>
                {account.goal && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Goal Progress</span>
                      <span className="font-medium">
                        ${formatCurrency(account.balance)} of ${formatCurrency(account.goal)}
                      </span>
                    </div>
                    <Progress value={percentToGoal} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>${formatCurrency(account.goal - account.balance)} to go</span>
                      <span>{percentToGoal.toFixed(0)}% Complete</span>
                    </div>
                  </div>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {getUpdateMethodIcon(account.updateMethod)}
                        <span>Updated {formatLastUpdated(account.lastUpdated)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Last updated via {account.updateMethod || "unknown"}</p>
                      {account.institution && <p>Institution: {account.institution}</p>}
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
                    console.log(`Add funds to ${account.name}`)
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

      {selectedAccount && (
        <TransactionDetails
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          title={`${selectedAccount.name} Transactions`}
          description={`Current Balance: $${formatCurrency(selectedAccount.balance)} • Interest Rate: ${selectedAccount.interestRate}% APY`}
          transactions={selectedAccount.transactions}
          itemName={selectedAccount.name}
          allowAddTransaction={true}
          onAddTransaction={handleAddTransaction}
          lastUpdated={selectedAccount.lastUpdated}
          updateMethod={selectedAccount.updateMethod}
        />
      )}
    </div>
  )
}
