import { format, subMonths, subDays, subWeeks, subQuarters } from "date-fns"

// Types for our financial data
export interface Account {
  id: string
  name: string
  type: string
  balance: number
  institution?: string
  lastUpdated?: string
  icon?: any
  limit?: number
}

export interface Loan {
  id: string
  name: string
  originalAmount: number
  currentBalance: number
  interestRate: number
  monthlyPayment: number
  nextPaymentDate: string
  icon?: any
  loanType: string
}

export interface SavingsAccount {
  id: string
  name: string
  currentAmount: number
  targetAmount?: number
  monthlyContribution: number
  targetDate?: string
  icon?: any
  savingsType: string
}

// Calculate current net worth from accounts, loans, and savings
export function calculateNetWorth(accounts: Account[], loans: Loan[], savingsAccounts: SavingsAccount[]): number {
  // Calculate total assets (positive account balances + savings)
  const accountAssets = accounts
    .filter((account) => account.balance > 0)
    .reduce((sum, account) => sum + account.balance, 0)

  const savingsAssets = savingsAccounts.reduce((sum, savings) => sum + savings.currentAmount, 0)

  const totalAssets = accountAssets + savingsAssets

  // Calculate total liabilities (negative account balances + loans)
  const accountLiabilities = accounts
    .filter((account) => account.balance < 0)
    .reduce((sum, account) => sum + Math.abs(account.balance), 0)

  const loanLiabilities = loans.reduce((sum, loan) => sum + loan.currentBalance, 0)

  const totalLiabilities = accountLiabilities + loanLiabilities

  // Net worth = assets - liabilities
  return totalAssets - totalLiabilities
}

// Calculate total assets
export function calculateTotalAssets(accounts: Account[], savingsAccounts: SavingsAccount[]): number {
  const accountAssets = accounts
    .filter((account) => account.balance > 0)
    .reduce((sum, account) => sum + account.balance, 0)

  const savingsAssets = savingsAccounts.reduce((sum, savings) => sum + savings.currentAmount, 0)

  return accountAssets + savingsAssets
}

// Calculate total liabilities
export function calculateTotalLiabilities(accounts: Account[], loans: Loan[]): number {
  const accountLiabilities = accounts
    .filter((account) => account.balance < 0)
    .reduce((sum, account) => sum + Math.abs(account.balance), 0)

  const loanLiabilities = loans.reduce((sum, loan) => sum + loan.currentBalance, 0)

  return accountLiabilities + loanLiabilities
}

// Generate historical net worth data based on time period
export function generateNetWorthHistory(
  accounts: Account[],
  loans: Loan[],
  savingsAccounts: SavingsAccount[],
  timePeriod: string,
  dateRange?: { from: Date; to: Date },
): Array<{ value: number; date: string }> {
  const currentNetWorth = calculateNetWorth(accounts, loans, savingsAccounts)
  const data = []
  const currentDate = new Date()

  // Determine number of data points and interval based on time period
  let numPoints = 30
  let formatStr = "MMM d"
  let subFn = subDays

  switch (timePeriod) {
    case "week":
      numPoints = 7
      formatStr = "EEE"
      subFn = subDays
      break
    case "month":
      numPoints = 4
      formatStr = "'Week' w"
      subFn = subWeeks
      break
    case "quarter":
      numPoints = 3
      formatStr = "MMM"
      subFn = subMonths
      break
    case "year":
      numPoints = 12
      formatStr = "MMM"
      subFn = subMonths
      break
    case "custom":
      if (dateRange) {
        // For custom ranges, determine appropriate interval based on range length
        const diffTime = Math.abs(dateRange.to.getTime() - dateRange.from.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays <= 14) {
          numPoints = diffDays
          formatStr = "MMM d"
          subFn = subDays
        } else if (diffDays <= 90) {
          numPoints = Math.ceil(diffDays / 7)
          formatStr = "'Week' w"
          subFn = subWeeks
        } else if (diffDays <= 365) {
          numPoints = Math.ceil(diffDays / 30)
          formatStr = "MMM"
          subFn = subMonths
        } else {
          numPoints = Math.ceil(diffDays / 90)
          formatStr = "MMM yyyy"
          subFn = subQuarters
        }
      }
      break
  }

  // Start with current net worth and work backwards
  let previousNetWorth = currentNetWorth

  // Include current date
  data.push({
    value: Math.round(previousNetWorth),
    date: format(currentDate, formatStr),
  })

  // Generate data for previous points with realistic changes
  for (let i = 1; i < numPoints; i++) {
    const date = subFn(currentDate, i)

    // Calculate a realistic previous net worth
    // This simulates:
    // - Regular savings contributions
    // - Loan payments
    // - Market fluctuations
    // - Income and expenses

    // Estimate savings based on time period
    let periodSavings = 0
    if (subFn === subDays) {
      periodSavings = savingsAccounts.reduce((sum, account) => sum + account.monthlyContribution / 30, 0)
    } else if (subFn === subWeeks) {
      periodSavings = savingsAccounts.reduce((sum, account) => sum + account.monthlyContribution / 4, 0)
    } else if (subFn === subMonths) {
      periodSavings = savingsAccounts.reduce((sum, account) => sum + account.monthlyContribution, 0)
    } else {
      periodSavings = savingsAccounts.reduce((sum, account) => sum + account.monthlyContribution * 3, 0)
    }

    // Estimate loan payments based on time period
    let periodLoanPayments = 0
    if (subFn === subDays) {
      periodLoanPayments = loans.reduce((sum, loan) => sum + loan.monthlyPayment / 30, 0)
    } else if (subFn === subWeeks) {
      periodLoanPayments = loans.reduce((sum, loan) => sum + loan.monthlyPayment / 4, 0)
    } else if (subFn === subMonths) {
      periodLoanPayments = loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0)
    } else {
      periodLoanPayments = loans.reduce((sum, loan) => sum + loan.monthlyPayment * 3, 0)
    }

    // Estimate period change in net worth
    const periodChange = periodSavings + periodLoanPayments

    // Add some randomness to simulate market fluctuations and variable expenses
    let randomFactor = 1
    if (subFn === subDays) {
      randomFactor = 0.999 + Math.random() * 0.002 // Small daily fluctuation
    } else if (subFn === subWeeks) {
      randomFactor = 0.995 + Math.random() * 0.01 // Larger weekly fluctuation
    } else if (subFn === subMonths) {
      randomFactor = 0.99 + Math.random() * 0.02 // Even larger monthly fluctuation
    } else {
      randomFactor = 0.98 + Math.random() * 0.04 // Significant quarterly fluctuation
    }

    // Calculate previous period's net worth
    previousNetWorth = (previousNetWorth - periodChange) * randomFactor

    data.unshift({
      value: Math.round(previousNetWorth),
      date: format(date, formatStr),
    })
  }

  return data
}

// Calculate net worth change between two periods
export function calculateNetWorthChange(currentNetWorth: number, previousNetWorth: number): number {
  if (previousNetWorth === 0) return 0
  return Number((((currentNetWorth - previousNetWorth) / previousNetWorth) * 100).toFixed(1))
}

// Calculate period change in net worth
export function calculatePeriodChange(netWorthHistory: Array<{ value: number; date: string }>): {
  amount: number
  percentage: number
} {
  if (netWorthHistory.length < 2) {
    return { amount: 0, percentage: 0 }
  }

  const currentValue = netWorthHistory[netWorthHistory.length - 1].value
  const previousValue = netWorthHistory[0].value

  const changeAmount = currentValue - previousValue
  const changePercentage = calculateNetWorthChange(currentValue, previousValue)

  return {
    amount: changeAmount,
    percentage: changePercentage,
  }
}
