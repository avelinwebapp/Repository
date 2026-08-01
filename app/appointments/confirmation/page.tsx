"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { CalendarDays, CheckCircle, ChevronLeft, Clock, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const doctorId = searchParams.get("doctor")
  const dateParam = searchParams.get("date")
  const timeSlot = searchParams.get("time")

  // Additional services would typically come from the form submission
  // For demo purposes, we're hardcoding some selected services
  const selectedServices = {
    translator: true,
    visa: false,
    flight: true,
    hotel: true,
  }

  const [doctor, setDoctor] = useState<any>(null)
  const [date, setDate] = useState<Date | null>(null)

  useEffect(() => {
    // In a real app, this would be fetched from an API
    const doctorData = doctors.find((d) => d.id === doctorId) || doctors[0]
    setDoctor(doctorData)

    if (dateParam) {
      setDate(new Date(dateParam))
    }
  }, [doctorId, dateParam])

  const calculateTotalCost = () => {
    if (!doctor) return 0

    let total = doctor.price
    if (selectedServices.translator) total += 50
    if (selectedServices.visa) total += 100
    if (selectedServices.flight) total += 500
    if (selectedServices.hotel) total += 200

    return total
  }

  if (!doctor || !date) {
    return <div className="container mx-auto px-4 py-6">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/appointments"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to appointments
        </Link>
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Appointment Confirmed!</h1>
          <p className="text-muted-foreground mt-1">Your appointment has been successfully scheduled.</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="rounded-lg overflow-hidden relative aspect-square">
                  <Image
                    src={doctor.image || "/placeholder.svg"}
                    alt={`Dr. ${doctor.name}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="font-semibold text-lg">{doctor.name}</h2>
                <p className="text-muted-foreground">{doctor.specialty}</p>

                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Date</div>
                      <div>{date.toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Time</div>
                      <div>{timeSlot}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Location</div>
                      <div>{doctor.location}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-2">Booking Summary</h3>
              <div className="space-y-1 mb-3">
                <div className="flex justify-between">
                  <span>Consultation Fee:</span>
                  <span>${doctor.price}</span>
                </div>
                {selectedServices.translator && (
                  <div className="flex justify-between text-sm">
                    <span>Translator Service:</span>
                    <span>$50</span>
                  </div>
                )}
                {selectedServices.visa && (
                  <div className="flex justify-between text-sm">
                    <span>Visa Processing:</span>
                    <span>$100</span>
                  </div>
                )}
                {selectedServices.flight && (
                  <div className="flex justify-between text-sm">
                    <span>Flight Booking:</span>
                    <span>$500</span>
                  </div>
                )}
                {selectedServices.hotel && (
                  <div className="flex justify-between text-sm">
                    <span>Hotel Booking:</span>
                    <span>$200</span>
                  </div>
                )}
                <div className="border-t pt-1 mt-2 flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${calculateTotalCost()}</span>
                </div>
              </div>
            </div>

            <div className="border-t mt-6 pt-6">
              <h3 className="font-medium mb-2">Important Information</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Please arrive 15 minutes before your appointment time.</li>
                <li>Bring your insurance card and ID.</li>
                <li>If you need to cancel or reschedule, please do so at least 24 hours in advance.</li>
                <li>A confirmation email has been sent to your registered email address.</li>
                {selectedServices.translator && <li>Your translator will be available at the appointment time.</li>}
                {selectedServices.visa && <li>Our visa processing team will contact you within 24 hours.</li>}
                {selectedServices.flight && <li>Flight booking details will be sent to your email within 48 hours.</li>}
                {selectedServices.hotel && <li>Hotel booking confirmation will be sent to your email.</li>}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button className="flex-1" asChild>
                <Link href="/appointments">View My Appointments</Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/">Book Another Appointment</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const doctors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Family Medicine",
    category: "primary",
    rating: 4.9,
    location: "Downtown Medical Center",
    availability: "Available today",
    price: 120,
    image: "/female-doctor-stethoscope.png",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Cardiologist",
    category: "specialist",
    rating: 4.8,
    location: "Heart & Vascular Institute",
    availability: "Next available: Tomorrow",
    price: 200,
    image: "/placeholder.svg?key=ixrl8",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    category: "primary",
    rating: 4.9,
    location: "Children's Wellness Center",
    availability: "Available today",
    price: 150,
    image: "/placeholder.svg?key=uhka3",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Dentist",
    category: "dentist",
    rating: 4.7,
    location: "Bright Smile Dental Care",
    availability: "Next available: Friday",
    price: 180,
    image: "/placeholder.svg?key=dbjmk",
  },
  {
    id: "5",
    name: "Dr. Lisa Thompson",
    specialty: "Dermatologist",
    category: "specialist",
    rating: 4.8,
    location: "Clear Skin Dermatology",
    availability: "Next available: Monday",
    price: 190,
    image: "/placeholder.svg?key=kwiea",
  },
  {
    id: "6",
    name: "Dr. Robert Davis",
    specialty: "Orthopedic Surgeon",
    category: "specialist",
    rating: 4.9,
    location: "Advanced Orthopedic Center",
    availability: "Next available: Wednesday",
    price: 250,
    image: "/placeholder.svg?key=riq87",
  },
]
