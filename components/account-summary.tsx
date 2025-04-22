"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Landmark, Plus, Wallet, RefreshCw } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { PlaidLink } from "@/components/plaid-link"
import { toast } from "@/components/ui/use-toast"

const initialAccounts = [
  {
    id: "1",
    name: "Main Checking",
    type: "checking",
    balance: 4580.21,
    institution: "Chase Bank",
    lastUpdated: "Today",
    icon: Landmark,
  },
  {
    id: "2",
    name: "Savings Account",
    type: "savings",
    balance: 8000.0,
    institution: "Chase Bank",
    lastUpdated: "Today",
    icon: Wallet,
  },
  {
    id: "3",
    name: "Credit Card",
    type: "credit",
    balance: -1250.3,
    limit: 5000,
    institution: "American Express",
    lastUpdated: "Yesterday",
    icon: CreditCard,
  },
]

export function AccountSummary() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showConnectBank, setShowConnectBank] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "",
    balance: "",
    institution: "",
    limit: "",
  })

  const handleAddAccount = () => {
    if (newAccount.name && newAccount.type && newAccount.balance && newAccount.institution) {
      const accountToAdd = {
        id: Date.now().toString(),
        name: newAccount.name,
        type: newAccount.type,
        balance: Number.parseFloat(newAccount.balance),
        institution: newAccount.institution,
        lastUpdated: "Just now",
        icon: newAccount.type === "checking" ? Landmark : newAccount.type === "savings" ? Wallet : CreditCard,
        ...(newAccount.type === "credit" && newAccount.limit ? { limit: Number.parseFloat(newAccount.limit) } : {}),
      }

      setAccounts([...accounts, accountToAdd])
      setNewAccount({ name: "", type: "", balance: "", institution: "", limit: "" })
      setShowAddAccount(false)
      toast({
        title: "Account Added",
        description: `${accountToAdd.name} has been added to your accounts.`,
      })
    }
  }

  const handlePlaidSuccess = (plaidAccounts: any[]) => {
    // Transform Plaid accounts to our format
    const newAccounts = plaidAccounts.map((account) => {
      const accountType =
        account.type === "depository"
          ? account.subtype === "checking"
            ? "checking"
            : "savings"
          : account.type === "credit"
            ? "credit"
            : "other"

      return {
        id: account.account_id,
        name: account.name,
        type: accountType,
        balance: account.balances.available || account.balances.current,
        institution: account.institution_name || "Connected Bank",
        lastUpdated: "Just now",
        icon: accountType === "checking" ? Landmark : accountType === "savings" ? Wallet : CreditCard,
        ...(accountType === "credit" && account.balances.limit ? { limit: account.balances.limit } : {}),
      }
    })

    setAccounts([...accounts, ...newAccounts])
    setShowConnectBank(false)
  }

  const refreshAccounts = async () => {
    setIsRefreshing(true)

    // In a real app, this would call your API to refresh account data from Plaid
    const accessToken = localStorage.getItem("plaid_access_token")

    if (accessToken) {
      try {
        const response = await fetch("/api/plaid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "getAccounts",
            accessToken,
          }),
        })

        const data = await response.json()

        if (data.accounts) {
          // Update account balances
          const updatedAccounts = accounts.map((account) => {
            const plaidAccount = data.accounts.find((a: any) => a.account_id === account.id)
            if (plaidAccount) {
              return {
                ...account,
                balance: plaidAccount.balances.available || plaidAccount.balances.current,
                lastUpdated: "Just now",
              }
            }
            return account
          })

          setAccounts(updatedAccounts)
          toast({
            title: "Accounts Refreshed",
            description: "Your account balances have been updated.",
          })
        }
      } catch (error) {
        console.error("Error refreshing accounts:", error)
        toast({
          title: "Error",
          description: "Failed to refresh account data.",
          variant: "destructive",
        })
      }
    } else {
      // Simulate a refresh for demo purposes
      setTimeout(() => {
        const updatedAccounts = accounts.map((account) => ({
          ...account,
          lastUpdated: "Just now",
        }))
        setAccounts(updatedAccounts)
        toast({
          title: "Accounts Refreshed",
          description: "Your account balances have been updated.",
        })
      }, 1000)
    }

    setIsRefreshing(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Accounts</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refreshAccounts} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => setShowConnectBank(true)}>
            Connect Bank
          </Button>
          <Button onClick={() => setShowAddAccount(!showAddAccount)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>
      </div>

      {showConnectBank && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connect Your Bank</CardTitle>
            <CardDescription>
              Securely connect your bank accounts to automatically import your financial data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We use Plaid to securely connect to thousands of banks. Your credentials are never stored on our
                servers.
              </p>

              <div className="flex justify-between space-x-4">
                <Button variant="outline" className="w-full" onClick={() => setShowConnectBank(false)}>
                  Cancel
                </Button>
                <PlaidLink onSuccess={handlePlaidSuccess} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showAddAccount && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Account</CardTitle>
            <CardDescription>Connect a new bank account or credit card</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="account-name">Account Name</Label>
                <Input
                  id="account-name"
                  placeholder="e.g., Checking Account"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="account-type">Account Type</Label>
                <Select
                  value={newAccount.type}
                  onValueChange={(value) => setNewAccount({ ...newAccount, type: value })}
                >
                  <SelectTrigger id="account-type">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="balance">
                  {newAccount.type === "credit" ? "Current Balance (negative for amount owed)" : "Current Balance"}
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                  <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                    value={newAccount.balance}
                    onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
                  />
                </div>
              </div>

              {newAccount.type === "credit" && (
                <div className="grid gap-2">
                  <Label htmlFor="credit-limit">Credit Limit</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="credit-limit"
                      type="number"
                      step="0.01"
                      placeholder="5000.00"
                      className="pl-7"
                      value={newAccount.limit}
                      onChange={(e) => setNewAccount({ ...newAccount, limit: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="institution">Financial Institution</Label>
                <Input
                  id="institution"
                  placeholder="e.g., Chase Bank"
                  value={newAccount.institution}
                  onChange={(e) => setNewAccount({ ...newAccount, institution: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddAccount(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAccount}>Add Account</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <account.icon className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg font-medium">{account.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {account.type === "credit" ? "-" : ""}${formatCurrency(Math.abs(account.balance))}
              </div>
              <p className="text-xs text-muted-foreground">
                {account.institution} • Updated {account.lastUpdated}
              </p>

              {account.type === "credit" && account.limit && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Credit Used</span>
                    <span>{Math.round((Math.abs(account.balance) / account.limit) * 100)}%</span>
                  </div>
                  <Progress value={(Math.abs(account.balance) / account.limit) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    ${formatCurrency(Math.abs(account.balance))} of ${formatCurrency(account.limit)} limit
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
