import type { Metadata } from "next"
import DashboardPage from "@/components/dashboard-page"

export const metadata: Metadata = {
  title: "Dashboard | Personal Wallet",
  description: "Track your finances, loans, savings, and more.",
}

export default function Dashboard() {
  return <DashboardPage />
}
