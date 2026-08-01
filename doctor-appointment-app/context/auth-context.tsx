"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  name: string
  email: string
  phone?: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>
  logout: () => void
  verifyOtp: (otp: string) => Promise<boolean>
  resendOtp: () => Promise<boolean>
  pendingVerification: boolean
  pendingEmail: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [pendingEmail, setPendingEmail] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any email/password
      // In a real app, this would validate credentials with the backend

      // Set pending verification
      setPendingVerification(true)
      setPendingEmail(email)

      // Generate and send OTP (in a real app)
      // For demo, we'll just simulate this

      toast({
        title: "OTP Sent",
        description: "A verification code has been sent to your email/phone",
      })

      return true
    } catch (error) {
      console.error("Login failed", error)
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any registration
      // In a real app, this would register the user with the backend

      // Set pending verification
      setPendingVerification(true)
      setPendingEmail(email)

      // Generate and send OTP (in a real app)
      // For demo, we'll just simulate this

      toast({
        title: "Registration Successful",
        description: "A verification code has been sent to your email/phone",
      })

      return true
    } catch (error) {
      console.error("Registration failed", error)
      toast({
        title: "Registration Failed",
        description: "Could not create account. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtp = async (otp: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // In a real app, this would verify the OTP with the backend
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any 6-digit OTP
      if (!/^\d{6}$/.test(otp)) {
        toast({
          title: "Invalid OTP",
          description: "Please enter a valid 6-digit code",
          variant: "destructive",
        })
        return false
      }

      // Create user object
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 15),
        name: pendingEmail.split("@")[0], // Use part of email as name for demo
        email: pendingEmail,
        phone: "",
      }

      // Set user in state and localStorage
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))

      // Reset verification state
      setPendingVerification(false)
      setPendingEmail("")

      toast({
        title: "Verification Successful",
        description: "You have been successfully logged in",
      })

      // Check if there's a pending booking
      const pendingBooking = sessionStorage.getItem("pendingBooking")
      if (pendingBooking) {
        const booking = JSON.parse(pendingBooking)
        router.push(
          `/payment?doctor=${booking.doctorId}&date=${booking.date}&time=${booking.timeSlot}&amount=${booking.totalCost}`,
        )
        sessionStorage.removeItem("pendingBooking")
      }

      return true
    } catch (error) {
      console.error("OTP verification failed", error)
      toast({
        title: "Verification Failed",
        description: "Could not verify OTP. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const resendOtp = async (): Promise<boolean> => {
    try {
      // In a real app, this would resend the OTP
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent",
      })

      return true
    } catch (error) {
      console.error("Failed to resend OTP", error)
      toast({
        title: "Failed to Resend",
        description: "Could not send a new code. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        verifyOtp,
        resendOtp,
        pendingVerification,
        pendingEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
