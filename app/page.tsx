"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function Home() {
  const router = useRouter()
  const { status, data: session } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [debug, setDebug] = useState<string>("Initializing...")

  useEffect(() => {
    try {
      setDebug(`Current status: ${status}, Session: ${JSON.stringify(session)}`)
      if (status === "authenticated") {
        setDebug("Redirecting to dashboard...")
        router.push("/dashboard")
      } else if (status === "unauthenticated") {
        setDebug("Redirecting to login...")
        router.push("/login")
      }
    } catch (err) {
      setError("An error occurred while checking authentication status")
      console.error("Authentication error:", err)
      setDebug(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }, [status, session, router])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">{debug}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        <p className="text-gray-600">Please wait while we check your authentication status.</p>
        <p className="text-sm text-gray-500 mt-2">{debug}</p>
      </div>
    </div>
  )
}
