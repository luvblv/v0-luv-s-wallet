export type DebtType = "credit-card" | "student-loan" | "mortgage" | "personal-loan" | "auto-loan" | "other"

export interface Debt {
  id: string
  name: string
  balance: number
  interestRate: number
  minimumPayment: number
  type: DebtType
}

export interface MonthlyPayment {
  month: number // 1-based index (month 1, month 2, etc.)
  date: Date
  debtPayments: {
    debtId: string
    paymentAmount: number
    principalAmount: number
    interestAmount: number
    remainingBalance: number
    isPaidOff: boolean
  }[]
  totalPayment: number
  totalPrincipal: number
  totalInterest: number
  remainingDebts: number
}

export interface DebtPayoffPlan {
  method: "avalanche" | "snowball"
  totalMonths: number
  totalPaid: number
  totalInterestPaid: number
  monthlyPayments: MonthlyPayment[]
  payoffOrder: Debt[]
  originalDebts: Debt[]
}
