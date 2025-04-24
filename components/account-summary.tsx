"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { ArrowUpRight, CreditCard, Plus, RefreshCw, Clock } from "lucide-react"
import { type Transaction, TransactionDetails } from "./transaction-details"
import { v4 as uuidv4 } from "uuid"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlaidLink } from "./plaid-link"
import { formatDistanceToNow } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Account {
  id: string
  name: string
  type: string
  balance: number
  accountNumber: string
  transactions: Transaction[]
  lastUpdated: Date | string
  updateMethod?: "plaid" | "csv" | "manual"
  institution?: string
}

export function AccountSummary() {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [isPlaidDialogOpen, setIsPlaidDialogOpen] = useState(false)
  const [isCsvDialogOpen, setIsCsvDialogOpen] = useState(false)

  // Sample accounts data
  const accounts: Account[] = [
    {
      id: "1",
      name: "Main Checking",
      type: "Checking",
      balance: 5280.42,
      accountNumber: "****4567",
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      updateMethod: "plaid",
      institution: "Chase Bank",
      transactions: [
        {
          id: uuidv4(),
          date: "2023-04-15",
          amount: 1200,
          description: "Paycheck Deposit",
          category: "Income",
          type: "income",
          status: "completed",
          balance: 5280.42,
          notes: "Bi-weekly paycheck",
        },
        {
          id: uuidv4(),
          date: "2023-04-12",
          amount: 85.33,
          description: "Grocery Store",
          category: "Groceries",
          type: "expense",
          status: "completed",
          balance: 4080.42,
          notes: "Weekly grocery shopping",
        },
        {
          id: uuidv4(),
          date: "2023-04-10",
          amount: 9.99,
          description: "Streaming Service",
          category: "Entertainment",
          type: "expense",
          status: "completed",
          balance: 4165.75,
          notes: "Monthly subscription",
        },
        {
          id: uuidv4(),
          date: "2023-04-05",
          amount: 1500,
          description: "Rent Payment",
          category: "Housing",
          type: "expense",
          status: "completed",
          balance: 4175.74,
          notes: "Monthly rent",
        },
        {
          id: uuidv4(),
          date: "2023-04-01",
          amount: 1200,
          description: "Paycheck Deposit",
          category: "Income",
          type: "income",
          status: "completed",
          balance: 5675.74,
          notes: "Bi-weekly paycheck",
        },
      ],
    },
    {
      id: "2",
      name: "Savings",
      type: "Savings",
      balance: 12750.83,
      accountNumber: "****7890",
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      updateMethod: "plaid",
      institution: "Chase Bank",
      transactions: [
        {
          id: uuidv4(),
          date: "2023-04-15",
          amount: 500,
          description: "Transfer from Checking",
          category: "Transfer",
          type: "income",
          status: "completed",
          balance: 12750.83,
          notes: "Monthly savings transfer",
        },
        {
          id: uuidv4(),
          date: "2023-04-01",
          amount: 42.83,
          description: "Interest Payment",
          category: "Interest",
          type: "income",
          status: "completed",
          balance: 12250.83,
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-03-15",
          amount: 500,
          description: "Transfer from Checking",
          category: "Transfer",
          type: "income",
          status: "completed",
          balance: 12208.0,
          notes: "Monthly savings transfer",
        },
        {
          id: uuidv4(),
          date: "2023-03-01",
          amount: 41.5,
          description: "Interest Payment",
          category: "Interest",
          type: "income",
          status: "completed",
          balance: 11708.0,
          notes: "Monthly interest",
        },
        {
          id: uuidv4(),
          date: "2023-02-15",
          amount: 500,
          description: "Transfer from Checking",
          category: "Transfer",
          type: "income",
          status: "completed",
          balance: 11666.5,
          notes: "Monthly savings transfer",
        },
      ],
    },
    {
      id: "3",
      name: "Credit Card",
      type: "Credit",
      balance: -1240.56,
      accountNumber: "****1234",
      lastUpdated: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      updateMethod: "csv",
      institution: "American Express",
      transactions: [
        {
          id: uuidv4(),
          date: "2023-04-14",
          amount: 42.75,
          description: "Restaurant",
          category: "Dining",
          type: "expense",
          status: "completed",
          balance: -1240.56,
          notes: "Dinner with friends",
        },
        {
          id: uuidv4(),
          date: "2023-04-12",
          amount: 500,
          description: "Credit Card Payment",
          category: "Payment",
          type: "income",
          status: "completed",
          balance: -1197.81,
          notes: "Monthly payment",
        },
        {
          id: uuidv4(),
          date: "2023-04-10",
          amount: 120.99,
          description: "Online Shopping",
          category: "Shopping",
          type: "expense",
          status: "completed",
          balance: -1697.81,
          notes: "New headphones",
        },
        {
          id: uuidv4(),
          date: "2023-04-08",
          amount: 35.4,
          description: "Gas Station",
          category: "Transportation",
          type: "expense",
          status: "completed",
          balance: -1576.82,
          notes: "Fuel",
        },
        {
          id: uuidv4(),
          date: "2023-04-05",
          amount: 65.32,
          description: "Grocery Store",
          category: "Groceries",
          type: "expense",
          status: "completed",
          balance: -1541.42,
          notes: "Weekly grocery shopping",
        },
      ],
    },
    {
      id: "4",
      name: "Investment Account",
      type: "Investment",
      balance: 45320.18,
      accountNumber: "****5678",
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
      updateMethod: "manual",
      institution: "Vanguard",
      transactions: [
        {
          id: uuidv4(),
          date: "2023-04-01",
          amount: 500,
          description: "Monthly Contribution",
          category: "Investment",
          type: "expense",
          status: "completed",
          balance: 45320.18,
          notes: "401k contribution",
        },
        {
          id: uuidv4(),
          date: "2023-03-15",
          amount: 320.45,
          description: "Dividend Payment",
          category: "Income",
          type: "income",
          status: "completed",
          balance: 44820.18,
          notes: "Quarterly dividend",
        },
      ],
    },
  ]

  const handleAccountClick = (account: Account) => {
    setSelectedAccount(account)
    setIsTransactionModalOpen(true)
  }

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    // In a real app, this would update the database
    console.log("Adding transaction:", transaction)
  }

  const handleImportCsv = (data: any[], accountId: string) => {
    console.log(`Importing ${data.length} transactions to account ${accountId}`)

    // Find the account
    const account = accounts.find((a) => a.id === accountId)
    if (!account) {
      console.error(`Account with ID ${accountId} not found`)
      return
    }

    // In a real app, this would update the database
    console.log(`Imported data for ${account.name}:`, data)
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
        return <CreditCard className="h-3 w-3 mr-1" />
      case "manual":
        return <Clock className="h-3 w-3 mr-1" />
      default:
        return <Clock className="h-3 w-3 mr-1" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Accounts</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add/Update Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem>Connect Bank (Plaid)</DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Connect Bank Account</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <PlaidLink
                    onSuccess={(accounts) => {
                      console.log("Connected accounts:", accounts)
                      // Here you would update your accounts state
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {accounts.map((account) => (
          <Card
            key={account.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleAccountClick(account)}
          >
            <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4">
              <CardTitle className="flex items-center justify-between">
                <span>{account.name}</span>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                {account.type} • {account.accountNumber}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
              <div className="text-2xl font-bold">{formatCurrency(account.balance)}</div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
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
                  setSelectedAccount(account)
                  setIsTransactionModalOpen(true)
                }}
              >
                <span>View Transactions</span>
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedAccount && (
        <TransactionDetails
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          title={`${selectedAccount.name} Transactions`}
          description={`Account ${selectedAccount.accountNumber} • Current Balance: ${formatCurrency(selectedAccount.balance)}`}
          transactions={selectedAccount.transactions}
          itemName={selectedAccount.name}
          showBalance={true}
          allowAddTransaction={true}
          onAddTransaction={handleAddTransaction}
          lastUpdated={selectedAccount.lastUpdated}
          updateMethod={selectedAccount.updateMethod}
        />
      )}
    </div>
  )
}
