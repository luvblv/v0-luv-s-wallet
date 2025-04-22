"use client"

import { useState, useCallback, useEffect } from "react"
import { usePlaidLink } from "react-plaid-link"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useUser } from "@/contexts/user-context"

interface PlaidLinkProps {
  onSuccess: (accounts: any[]) => void
}

export function PlaidLink({ onSuccess }: PlaidLinkProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const { isAuthenticated, userName } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  // Get a link token when the component mounts
  useEffect(() => {
    if (isAuthenticated) {
      const fetchLinkToken = async () => {
        try {
          const response = await fetch("/api/plaid", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "createLinkToken",
              userId: userName, // Using userName as userId for simplicity
            }),
          })

          const data = await response.json()
          if (data.link_token) {
            setLinkToken(data.link_token)
          }
        } catch (error) {
          console.error("Error fetching link token:", error)
          toast({
            title: "Error",
            description: "Failed to initialize bank connection.",
            variant: "destructive",
          })
        }
      }

      fetchLinkToken()
    }
  }, [isAuthenticated, userName])

  const onPlaidSuccess = useCallback(
    async (publicToken: string, metadata: any) => {
      setIsLoading(true)
      try {
        // Exchange the public token for an access token
        const exchangeResponse = await fetch("/api/plaid", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "exchangeToken",
            publicToken,
          }),
        })

        const exchangeData = await exchangeResponse.json()

        if (exchangeData.access_token) {
          // Get accounts using the access token
          const accountsResponse = await fetch("/api/plaid", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "getAccounts",
              accessToken: exchangeData.access_token,
            }),
          })

          const accountsData = await accountsResponse.json()

          // Store the access token securely (in a real app, this would be stored in your database)
          localStorage.setItem("plaid_access_token", exchangeData.access_token)

          // Call the onSuccess callback with the accounts data
          if (accountsData.accounts) {
            onSuccess(accountsData.accounts)
            toast({
              title: "Success",
              description: "Bank account connected successfully!",
            })
          }
        }
      } catch (error) {
        console.error("Error in Plaid flow:", error)
        toast({
          title: "Error",
          description: "Failed to connect bank account.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    },
    [onSuccess],
  )

  const { open, ready } = usePlaidLink({
    token: linkToken || "",
    onSuccess: onPlaidSuccess,
    onExit: () => {
      toast({
        title: "Connection Cancelled",
        description: "Bank connection was cancelled.",
      })
    },
  })

  return (
    <Button onClick={() => open()} disabled={!ready || !linkToken || isLoading} className="w-full">
      {isLoading ? "Connecting..." : "Connect Bank Account"}
    </Button>
  )
}
