import type { Metadata } from "next"
import { BudgetReviewPage } from "@/components/budget-review-page"

export const metadata: Metadata = {
  title: "Budget Review | Finance Tracker",
  description: "Review and manage your monthly budget and spending categories",
}

export default function BudgetPage() {
  return <BudgetReviewPage />
}
