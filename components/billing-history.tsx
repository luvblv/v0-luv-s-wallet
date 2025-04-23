"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileDown } from "lucide-react"

// Sample billing history data
const billingHistory = [
  {
    id: "INV-001",
    date: "Apr 15, 2025",
    amount: "$95.88",
    status: "Paid",
    plan: "Annual Plan",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "INV-002",
    date: "Apr 15, 2024",
    amount: "$95.88",
    status: "Paid",
    plan: "Annual Plan",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "INV-003",
    date: "Apr 15, 2023",
    amount: "$9.99",
    status: "Paid",
    plan: "Monthly Plan",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "INV-004",
    date: "Mar 15, 2023",
    amount: "$9.99",
    status: "Paid",
    plan: "Monthly Plan",
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "INV-005",
    date: "Feb 15, 2023",
    amount: "$9.99",
    status: "Paid",
    plan: "Monthly Plan",
    paymentMethod: "Visa •••• 4242",
  },
]

export function BillingHistory() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Billing History</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Billing History</DialogTitle>
          <DialogDescription>View your subscription payment history and download invoices.</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{invoice.plan}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        invoice.status === "Paid"
                          ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          : "bg-yellow-100 text-yellow-700 border-yellow-200"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="Download Invoice">
                      <FileDown className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="mt-6">
          <div className="text-xs text-muted-foreground">
            <p>Payment method: Visa •••• 4242</p>
            <p className="mt-1">For billing questions, please contact support@personalwallet.com</p>
          </div>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
