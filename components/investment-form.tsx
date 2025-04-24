"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DollarSign } from "lucide-react"
import type { InvestmentParams } from "@/types/investment"

interface InvestmentFormProps {
  initialData: InvestmentParams
  onCalculate: (data: InvestmentParams) => void
}

export function InvestmentForm({ initialData, onCalculate }: InvestmentFormProps) {
  const [formData, setFormData] = useState<InvestmentParams>(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCalculate(formData)
  }

  const handleChange = (field: keyof InvestmentParams, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="startingAmount">Starting Amount</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="startingAmount"
            type="number"
            min="0"
            step="100"
            value={formData.startingAmount}
            onChange={(e) => handleChange("startingAmount", Number(e.target.value))}
            className="pl-8"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="investmentLength">Investment Length (years)</Label>
        <Input
          id="investmentLength"
          type="number"
          min="1"
          max="50"
          value={formData.investmentLength}
          onChange={(e) => handleChange("investmentLength", Number(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="annualReturnRate">Annual Return Rate (%)</Label>
          <span className="text-sm text-muted-foreground">{formData.annualReturnRate}%</span>
        </div>
        <div className="relative pt-5">
          <Slider
            id="annualReturnRate"
            min={0}
            max={20}
            step={0.1}
            value={[formData.annualReturnRate]}
            onValueChange={(value) => handleChange("annualReturnRate", value[0])}
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
            <SelectItem value="semi-annually">Semi-Annually</SelectItem>
            <SelectItem value="annually">Annually</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contributionAmount">Regular Contribution</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="contributionAmount"
            type="number"
            min="0"
            step="10"
            value={formData.contributionAmount}
            onChange={(e) => handleChange("contributionAmount", Number(e.target.value))}
            className="pl-8"
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
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="annually">Annually</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Contribution Timing</Label>
        <RadioGroup
          value={formData.contributionTiming}
          onValueChange={(value) => handleChange("contributionTiming", value)}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="beginning" id="beginning" />
            <Label htmlFor="beginning" className="cursor-pointer">
              Beginning of period
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="end" id="end" />
            <Label htmlFor="end" className="cursor-pointer">
              End of period
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full mt-6">
        Calculate
      </Button>
    </form>
  )
}
