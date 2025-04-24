"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { DollarSign } from "lucide-react"
import type { SavingsGoalData } from "./savings-goal-calculator-page"

interface SavingsGoalFormProps {
  initialData: SavingsGoalData
  onCalculate: (data: SavingsGoalData) => void
}

export function SavingsGoalForm({ initialData, onCalculate }: SavingsGoalFormProps) {
  const [formData, setFormData] = useState<SavingsGoalData>(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCalculate(formData)
  }

  const handleChange = (field: keyof SavingsGoalData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="goalAmount">Target Amount</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="goalAmount"
            type="number"
            min="100"
            step="100"
            value={formData.goalAmount}
            onChange={(e) => handleChange("goalAmount", Number(e.target.value))}
            className="pl-8"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="initialDeposit">Initial Deposit</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="initialDeposit"
            type="number"
            min="0"
            step="100"
            value={formData.initialDeposit}
            onChange={(e) => handleChange("initialDeposit", Number(e.target.value))}
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contributionAmount">Regular Contribution</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="contributionAmount"
            type="number"
            min="1"
            step="10"
            value={formData.contributionAmount}
            onChange={(e) => handleChange("contributionAmount", Number(e.target.value))}
            className="pl-8"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contributionFrequency">Contribution Frequency</Label>
        <Select
          value={formData.contributionFrequency}
          onValueChange={(value) => handleChange("contributionFrequency", value)}
        >
          <SelectTrigger id="contributionFrequency">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="biweekly">Bi-Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <span className="text-sm text-muted-foreground">{formData.interestRate}%</span>
        </div>
        <div className="relative pt-5">
          <Slider
            id="interestRate"
            min={0}
            max={10}
            step={0.1}
            value={[formData.interestRate]}
            onValueChange={(value) => handleChange("interestRate", value[0])}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="compoundingFrequency">Compounding Frequency</Label>
        <Select
          value={formData.compoundingFrequency}
          onValueChange={(value) => handleChange("compoundingFrequency", value)}
        >
          <SelectTrigger id="compoundingFrequency">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="annually">Annually</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full mt-6">
        Calculate
      </Button>
    </form>
  )
}
