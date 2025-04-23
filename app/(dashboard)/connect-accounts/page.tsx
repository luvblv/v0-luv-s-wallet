import type { Metadata } from "next"
import { ConnectAccountsPage } from "@/components/connect-accounts-page"

export const metadata: Metadata = {
  title: "Connect Accounts | Finance Tracker",
  description: "Connect your bank accounts or import financial data",
}

export default function ConnectAccounts() {
  return <ConnectAccountsPage />
}
