import { type NextRequest, NextResponse } from "next/server"
import { createLinkToken, exchangePublicToken, getAccounts, getTransactions, getLiabilities } from "@/lib/plaid"

export async function POST(request: NextRequest) {
  try {
    const { action, userId, publicToken, accessToken, startDate, endDate } = await request.json()

    switch (action) {
      case "createLinkToken":
        const linkToken = await createLinkToken(userId)
        return NextResponse.json(linkToken)

      case "exchangeToken":
        const exchangeResponse = await exchangePublicToken(publicToken)
        return NextResponse.json(exchangeResponse)

      case "getAccounts":
        const accounts = await getAccounts(accessToken)
        return NextResponse.json(accounts)

      case "getTransactions":
        const transactions = await getTransactions(accessToken, startDate, endDate)
        return NextResponse.json(transactions)

      case "getLiabilities":
        const liabilities = await getLiabilities(accessToken)
        return NextResponse.json(liabilities)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Plaid API error:", error)
    return NextResponse.json({ error: "Plaid API error" }, { status: 500 })
  }
}
