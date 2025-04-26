"use client"

import { SessionProvider } from "next-auth/react"
import { UserProvider } from "@/contexts/user-context"
import { SpeedInsights } from "@vercel/speed-insights/next"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        {children}
        <SpeedInsights />
      </UserProvider>
    </SessionProvider>
  )
} 