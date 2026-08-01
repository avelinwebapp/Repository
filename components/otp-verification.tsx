"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"

type OtpVerificationProps = {
  redirectUrl?: string
}

export function OtpVerification({ redirectUrl = "/" }: OtpVerificationProps) {
  const { verifyOtp, resendOtp, pendingEmail, isLoading } = useAuth()
  const router = useRouter()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [error, setError] = useState<string>("")
  const [resendTimer, setResendTimer] = useState<number>(30)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Handle countdown for resend button
  useEffect(() => {
    if (resendTimer <= 0) return

    const timer = setTimeout(() => {
      setResendTimer(resendTimer - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [resendTimer])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    // Update OTP array
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Clear error when typing
    if (error) setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtp(digits)

      // Focus the last input
      inputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpString = otp.join("")

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits")
      return
    }

    const success = await verifyOtp(otpString)

    if (success) {
      router.push(redirectUrl)
    }
  }

  const handleResend = async () => {
    const success = await resendOtp()

    if (success) {
      setResendTimer(30)
    }
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Verify your account</CardTitle>
            <CardDescription>Enter the 6-digit code sent to {pendingEmail}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="h-12 w-12 text-center text-lg"
                  />
                ))}
              </div>
              {error && <p className="text-sm text-center text-red-500">{error}</p>}
              <div className="text-center text-sm text-muted-foreground">
                Didn&apos;t receive a code?{" "}
                {resendTimer > 0 ? (
                  <span>Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-primary hover:underline"
                    disabled={isLoading}
                  >
                    Resend code
                  </button>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
