"use client"

import type React from "react"

import { useUser } from "@/contexts/user-context"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User, MenuIcon } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, userName, logout } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container flex h-14 items-center justify-between px-4">
          <div className="flex items-center space-x-1 sm:space-x-4">
            <Link href="/dashboard" className="font-semibold hover:underline text-sm sm:text-base">
              {userName}'s Wallet
            </Link>
            <div className="hidden md:flex items-center space-x-1 sm:space-x-4">
              <Link href="/budget" className="text-xs sm:text-sm px-2 py-1 rounded-md transition-colors hover:bg-muted">
                Review Budget
              </Link>
              <Link
                href="/debt-calculator"
                className="text-xs sm:text-sm px-2 py-1 rounded-md transition-colors hover:bg-muted"
              >
                Debt Calculator
              </Link>
              <Link
                href="/savings-calculator"
                className="text-xs sm:text-sm px-2 py-1 rounded-md transition-colors hover:bg-muted"
              >
                Savings Goal Calculator
              </Link>
              <Link
                href="/investment-projection"
                className="text-xs sm:text-sm px-2 py-1 rounded-md transition-colors hover:bg-muted"
              >
                Investment Projection
              </Link>
              <Link
                href="/education-center"
                className="text-xs sm:text-sm px-2 py-1 rounded-md transition-colors hover:bg-muted"
              >
                Education Center
              </Link>
            </div>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <SheetHeader className="border-b pb-4 mb-4">
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-3">
                  <Link
                    href="/dashboard"
                    className="text-sm px-2 py-2 rounded-md transition-colors hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/budget"
                    className="text-sm px-2 py-2 rounded-md transition-colors hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Review Budget
                  </Link>
                  <Link
                    href="/debt-calculator"
                    className="text-sm px-2 py-2 rounded-md transition-colors hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Debt Calculator
                  </Link>
                  <Link
                    href="/savings-calculator"
                    className="text-sm px-2 py-2 rounded-md transition-colors hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Savings Goal Calculator
                  </Link>
                  <Link
                    href="/investment-projection"
                    className="text-sm px-2 py-2 rounded-md transition-colors hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Investment Projection
                  </Link>
                  <Link
                    href="/education-center"
                    className="text-sm px-2 py-2 rounded-md transition-colors hover:bg-muted"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Education Center
                  </Link>
                  <div className="border-t my-2 pt-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-2 py-2 rounded-md transition-colors hover:bg-muted"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        logout()
                      }}
                      className="w-full justify-start mt-2"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/profile"
              className={`hidden md:flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md transition-colors text-xs sm:text-sm ${
                pathname === "/profile" ? "bg-muted" : "hover:bg-muted"
              }`}
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{userName}</span>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout} className="hidden md:flex text-xs sm:text-sm">
              <LogOut className="mr-0 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
