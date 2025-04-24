export interface InvestmentParams {
  startingAmount: number
  investmentLength: number
  annualReturnRate: number
  compoundingFrequency: "daily" | "monthly" | "quarterly" | "semi-annually" | "annually"
  contributionAmount: number
  contributionFrequency: "monthly" | "quarterly" | "annually"
  contributionTiming: "beginning" | "end"
}

export interface YearlyBreakdown {
  year: number
  startBalance: number
  contributions: number
  interest: number
  endBalance: number
  contributionsToDate: number
  interestToDate: number
}

export interface InvestmentResult {
  startingAmount: number
  totalContributions: number
  totalInterest: number
  finalBalance: number
  schedule: YearlyBreakdown[]
}
