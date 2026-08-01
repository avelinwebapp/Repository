"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"

export default function PaymentPage() {
  const { t } = useLanguage()
  const { isAuthenticated, user } = useAuth()

  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const doctorId = searchParams.get("doctor")
  const date = searchParams.get("date")
  const time = searchParams.get("time")
  const amount = searchParams.get("amount") || "0"

  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: user?.name || "",
    expiryDate: "",
    cvv: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    router.push(
      "/login?redirect=" + encodeURIComponent(`doctor=${doctorId}&date=${date}&time=${time}&amount=${amount}`),
    )
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({ ...prev, [name]: value }))

    // Clear errors when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateCardDetails = () => {
    const newErrors: Record<string, string> = {}

    if (!cardDetails.cardNumber) {
      newErrors.cardNumber = "Card number is required"
    } else if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Invalid card number"
    }

    if (!cardDetails.cardHolder) {
      newErrors.cardHolder = "Cardholder name is required"
    }

    if (!cardDetails.expiryDate) {
      newErrors.expiryDate = "Expiry date is required"
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = "Invalid format (MM/YY)"
    }

    if (!cardDetails.cvv) {
      newErrors.cvv = "CVV is required"
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = "Invalid CVV"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === "credit-card" && !validateCardDetails()) {
      return
    }

    setIsProcessing(true)

    try {
      // In a real app, this would be an API call to process payment
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Payment Successful",
        description: "Your appointment has been confirmed",
      })

      // Redirect to confirmation page
      router.push(`/appointments/confirmation?doctor=${doctorId}&date=${date}&time=${time}`)
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link
          href={`/doctors/${doctorId}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t("payment.back")}
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t("payment.title")}</h1>

        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>{t("payment.method")}</CardTitle>
                <CardDescription>{t("payment.selectMethod")}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4 mb-6">
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        {t("payment.creditCard")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-4">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex items-center">
                        <Image src="/paypal-digital-payment.png" alt="PayPal" width={20} height={20} className="mr-2" />
                        PayPal
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">{t("payment.cardNumber")}</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={handleInputChange}
                          className={errors.cardNumber ? "border-red-500" : ""}
                        />
                        {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardHolder">{t("payment.cardHolder")}</Label>
                        <Input
                          id="cardHolder"
                          name="cardHolder"
                          placeholder="John Doe"
                          value={cardDetails.cardHolder}
                          onChange={handleInputChange}
                          className={errors.cardHolder ? "border-red-500" : ""}
                        />
                        {errors.cardHolder && <p className="text-sm text-red-500">{errors.cardHolder}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">{t("payment.expiryDate")}</Label>
                          <Input
                            id="expiryDate"
                            name="expiryDate"
                            placeholder="MM/YY"
                            value={cardDetails.expiryDate}
                            onChange={handleInputChange}
                            className={errors.expiryDate ? "border-red-500" : ""}
                          />
                          {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cvv">{t("payment.cvv")}</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={handleInputChange}
                            className={errors.cvv ? "border-red-500" : ""}
                          />
                          {errors.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="text-center p-6">
                      <p className="mb-4">{t("payment.redirectPaypal")}</p>
                      <Image
                        src="/paypal-logo.png"
                        alt="PayPal"
                        width={150}
                        height={40}
                        className="mx-auto"
                      />
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t("payment.summary")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t("payment.amount")}</span>
                    <span>${amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("payment.tax")}</span>
                    <span>${(Number.parseFloat(amount) * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>{t("payment.total")}</span>
                    <span>${(Number.parseFloat(amount) * 1.05).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleSubmit} disabled={isProcessing}>
                  {isProcessing ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("payment.processing")}
                    </span>
                  ) : (
                    t("payment.pay")
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
