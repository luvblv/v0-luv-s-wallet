"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

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
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState("Guest")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is authenticated on initial load
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated")
    const storedName = localStorage.getItem("userName")
    const storedProfile = localStorage.getItem("userProfile")

    if (storedAuth === "true") {
      setIsAuthenticated(true)
      if (storedName) {
        setUserName(storedName)
      }
      if (storedProfile) {
        try {
          setUserProfile(JSON.parse(storedProfile))
        } catch (e) {
          console.error("Failed to parse stored profile")
        }
      }
    } else if (pathname !== "/login" && pathname !== "/register" && !pathname.startsWith("/auth")) {
      // Redirect to login if not authenticated and not on auth pages
      router.push("/login")
    }
  }, [pathname, router])

  const login = async (email: string, password: string) => {
    // In a real app, this would validate credentials with an API
    // For demo purposes, we'll just simulate a successful login
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Extract name from email (for demo purposes)
    const name = email.split("@")[0]
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1)

    setUserName(formattedName)
    setIsAuthenticated(true)

    // Create initial profile
    const initialProfile = {
      name: formattedName,
      email: email,
    }
    setUserProfile(initialProfile)

    // Store auth state in localStorage
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userName", formattedName)
    localStorage.setItem("userProfile", JSON.stringify(initialProfile))
  }

  const updateProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...profile } as UserProfile

      // Update userName if name is changed
      if (profile.name) {
        setUserName(profile.name)
        localStorage.setItem("userName", profile.name)
      }

      // Store updated profile
      localStorage.setItem("userProfile", JSON.stringify(updated))

      return updated
    })
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserName("Guest")
    setUserProfile(null)

    // Clear auth state from localStorage
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userName")
    localStorage.removeItem("userProfile")

    // Redirect to luvswallet.com instead of the login page
    window.location.href = "https://luvswallet.com"
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
