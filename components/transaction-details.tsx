"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"
import { Download, Filter, Plus, Search, RefreshCw, Clock, FileText } from "lucide-react"

export interface Transaction {
  id: string
  date: string | Date
  amount: number
  description: string
  category: string
  type: string
  status?: string
  reference?: string
  balance?: number
  notes?: string
}

interface TransactionDetailsProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  transactions: Transaction[]
  itemName: string
  showBalance?: boolean
  allowAddTransaction?: boolean
  onAddTransaction?: (transaction: Omit<Transaction, "id">) => void
  lastUpdated?: Date | string
  updateMethod?: "plaid" | "csv" | "manual"
}

export function TransactionDetails({
  isOpen,
  onClose,
  title,
  description,
  transactions,
  itemName,
  showBalance = false,
  allowAddTransaction = false,
  onAddTransaction,
  lastUpdated,
  updateMethod,
}: TransactionDetailsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    amount: "",
    description: "",
    category: "",
    type: "expense",
    status: "completed",
    notes: "",
  })

  // Get unique categories for filter
  const categories = Array.from(new Set(transactions.map((t) => t.category)))

  // Filter transactions based on search and category
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      searchTerm === "" ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.notes && transaction.notes.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = categoryFilter === null || transaction.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })

  const handleAddTransaction = () => {
    if (
      newTransaction.date &&
      newTransaction.amount &&
      newTransaction.description &&
      newTransaction.category &&
      onAddTransaction
    ) {
      onAddTransaction({
        date: newTransaction.date,
        amount: Number.parseFloat(newTransaction.amount),
        description: newTransaction.description,
        category: newTransaction.category,
        type: newTransaction.type,
        status: newTransaction.status,
        notes: newTransaction.notes,
      })

      // Reset form
      setNewTransaction({
        date: format(new Date(), "yyyy-MM-dd"),
        amount: "",
        description: "",
        category: "",
        type: "expense",
        status: "completed",
        notes: "",
      })
      setShowAddForm(false)
    }
  }

  const formatDate = (date: string | Date) => {
    if (typeof date === "string") {
      // Handle string dates
      try {
        return format(new Date(date), "MMM d, yyyy")
      } catch (e) {
        return date
      }
    } else {
      // Handle Date objects
      return format(date, "MMM d, yyyy")
    }
  }

  const formatLastUpdated = (date?: Date | string) => {
    if (!date) return "Unknown"
    if (typeof date === "string") {
      date = new Date(date)
    }
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const getUpdateMethodIcon = (method?: string) => {
    switch (method) {
      case "plaid":
        return <RefreshCw className="h-4 w-4 mr-1" />
      case "csv":
        return <FileText className="h-4 w-4 mr-1" />
      case "manual":
        return <Clock className="h-4 w-4 mr-1" />
      default:
        return <Clock className="h-4 w-4 mr-1" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-full sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{title}</DialogTitle>
          {description && <DialogDescription className="text-sm">{description}</DialogDescription>}
          {lastUpdated && (
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {getUpdateMethodIcon(updateMethod)}
              <span>
                Last updated {formatLastUpdated(lastUpdated)} via {updateMethod || "unknown"}
              </span>
            </div>
          )}
        </DialogHeader>

        <div className="flex flex-col space-y-4 overflow-hidden mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
              <div className="relative w-full sm:w-64 mb-2 sm:mb-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={categoryFilter === null ? "all" : categoryFilter}
                  onValueChange={(value) => setCategoryFilter(value === "all" ? null : value)}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {allowAddTransaction && (
                <Button onClick={() => setShowAddForm(true)} size="sm" className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              )}
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {showAddForm && (
            <div className="border rounded-md p-3 sm:p-4 mb-4 bg-muted/20">
              <h3 className="font-medium mb-4">Add New Transaction</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transaction-date">Date</Label>
                  <Input
                    id="transaction-date"
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction-amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input
                      id="transaction-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-7"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction-description">Description</Label>
                  <Input
                    id="transaction-description"
                    placeholder="Transaction description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction-category">Category</Label>
                  <Input
                    id="transaction-category"
                    placeholder="e.g., Food, Transportation"
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction-type">Type</Label>
                  <Select
                    value={newTransaction.type}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value })}
                  >
                    <SelectTrigger id="transaction-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transaction-status">Status</Label>
                  <Select
                    value={newTransaction.status}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, status: value })}
                  >
                    <SelectTrigger id="transaction-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="transaction-notes">Notes</Label>
                  <Input
                    id="transaction-notes"
                    placeholder="Additional notes"
                    value={newTransaction.notes}
                    onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button onClick={handleAddTransaction} className="w-full sm:w-auto">
                    Add Transaction
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-auto flex-grow">
            <div className="min-w-full overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Date</TableHead>
                    <TableHead className="whitespace-nowrap">Description</TableHead>
                    <TableHead className="whitespace-nowrap">Category</TableHead>
                    <TableHead className="whitespace-nowrap">Amount</TableHead>
                    {showBalance && <TableHead className="whitespace-nowrap">Balance</TableHead>}
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTransactions.length > 0 ? (
                    sortedTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="whitespace-nowrap">{formatDate(transaction.date)}</TableCell>
                        <TableCell className="max-w-[150px] sm:max-w-none truncate">
                          {transaction.description}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="whitespace-nowrap">
                            {transaction.category}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`whitespace-nowrap ${
                            transaction.type === "expense"
                              ? "text-red-600"
                              : transaction.type === "income"
                                ? "text-green-600"
                                : ""
                          }`}
                        >
                          {transaction.type === "expense" ? "-" : transaction.type === "income" ? "+" : ""}$
                          {formatCurrency(Math.abs(transaction.amount))}
                        </TableCell>
                        {showBalance && (
                          <TableCell className="whitespace-nowrap">
                            ${formatCurrency(transaction.balance || 0)}
                          </TableCell>
                        )}
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`whitespace-nowrap ${
                              transaction.status === "completed"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : transaction.status === "pending"
                                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                  : transaction.status === "failed"
                                    ? "bg-red-50 text-red-700 border-red-200"
                                    : ""
                            }`}
                          >
                            {transaction.status || "Completed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[100px] sm:max-w-[200px] truncate">
                          {transaction.notes || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={showBalance ? 7 : 6} className="text-center py-4 text-muted-foreground">
                        No transactions found for {itemName}.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
