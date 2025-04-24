"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { X, Plus, DollarSign, Percent } from "lucide-react"
import type { Debt } from "@/types/debt"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const debtFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  balance: z.coerce.number().min(0.01, "Balance must be greater than 0").max(10000000, "Balance too high"),
  interestRate: z.coerce
    .number()
    .min(0, "Interest rate cannot be negative")
    .max(100, "Interest rate cannot exceed 100%"),
  minimumPayment: z.coerce.number().min(0.01, "Minimum payment must be greater than 0"),
  type: z.enum(["credit-card", "student-loan", "mortgage", "personal-loan", "auto-loan", "other"]),
})

interface DebtInputFormProps {
  debts: Debt[]
  setDebts: (debts: Debt[]) => void
  extraPayment: number
  setExtraPayment: (amount: number) => void
}

export function DebtInputForm({ debts, setDebts, extraPayment, setExtraPayment }: DebtInputFormProps) {
  const form = useForm<z.infer<typeof debtFormSchema>>({
    resolver: zodResolver(debtFormSchema),
    defaultValues: {
      name: "",
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
      type: "credit-card",
    },
  })

  const onSubmit = (values: z.infer<typeof debtFormSchema>) => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: values.name,
      balance: values.balance,
      interestRate: values.interestRate,
      minimumPayment: values.minimumPayment,
      type: values.type,
    }

    setDebts([...debts, newDebt])
    form.reset({
      name: "",
      balance: 0,
      interestRate: 0,
      minimumPayment: 0,
      type: "credit-card",
    })
  }

  const removeDebt = (id: string) => {
    setDebts(debts.filter((debt) => debt.id !== id))
  }

  const totalMonthlyMinimum = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0)

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Debt Name</FormLabel>
                <FormControl>
                  <Input placeholder="Credit Card" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Debt Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select debt type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="student-loan">Student Loan</SelectItem>
                    <SelectItem value="mortgage">Mortgage</SelectItem>
                    <SelectItem value="personal-loan">Personal Loan</SelectItem>
                    <SelectItem value="auto-loan">Auto Loan</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Balance</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="number" step="0.01" min="0" placeholder="5000.00" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate (%)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="5.99"
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="minimumPayment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Monthly Payment</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="number" step="0.01" min="0" placeholder="100.00" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Debt
          </Button>
        </form>
      </Form>

      {debts.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-medium">Your Debts</div>
          <ScrollArea className="h-[180px]">
            <div className="space-y-2">
              {debts.map((debt) => (
                <div key={debt.id} className="flex items-center justify-between p-2 rounded-md bg-muted">
                  <div className="truncate mr-2">
                    <div className="font-medium truncate">{debt.name}</div>
                    <div className="text-xs text-muted-foreground flex flex-wrap gap-x-2">
                      <span>{formatCurrency(debt.balance)}</span>
                      <span>•</span>
                      <span>{debt.interestRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{formatCurrency(debt.minimumPayment)}/mo</Badge>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeDebt(debt.id)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="space-y-2 pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span>Total monthly minimum:</span>
              <span className="font-medium">{formatCurrency(totalMonthlyMinimum)}</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <Label>Extra monthly payment:</Label>
                <span className="font-medium">{formatCurrency(extraPayment)}</span>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  step="10"
                  min="0"
                  placeholder="Additional payment"
                  className="pl-8"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(Number(e.target.value))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Adding extra payments can significantly reduce your payoff time and interest paid
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
