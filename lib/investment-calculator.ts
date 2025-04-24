import type { InvestmentParams, InvestmentResult, YearlyBreakdown } from "@/types/investment"

/**
 * Calculate investment growth with compound interest and regular contributions
 */
export function calculateInvestment(params: InvestmentParams): InvestmentResult {
  const {
    startingAmount,
    investmentLength,
    annualReturnRate,
    compoundingFrequency,
    contributionAmount,
    contributionFrequency,
    contributionTiming,
  } = params

  // Convert annual rate to decimal
  const annualRate = annualReturnRate / 100

  // Determine number of compounding periods per year
  let periodsPerYear: number
  switch (compoundingFrequency) {
    case "daily":
      periodsPerYear = 365
      break
    case "monthly":
      periodsPerYear = 12
      break
    case "quarterly":
      periodsPerYear = 4
      break
    case "semi-annually":
      periodsPerYear = 2
      break
    case "annually":
      periodsPerYear = 1
      break
    default:
      periodsPerYear = 12 // Default to monthly
  }

  // Determine number of contribution periods per year
  let contributionsPerYear: number
  switch (contributionFrequency) {
    case "monthly":
      contributionsPerYear = 12
      break
    case "quarterly":
      contributionsPerYear = 4
      break
    case "annually":
      contributionsPerYear = 1
      break
    default:
      contributionsPerYear = 12 // Default to monthly
  }

  // Calculate rate per period
  const ratePerPeriod = annualRate / periodsPerYear

  // Calculate number of periods
  const totalPeriods = periodsPerYear * investmentLength

  // Calculate number of contributions
  const totalContributions = contributionsPerYear * investmentLength

  // Initialize variables for tracking
  let currentBalance = startingAmount
  let totalContributionAmount = 0
  let totalInterestEarned = 0
  const yearlyBreakdown: YearlyBreakdown[] = []

  // Calculate year-by-year breakdown
  for (let year = 1; year <= investmentLength; year++) {
    const startBalance = currentBalance
    let yearlyContributions = 0
    let yearlyInterest = 0

    // Calculate growth for each compounding period in this year
    for (let period = 1; period <= periodsPerYear; period++) {
      // Determine if a contribution should be made at the beginning of this period
      const isContributionPeriod =
        period % (periodsPerYear / contributionsPerYear) === 1 || contributionsPerYear === periodsPerYear

      // Add contribution at beginning if applicable
      if (isContributionPeriod && contributionTiming === "beginning") {
        currentBalance += contributionAmount
        yearlyContributions += contributionAmount
        totalContributionAmount += contributionAmount
      }

      // Calculate interest for this period
      const interestEarned = currentBalance * ratePerPeriod
      currentBalance += interestEarned
      yearlyInterest += interestEarned
      totalInterestEarned += interestEarned

      // Add contribution at end if applicable
      if (isContributionPeriod && contributionTiming === "end") {
        currentBalance += contributionAmount
        yearlyContributions += contributionAmount
        totalContributionAmount += contributionAmount
      }
    }

    // Add to yearly breakdown
    yearlyBreakdown.push({
      year,
      startBalance,
      contributions: yearlyContributions,
      interest: yearlyInterest,
      endBalance: currentBalance,
      contributionsToDate: totalContributionAmount,
      interestToDate: totalInterestEarned,
    })
  }

  return {
    startingAmount,
    totalContributions: totalContributionAmount,
    totalInterest: totalInterestEarned,
    finalBalance: currentBalance,
    schedule: yearlyBreakdown,
  }
}
