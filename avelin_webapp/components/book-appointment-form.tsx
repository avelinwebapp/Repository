"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, ChevronLeft, ChevronRight, Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/context/language-context"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"

type Doctor = {
  id: string
  name: string
  specialty: string
  price: number
  image: string
  [key: string]: any
}

type BookAppointmentFormProps = {
  doctor: Doctor
  onCancel: () => void
}

// Currency type definition
type Currency = {
  code: string
  name: string
  symbol: string
  rate: number // Exchange rate from USD
}

// Passport validation regex patterns for different countries
const passportRegexPatterns: Record<string, { pattern: RegExp; example: string }> = {
  "United States": {
    pattern: /^[A-Z0-9]{9}$/i,
    example: "123456789",
  },
  "United Kingdom": {
    pattern: /^[0-9]{9}$/,
    example: "123456789",
  },
  Canada: {
    pattern: /^[A-Z]{2}[0-9]{6}$/i,
    example: "AB123456",
  },
  Australia: {
    pattern: /^[A-Z][0-9]{7}$/i,
    example: "N1234567",
  },
  Germany: {
    pattern: /^[A-Z0-9]{10}$/i,
    example: "C01X00T47H",
  },
  France: {
    pattern: /^[0-9]{2}[A-Z]{2}[0-9]{5}$/i,
    example: "12AB12345",
  },
  default: {
    pattern: /^[A-Z0-9]{6,12}$/i,
    example: "AB123456",
  },
}

export function BookAppointmentForm({ doctor, onCancel }: BookAppointmentFormProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const [step, setStep] = useState(1)
  const [date, setDate] = useState<Date>()
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]) // Default to USD
  const [passportError, setPassportError] = useState<string>("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    passportNumber: "",
    reason: "Checkup",
    surgeryType: "",
    notes: "",
    additionalServices: {
      translator: false,
      visa: false,
      flight: false,
      hotel: false,
    },
  })

  const timeSlots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
  ]

  // Define surgery types with translation keys
  const surgeryTypes = [
    { id: "general", key: "surgery.general" },
    { id: "orthopedic", key: "surgery.orthopedic" },
    { id: "cardiac", key: "surgery.cardiac" },
    { id: "neuro", key: "surgery.neuro" },
    { id: "plastic", key: "surgery.plastic" },
    { id: "eye", key: "surgery.eye" },
    { id: "ent", key: "surgery.ent" },
    { id: "dental", key: "surgery.dental" },
    { id: "gynecological", key: "surgery.gynecological" },
    { id: "urological", key: "surgery.urological" },
  ]

  // List of countries for the country dropdown
  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Japan",
    "China",
    "India",
    "Brazil",
    "Mexico",
    "South Africa",
    "Russia",
    "Saudi Arabia",
    "United Arab Emirates",
    "Singapore",
    "South Korea",
    "Thailand",
    "Malaysia",
    "Indonesia",
    "Bangladesh",
    "Pakistan",
    "Egypt",
    "Nigeria",
    "Kenya",
    "Ghana",
    "Morocco",
    "Turkey",
  ]

  // Currency conversion function
  const convertPrice = (priceInUSD: number): string => {
    const convertedPrice = priceInUSD * selectedCurrency.rate
    return `${selectedCurrency.symbol}${convertedPrice.toFixed(2)}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear passport error when user types
    if (name === "passportNumber") {
      setPassportError("")
    }
  }

  const handleCheckboxChange = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalServices: {
        ...prev.additionalServices,
        [service]: !prev.additionalServices[service as keyof typeof prev.additionalServices],
      },
    }))
  }

  const calculateTotalCost = () => {
    let total = doctor.price

    if (formData.additionalServices.translator) total += 50
    if (formData.additionalServices.visa) total += 100
    if (formData.additionalServices.flight) total += 500
    if (formData.additionalServices.hotel) total += 200

    return total
  }

  const validatePassport = () => {
    if (!formData.passportNumber) {
      return true // Passport is optional unless international
    }

    const countryPattern = passportRegexPatterns[formData.country] || passportRegexPatterns.default

    if (!countryPattern.pattern.test(formData.passportNumber)) {
      setPassportError(t("booking.passportInvalid") + ` (${t("booking.example")}: ${countryPattern.example})`)
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store booking details in session storage
      sessionStorage.setItem(
        "pendingBooking",
        JSON.stringify({
          doctorId: doctor.id,
          date: date?.toISOString(),
          timeSlot,
          formData,
          totalCost: calculateTotalCost(),
        }),
      )

      toast({
        title: t("booking.authRequired"),
        description: t("booking.pleaseLogin"),
      })

      // Redirect to login page
      router.push("/login?redirect=booking")
      return
    }

    // Validate passport if provided
    if (!validatePassport()) {
      return
    }

    // Proceed to payment page with booking details
    router.push(
      `/payment?doctor=${doctor.id}&date=${date?.toISOString()}&time=${timeSlot}&amount=${calculateTotalCost()}`,
    )
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label>{t("booking.selectDate")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal mt-1", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toLocaleDateString() : t("booking.selectDate")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) =>
                      date < new Date() ||
                      date > new Date(new Date().setDate(new Date().getDate() + 30)) ||
                      date.getDay() === 0
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {date && (
              <div>
                <Label>{t("booking.selectTime")}</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={timeSlot === time ? "default" : "outline"}
                      className="text-sm"
                      onClick={() => setTimeSlot(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>{t("booking.currency")}</Label>
              <Select
                value={selectedCurrency.code}
                onValueChange={(value) => {
                  const currency = currencies.find((c) => c.code === value)
                  if (currency) setSelectedCurrency(currency)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("booking.selectCurrency")} />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{t("booking.currencyNote")}</p>
            </div>

            <div className="mt-4 p-4 bg-muted rounded-md">
              <div className="flex justify-between items-center font-medium">
                <span>{t("booking.consultationFee")}</span>
                <span>{convertPrice(doctor.price)}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={onCancel}>
                {t("booking.cancel")}
              </Button>
              <Button onClick={() => setStep(2)} disabled={!date || !timeSlot}>
                {t("booking.next")}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      case 2:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("booking.firstName")}</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("booking.lastName")}</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("booking.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("booking.phone")}</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
            </div>

            <div className="mt-6">
              <h3 className="text-base font-medium mb-3">{t("booking.identification")}</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="country">{t("booking.country")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between" id="country">
                        {formData.country
                          ? countries.find((country) => country === formData.country)
                          : t("booking.selectCountry")}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder={t("booking.selectCountry")} />
                        <CommandList>
                          <CommandEmpty>{t("booking.noCountryFound")}</CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-y-auto">
                            {countries.map((country) => (
                              <CommandItem
                                key={country}
                                value={country}
                                onSelect={(currentValue) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    country: currentValue === formData.country ? "" : currentValue,
                                  }))
                                  // Clear passport error when country changes
                                  setPassportError("")
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.country === country ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {country}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="passportNumber">{t("booking.passportNumber")}</Label>
                    <span className="text-xs text-muted-foreground">{t("booking.passportNumberDesc")}</span>
                  </div>
                  <Input
                    id="passportNumber"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. AB1234567"
                    className={passportError ? "border-red-500" : ""}
                  />
                  {passportError && <p className="text-sm text-red-500 mt-1">{passportError}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">{t("booking.reason")}</Label>
              <RadioGroup
                defaultValue={formData.reason}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, reason: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Checkup" id="checkup" />
                  <Label htmlFor="checkup">{t("booking.checkup")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Illness" id="illness" />
                  <Label htmlFor="illness">{t("booking.illness")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Follow-up" id="followup" />
                  <Label htmlFor="followup">{t("booking.followup")}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Surgery" id="surgery" />
                  <Label htmlFor="surgery">{t("booking.surgery")}</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.reason === "Surgery" && (
              <div className="space-y-2">
                <Label htmlFor="surgeryType">{t("booking.surgeryType")}</Label>
                <Select
                  value={formData.surgeryType}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, surgeryType: value }))}
                >
                  <SelectTrigger id="surgeryType">
                    <SelectValue placeholder={t("booking.surgeryType")} />
                  </SelectTrigger>
                  <SelectContent>
                    {surgeryTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {t(type.key)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-4">
              <Label className="text-base">{t("booking.additionalServices")}</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="translator" className="text-sm">
                      {t("booking.translator")}
                    </Label>
                    <p className="text-xs text-muted-foreground">{t("booking.translatorDesc")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">+{convertPrice(50)}</span>
                    <Switch
                      id="translator"
                      checked={formData.additionalServices.translator}
                      onCheckedChange={() => handleCheckboxChange("translator")}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="visa" className="text-sm">
                      {t("booking.visa")}
                    </Label>
                    <p className="text-xs text-muted-foreground">{t("booking.visaDesc")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">+{convertPrice(100)}</span>
                    <Switch
                      id="visa"
                      checked={formData.additionalServices.visa}
                      onCheckedChange={() => handleCheckboxChange("visa")}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="flight" className="text-sm">
                      {t("booking.flight")}
                    </Label>
                    <p className="text-xs text-muted-foreground">{t("booking.flightDesc")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">+{convertPrice(500)}</span>
                    <Switch
                      id="flight"
                      checked={formData.additionalServices.flight}
                      onCheckedChange={() => handleCheckboxChange("flight")}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="hotel" className="text-sm">
                      {t("booking.hotel")}
                    </Label>
                    <p className="text-xs text-muted-foreground">{t("booking.hotelDesc")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">+{convertPrice(200)}</span>
                    <Switch
                      id="hotel"
                      checked={formData.additionalServices.hotel}
                      onCheckedChange={() => handleCheckboxChange("hotel")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span>{t("booking.consultationFee")}</span>
                <span className="font-medium">{convertPrice(doctor.price)}</span>
              </div>
              {formData.additionalServices.translator && (
                <div className="flex justify-between items-center text-sm">
                  <span>{t("booking.translator")}:</span>
                  <span>{convertPrice(50)}</span>
                </div>
              )}
              {formData.additionalServices.visa && (
                <div className="flex justify-between items-center text-sm">
                  <span>{t("booking.visa")}:</span>
                  <span>{convertPrice(100)}</span>
                </div>
              )}
              {formData.additionalServices.flight && (
                <div className="flex justify-between items-center text-sm">
                  <span>{t("booking.flight")}:</span>
                  <span>{convertPrice(500)}</span>
                </div>
              )}
              {formData.additionalServices.hotel && (
                <div className="flex justify-between items-center text-sm">
                  <span>{t("booking.hotel")}:</span>
                  <span>{convertPrice(200)}</span>
                </div>
              )}
              <div className="border-t mt-2 pt-2 flex justify-between items-center font-bold">
                <span>{t("booking.totalCost")}</span>
                <span>{convertPrice(calculateTotalCost())}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="mr-1 h-4 w-4" />
                {t("booking.back")}
              </Button>
              <Button type="submit">{t("booking.proceedToPayment")}</Button>
            </div>
          </form>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">{step === 1 ? t("booking.step1") : t("booking.step2")}</div>

      <div className="p-1">{renderStep()}</div>
    </div>
  )
}

// Sample exchange rates (as of implementation date)
const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", rate: 1 },
  { code: "EUR", name: "Euro", symbol: "€", rate: 0.92 },
  { code: "GBP", name: "British Pound", symbol: "£", rate: 0.79 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rate: 150.14 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", rate: 1.37 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rate: 1.52 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", rate: 7.23 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rate: 83.36 },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", rate: 5.07 },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", rate: 3.67 },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼", rate: 3.75 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", rate: 1.34 },
  { code: "THB", name: "Thai Baht", symbol: "฿", rate: 35.67 },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", rate: 4.68 },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", rate: 110.25 },
]
