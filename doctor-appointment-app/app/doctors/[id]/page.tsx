"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CalendarDays, ChevronLeft, Clock, MapPin, Star, Stethoscope, ThumbsUp, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookAppointmentForm } from "@/components/book-appointment-form"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/context/language-context"

export default function DoctorPage({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const doctor = doctors.find((d) => d.id === params.id) || doctors[0]
  const [showBookingForm, setShowBookingForm] = useState(false)

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t("doctor.back")}
        </Link>
        <LanguageSwitcher />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="w-full md:w-1/3">
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
              <h1 className="text-2xl font-bold">{doctor.name}</h1>
              <p className="text-muted-foreground">{doctor.specialty}</p>

              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(doctor.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm font-medium">{doctor.rating} • 120+ patient reviews</span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{doctor.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Stethoscope className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{t("doctor.experience")}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{t("doctor.patients")}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">English</Badge>
                <Badge variant="secondary">Spanish</Badge>
                <Badge variant="secondary">In-person visits</Badge>
                <Badge variant="secondary">Video consultations</Badge>
              </div>
            </div>
          </div>

          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">{t("doctor.tabs.about")}</TabsTrigger>
              <TabsTrigger value="reviews">{t("doctor.tabs.reviews")}</TabsTrigger>
              <TabsTrigger value="location">{t("doctor.tabs.location")}</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6">
              <h2 className="text-lg font-semibold mb-3">
                {t("doctor.about.title")} {doctor.name}
              </h2>
              <p className="text-muted-foreground mb-4">
                {doctor.name} is a board-certified {doctor.specialty.toLowerCase()} with over 10 years of experience.
                They specialize in providing comprehensive care for patients of all ages, with a focus on preventive
                medicine and managing chronic conditions.
              </p>

              <h3 className="text-md font-semibold mb-2">{t("doctor.education.title")}</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground mb-4">
                <li>Medical Degree - Harvard Medical School</li>
                <li>Residency - Johns Hopkins Hospital</li>
                <li>Board Certification - American Board of Medical Specialties</li>
              </ul>

              <h3 className="text-md font-semibold mb-2">{t("doctor.specialties.title")}</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground">
                <li>Preventive care</li>
                <li>Chronic disease management</li>
                <li>Women's health</li>
                <li>Geriatric medicine</li>
              </ul>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Patient Reviews</h2>
                <div className="flex items-center">
                  <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mr-2">
                    {doctor.rating}★
                  </div>
                  <span className="text-sm text-muted-foreground">120+ reviews</span>
                </div>
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {["JD", "SM", "RK"][review - 1]}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">{["John D.", "Sarah M.", "Robert K."][review - 1]}</div>
                          <div className="text-xs text-muted-foreground">
                            {["2 weeks ago", "1 month ago", "3 months ago"][review - 1]}
                          </div>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm">
                      {
                        [
                          "Dr. Johnson is an excellent doctor. Very thorough and takes time to listen to all concerns. The office staff is friendly and efficient.",
                          "I've been seeing Dr. Johnson for years and have always received excellent care. Highly recommend!",
                          "Great experience from start to finish. The doctor was knowledgeable and took time to explain everything clearly.",
                        ][review - 1]
                      }
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="location" className="mt-6">
              <h2 className="text-lg font-semibold mb-3">Location & Contact</h2>
              <div className="rounded-lg overflow-hidden mb-4 bg-muted h-64 relative">
                <Image
                  src="/placeholder.svg?key=kc1j9"
                  alt="Map showing location of the medical center"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-md font-semibold mb-2">Address</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {doctor.location}
                    <br />
                    123 Medical Plaza
                    <br />
                    New York, NY 10001
                  </p>

                  <h3 className="text-md font-semibold mb-2">Office Hours</h3>
                  <div className="text-sm text-muted-foreground grid grid-cols-2 gap-1">
                    <div>Monday - Friday</div>
                    <div>8:00 AM - 5:00 PM</div>
                    <div>Saturday</div>
                    <div>9:00 AM - 1:00 PM</div>
                    <div>Sunday</div>
                    <div>Closed</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-2">Contact</h3>
                  <div className="text-sm text-muted-foreground mb-4">
                    <div>Phone: (212) 555-1234</div>
                    <div>Email: contact@{doctor.location.toLowerCase().replace(/\s+/g, "")}.com</div>
                  </div>

                  <h3 className="text-md font-semibold mb-2">Insurance</h3>
                  <p className="text-sm text-muted-foreground">
                    We accept most major insurance plans. Please contact our office to verify your insurance coverage.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">{t("doctor.booking.title")}</h2>

              {!showBookingForm ? (
                <>
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-1">{t("doctor.fee.title")}</div>
                    <div className="text-2xl font-bold">${doctor.price}</div>
                    <div className="text-xs text-muted-foreground">{t("doctor.fee.insurance")}</div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{doctor.availability}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>30 minute appointment</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <ThumbsUp className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>98% positive reviews</span>
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => setShowBookingForm(true)}>
                    {t("doctor.bookNow")}
                  </Button>
                </>
              ) : (
                <BookAppointmentForm doctor={doctor} onCancel={() => setShowBookingForm(false)} />
              )}
            </CardContent>
          </Card>
        </div>
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
    image: "/placeholder.svg?key=gyvjj",
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
    image: "/placeholder.svg?key=czpu7",
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
    image: "/placeholder.svg?key=avsoz",
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
    image: "/placeholder.svg?key=7x80j",
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
    image: "/placeholder.svg?key=dt0lo",
  },
]
