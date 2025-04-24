import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { UserProvider } from "@/contexts/user-context"
import { getServerSession } from "next-auth/next"
import { SessionProvider } from "next-auth/react"
import { authOptions } from "@/auth"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Finance Tracker",
  description: "Track your finances, loans, savings, and more.",
  generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <SessionProvider session={session}>
          <UserProvider>
            {children}
            <SpeedInsights />
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
