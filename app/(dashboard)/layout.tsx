"use client"

import type React from "react"

import { useUser } from "@/contexts/user-context"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User, MenuIcon } from "lucide-react"
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, userName, logout } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-4">
            <Link href="/dashboard" className="font-semibold hover:underline">
              {userName}'s Wallet
            </Link>
            <div className="hidden md:flex items-center space-x-1 sm:space-x-4">
              <Link href="/debt-calculator" className="text-sm px-2 py-1 rounded-md transition-colors hover:bg-muted">
                Debt Calculator
              </Link>
              <Link
                href="/savings-calculator"
                className="text-sm px-2 py-1 rounded-md transition-colors hover:bg-muted"
              >
                Savings Goal Calculator
              </Link>
              <Link
                href="/investment-projection"
                className="text-sm px-2 py-1 rounded-md transition-colors hover:bg-muted"
              >
                Investment Projection
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MenuIcon className="h-4 w-4" />
                  <span className="sr-only">Menu</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="flex flex-col space-y-1">
                  <Link
                    href="/debt-calculator"
                    className="text-sm px-2 py-1 rounded-md transition-colors hover:bg-muted"
                  >
                    Debt Calculator
                  </Link>
                  <Link
                    href="/savings-calculator"
                    className="text-sm px-2 py-1 rounded-md transition-colors hover:bg-muted"
                  >
                    Savings Goal Calculator
                  </Link>
                  <Link
                    href="/investment-projection"
                    className="text-sm px-2 py-1 rounded-md transition-colors hover:bg-muted"
                  >
                    Investment Projection
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                pathname === "/profile" ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              <User className="h-4 w-4" />
              <span>{userName}</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
