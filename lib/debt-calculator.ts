import type { Debt, DebtPayoffPlan, MonthlyPayment } from "@/types/debt"

/**
 * Calculates the debt payoff plan using either the avalanche or snowball method
 */
export function calculateDebtPayoff(
  debts: Debt[],
  extraPayment = 0,
  method: "avalanche" | "snowball" = "avalanche",
): DebtPayoffPlan {
  // Make a deep copy of the debts to avoid mutating the original array
  const debtsCopy: Debt[] = JSON.parse(JSON.stringify(debts))

  // Sort debts based on the chosen method
  const sortedDebts = [...debtsCopy].sort((a, b) => {
    if (method === "avalanche") {
      // Highest interest rate first
      return b.interestRate - a.interestRate
    } else {
      // Lowest balance first
      return a.balance - b.balance
    }
  })

  // Record the order in which debts will be paid off
  const payoffOrder = [...sortedDebts]

  // Initialize tracking variables
  const monthlyPayments: MonthlyPayment[] = []
  let month = 0
  let totalPaid = 0
  let totalInterestPaid = 0
  let remainingDebts = sortedDebts.length
  let currentExtraPayment = extraPayment

  // Continue until all debts are paid off
  while (remainingDebts > 0) {
    month++
    const currentDate = new Date()
    currentDate.setMonth(currentDate.getMonth() + month)

    const monthlyPayment: MonthlyPayment = {
      month,
      date: currentDate,
      debtPayments: [],
      totalPayment: 0,
      totalPrincipal: 0,
      totalInterest: 0,
      remainingDebts,
    }

    // Apply minimum payments to all debts
    for (const debt of sortedDebts) {
      if (debt.balance <= 0) continue

      // Calculate interest for this month (annual rate divided by 12)
      const monthlyInterestRate = debt.interestRate / 100 / 12
      const interestThisMonth = debt.balance * monthlyInterestRate

      // Determine payment amount
      let paymentAmount = debt.minimumPayment
      let principalAmount = paymentAmount - interestThisMonth

      // If principal payment would be greater than the remaining balance,
      // adjust payment to just pay off the debt
      if (principalAmount > debt.balance) {
        principalAmount = debt.balance
        paymentAmount = principalAmount + interestThisMonth
      }

      // Apply payment
      debt.balance -= principalAmount

      // Record payment details
      monthlyPayment.debtPayments.push({
        debtId: debt.id,
        paymentAmount,
        principalAmount,
        interestAmount: interestThisMonth,
        remainingBalance: debt.balance,
        isPaidOff: debt.balance <= 0,
      })

      // Update totals
      monthlyPayment.totalPayment += paymentAmount
      monthlyPayment.totalPrincipal += principalAmount
      monthlyPayment.totalInterest += interestThisMonth
      totalPaid += paymentAmount
      totalInterestPaid += interestThisMonth
    }

    // Apply extra payment to the target debt (first in the sorted list that has a balance)
    let extraPaymentApplied = 0
    for (const debt of sortedDebts) {
      if (debt.balance <= 0 || currentExtraPayment <= 0) continue

      // Apply extra payment
      const extraPrincipal = Math.min(debt.balance, currentExtraPayment)
      debt.balance -= extraPrincipal
      extraPaymentApplied = extraPrincipal

      // Find the payment record for this debt and update it
      const paymentRecord = monthlyPayment.debtPayments.find((p) => p.debtId === debt.id)
      if (paymentRecord) {
        paymentRecord.paymentAmount += extraPrincipal
        paymentRecord.principalAmount += extraPrincipal
        paymentRecord.remainingBalance = debt.balance
        paymentRecord.isPaidOff = debt.balance <= 0
      }

      // Update totals
      monthlyPayment.totalPayment += extraPrincipal
      monthlyPayment.totalPrincipal += extraPrincipal
      totalPaid += extraPrincipal

      break // Only apply extra payment to one debt
    }

    // Recalculate the remaining debts
    remainingDebts = sortedDebts.filter((debt) => debt.balance > 0).length
    monthlyPayment.remainingDebts = remainingDebts

    // Add this month's payment info to the history
    monthlyPayments.push(monthlyPayment)

    // If a debt was paid off, redistribute its minimum payment as additional extra payment
    if (extraPaymentApplied > 0 || month === 1) {
      currentExtraPayment = extraPayment
      for (const debt of sortedDebts) {
        if (debt.balance <= 0) {
          currentExtraPayment += debt.minimumPayment
        }
      }
    }
  }

  return {
    method,
    totalMonths: month,
    totalPaid,
    totalInterestPaid,
    monthlyPayments,
    payoffOrder,
    originalDebts: debts,
  }
}

/**
 * Returns the months when each debt will be paid off
 */
export function getPayoffMonths(plan: DebtPayoffPlan): Record<string, number> {
  const payoffMonths: Record<string, number> = {}

  // Go through all monthly payments to find when each debt is paid off
  for (const monthlyPayment of plan.monthlyPayments) {
    for (const debtPayment of monthlyPayment.debtPayments) {
      // If the debt is paid off and we haven't recorded it yet
      if (debtPayment.isPaidOff && !payoffMonths[debtPayment.debtId]) {
        payoffMonths[debtPayment.debtId] = monthlyPayment.month
      }
    }
  }

  return payoffMonths
}

/**
 * Returns the total interest paid for each debt
 */
export function getTotalInterestByDebt(plan: DebtPayoffPlan): Record<string, number> {
  const interestByDebt: Record<string, number> = {}

  // Initialize interest to 0 for each debt
  for (const debt of plan.originalDebts) {
    interestByDebt[debt.id] = 0
  }

  // Sum up interest paid for each debt
  for (const monthlyPayment of plan.monthlyPayments) {
    for (const debtPayment of monthlyPayment.debtPayments) {
      interestByDebt[debtPayment.debtId] += debtPayment.interestAmount
    }
  }

  return interestByDebt
}
