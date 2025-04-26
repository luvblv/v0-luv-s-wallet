"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

type UserProfile = {
  name: string
  email: string
  dob?: string
  paymentMethod?: string
}

type UserContextType = {
  userName: string
  setUserName: (name: string) => void
  userProfile: UserProfile | null
  updateProfile: (profile: Partial<UserProfile>) => void
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState("Guest")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"

  // Update user data when session changes
  useEffect(() => {
    if (session?.user) {
      setUserName(session.user.name || "Guest")
      setUserProfile({
        name: session.user.name || "Guest",
        email: session.user.email || "",
      })
    } else if (status === "unauthenticated") {
      setUserName("Guest")
      setUserProfile(null)
    }
  }, [session, status])

  // Handle authentication redirects
  useEffect(() => {
    if (status === "unauthenticated" && 
        pathname !== "/login" && 
        pathname !== "/register" && 
        !pathname.startsWith("/auth")) {
      router.push("/login")
    } else if (status === "authenticated" && pathname === "/login") {
      router.push("/dashboard")
    }
  }, [status, pathname, router])

  const login = async (email: string, password: string) => {
    // In a real app, this would validate credentials with an API
    // For demo purposes, we'll just simulate a successful login
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Extract name from email (for demo purposes)
    const name = email.split("@")[0]
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1)

    setUserName(formattedName)
    setUserProfile({
      name: formattedName,
      email: email,
    })
  }

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...profile } as UserProfile
      if (profile.name) {
        setUserName(profile.name)
      }
      return updated
    })
  }

  const logout = async () => {
    await signOut({ redirect: false })
    setUserName("Guest")
    setUserProfile(null)
    router.push("/login")
  }

  // Show loading state while loading the session
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we check your authentication status.</p>
        </div>
      </div>
    )
  }

  return (
    <UserContext.Provider
      value={{
        userName,
        setUserName,
        userProfile,
        updateProfile,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
