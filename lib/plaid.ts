import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from "plaid"

// Initialize the Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // Use 'development' or 'production' for real usage
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID || "",
      "PLAID-SECRET": process.env.PLAID_SECRET || "",
    },
  },
})

export const plaidClient = new PlaidApi(configuration)

// Create a link token for initializing Plaid Link
export async function createLinkToken(userId: string) {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: "Luv's Wallet",
      products: [Products.Transactions, Products.Auth, Products.Liabilities],
      country_codes: [CountryCode.Us],
      language: "en",
    })

    return response.data
  } catch (error) {
    console.error("Error creating link token:", error)
    throw error
  }
}

// Exchange public token for access token
export async function exchangePublicToken(publicToken: string) {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    })

    return response.data
  } catch (error) {
    console.error("Error exchanging public token:", error)
    throw error
  }
}

// Get accounts for a user
export async function getAccounts(accessToken: string) {
  try {
    const response = await plaidClient.accountsGet({
      access_token: accessToken,
    })

    return response.data
  } catch (error) {
    console.error("Error getting accounts:", error)
    throw error
  }
}

// Get transactions for a user
export async function getTransactions(accessToken: string, startDate: string, endDate: string) {
  try {
    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: startDate,
      end_date: endDate,
    })

    return response.data
  } catch (error) {
    console.error("Error getting transactions:", error)
    throw error
  }
}

// Get liabilities (loans, credit cards) for a user
export async function getLiabilities(accessToken: string) {
  try {
    const response = await plaidClient.liabilitiesGet({
      access_token: accessToken,
    })

    return response.data
  } catch (error) {
    console.error("Error getting liabilities:", error)
    throw error
  }
}
