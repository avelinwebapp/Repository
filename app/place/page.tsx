"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Clock, MapPin, Plus, ChevronLeft, Smartphone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Calendar } from "@/components/ui/calendar"
import { motion, AnimatePresence } from "framer-motion"

const formatDate = (date: Date) => {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

interface Space {
  id: string
  name: string
  type: string
  image: string
}

const spaces: Space[] = [
  {
    id: "room",
    name: "1F - 아베린 룸",
    type: "Private Room (SEAT 001 - 004)",
    image: "/avelin_room_1.jpg",
  },
]

interface Reservation {
  id: string
  space: Space
  seat: string
  date: Date
  time: string
  location: string
  status: "upcoming" | "completed" | "cancelled"
  phone?: string
  drink?: string
  food?: string
}

export default function PlacePage() {
  const router = useRouter()

  // Reservations List state
  const [reservations, setReservations] = useState<Reservation[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("avelin_reservations")
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((res: any) => ({
          ...res,
          date: new Date(res.date)
        }))
        setReservations(parsed)
      } catch (e) {
        console.error(e)
      }
    } else {
      const initial: Reservation[] = [
        {
          id: "1",
          space: spaces[0],
          seat: "R01",
          date: new Date(new Date().setDate(new Date().getDate() + 2)),
          time: "14:00 - 16:00",
          location: "아베린 본점 (Avelin Main)",
          status: "upcoming",
          phone: "010-1234-5678"
        },
        {
          id: "2",
          space: spaces[0],
          seat: "R03",
          date: new Date(new Date().setDate(new Date().getDate() - 7)),
          time: "19:00 - 21:00",
          location: "아베린 본점 (Avelin Main)",
          status: "completed",
          phone: "010-9876-5432"
        },
      ]
      setReservations(initial)
      localStorage.setItem("avelin_reservations", JSON.stringify(initial))
    }
  }, [])

  // Helper to update reservations in state and localStorage
  const saveReservations = (newRes: Reservation[]) => {
    setReservations(newRes)
    localStorage.setItem("avelin_reservations", JSON.stringify(newRes))
  }

  // New Booking State
  const [selectedSpaceId, setSelectedSpaceId] = useState(spaces[0].id)
  const [selectedSeat, setSelectedSeat] = useState<string>("R01")
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined)
  const [bookingTime, setBookingTime] = useState("10:00")
  const [phone, setPhone] = useState("")
  const [dateList, setDateList] = useState<Date[]>([])

  // Lookup state
  const [lookupPhone, setLookupPhone] = useState("")
  const [searchedPhone, setSearchedPhone] = useState<string | null>(null)
  
  // UI state
  const [activeMode, setActiveMode] = useState<"reserve" | "lookup">("reserve")

  // Selected Menu state
  const [selectedDrink, setSelectedDrink] = useState<string | null>(null)
  const [selectedFood, setSelectedFood] = useState<string | null>(null)

  useEffect(() => {
    setSelectedDrink(localStorage.getItem("selected_drink"))
    setSelectedFood(localStorage.getItem("selected_food"))
  }, [])

  const filteredReservations = searchedPhone
    ? reservations.filter(res => res.phone === searchedPhone)
    : []

  // Generate next 30 days for selector
  useEffect(() => {
    const list: Date[] = []
    for (let i = 0; i < 30; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      d.setHours(0, 0, 0, 0)
      list.push(d)
    }
    setDateList(list)
  }, [])

  const getDayOfWeek = (date: Date) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"]
    return days[date.getDay()]
  }

  const formatPhoneNumber = (value: string) => {
    if (!value) return value
    const clean = value.replace(/[-\s]/g, "")
    if (/[^\d]/.test(clean)) {
      return value
    }
    const phoneNumber = clean
    const phoneNumberLength = phoneNumber.length
    if (phoneNumberLength < 4) return phoneNumber
    if (phoneNumberLength < 8) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`
  }

  // Parse URL search parameters on mount for deep linking / direct booking
  useEffect(() => {
    document.title = "아베린 공간 예약 | Avelin Reservations"
    const searchParams = new URLSearchParams(window.location.search);
    const spaceId = searchParams.get("spaceId");
    const seat = searchParams.get("seat");

    if (spaceId && spaces.some(s => s.id === spaceId)) {
      setSelectedSpaceId(spaceId);
    }
    if (seat) {
      setSelectedSeat(seat);
    }
  }, []);

  const cancelReservation = (id: string) => {
    const updated = reservations.map((res) => (res.id === id ? { ...res, status: "cancelled" as const } : res))
    saveReservations(updated)
  }

  const handleSeatClick = (seat: string) => {
    if (!bookingDate) {
      setSelectedSeat(seat)
      return
    }
    const isDuplicate = reservations.some((res) => {
      if (res.status === "cancelled") return false
      const resDate = new Date(res.date)
      const isSameDate = 
        resDate.getFullYear() === bookingDate.getFullYear() &&
        resDate.getMonth() === bookingDate.getMonth() &&
        resDate.getDate() === bookingDate.getDate()
      
      return (
        isSameDate &&
        res.time === bookingTime &&
        res.space.id === selectedSpaceId &&
        res.seat === seat
      )
    })

    if (isDuplicate) {
      alert("해당 날짜, 시간, 좌석은 이미 예약이 완료되었습니다. 다른 좌석을 선택해주세요.")
      return
    }
    setSelectedSeat(seat)
  }

  // Confirm booking
  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingDate) return

    const selectedSpace = spaces.find((s) => s.id === selectedSpaceId) || spaces[0]

    // Read selected menu from localStorage
    const drink = localStorage.getItem("selected_drink") || undefined
    const food = localStorage.getItem("selected_food") || undefined

    // Check for duplicate reservation again to prevent bypass
    const isDuplicate = reservations.some((res) => {
      if (res.status === "cancelled") return false
      const resDate = new Date(res.date)
      const isSameDate = 
        resDate.getFullYear() === bookingDate.getFullYear() &&
        resDate.getMonth() === bookingDate.getMonth() &&
        resDate.getDate() === bookingDate.getDate()
      
      return (
        isSameDate &&
        res.time === bookingTime &&
        res.space.id === selectedSpaceId &&
        res.seat === selectedSeat
      )
    })

    if (isDuplicate) {
      alert("해당 날짜, 시간, 좌석은 이미 예약이 완료되었습니다. 다른 시간이나 좌석을 선택해주세요.")
      return
    }

    const newRes: Reservation = {
      id: Date.now().toString(),
      space: selectedSpace,
      seat: selectedSeat,
      date: bookingDate,
      time: bookingTime,
      location: "아베린 본점 (Avelin Main)",
      status: "upcoming",
      phone: phone,
      drink: drink,
      food: food
    }

    const updated = [newRes, ...reservations]
    saveReservations(updated)

    // Clear selections in localStorage after successful booking
    localStorage.removeItem("selected_drink")
    localStorage.removeItem("selected_food")
    
    // Auto-login to history list with this phone number
    setSearchedPhone(phone)
    
    // Switch to lookup tab and show alert
    setActiveMode("lookup")
    window.alert("예약이 확정되었습니다.")
    
    // Reset date field
    setBookingDate(undefined)
    setPhone("")

    // Scroll smoothly to reservations list after booking
    const listElement = document.getElementById("reservations-list-section")
    if (listElement) {
      listElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Define the currently expanded space for the left image
  const expanded = spaces.find(s => s.id === selectedSpaceId) || spaces[0]

  return (
    <main className="h-[100dvh] w-full bg-black text-white overflow-hidden flex flex-col relative">
      
      {/* Back to Menu Floating Button */}
      <button 
        onClick={() => router.push("/?view=next")}
        className="absolute top-4 left-4 md:top-6 md:left-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white/90 transition-all shadow-lg"
      >
        <ChevronLeft className="w-4 h-4 text-white/70" />
        <span className="text-sm font-medium tracking-wide">메뉴로 돌아가기</span>
      </button>

      <div className="flex-1 w-full h-full relative grid grid-rows-[30vh_1fr] lg:grid-rows-none lg:grid-cols-[1fr_500px] xl:grid-cols-[1fr_600px]">
        {/* Left Side: Space Image */}
        <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden order-1 lg:order-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={expanded.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src={expanded.image || "/placeholder.svg"}
                alt={expanded.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Side: Booking Form */}
        <div className="relative w-full h-full overflow-y-auto scrollbar-none bg-black/95 border-l border-zinc-800/80 order-2 lg:order-2 flex flex-col p-6 md:p-8 lg:p-10">
          {/* Background soft gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-900/40 rounded-full blur-[120px] pointer-events-none z-0" />
          
          <div className="relative z-10 pb-20">
            {/* Page Title Area */}
            <div className="mb-10 text-center md:text-left flex-shrink-0 pt-16 lg:pt-8">
              <h1 className="text-4xl sm:text-5xl font-serif tracking-wider mb-3 uppercase text-white">Space Reservation</h1>
              <p className="text-zinc-300 text-base sm:text-lg font-medium">원하는 공간을 둘러보고 예약하세요.</p>
            </div>

            {/* Mode Toggle Tabs */}
            <div className="flex bg-zinc-900/50 p-1.5 border border-zinc-800/80 rounded-2xl mb-10 w-full">
              <button
                className={`flex-1 rounded-xl py-3.5 text-base sm:text-lg font-bold transition-all ${activeMode === 'reserve' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                onClick={() => setActiveMode('reserve')}
              >
                예약하기
              </button>
              <button
                className={`flex-1 rounded-xl py-3.5 text-base sm:text-lg font-bold transition-all ${activeMode === 'lookup' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'}`}
                onClick={() => setActiveMode('lookup')}
              >
                예약내역 조회
              </button>
            </div>

            {/* Section 2: Reservations History */}
            {activeMode === "lookup" && (
            <div id="reservations-list-section">
              <div className="mb-6 text-center md:text-left">
                <h2 className="text-3xl font-serif tracking-wider mb-2">MY RESERVATIONS</h2>
                <p className="text-zinc-300 text-sm">예약 및 이용 내역을 관리하세요.</p>
              </div>

              {!searchedPhone ? (
                <div className="w-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-[2rem] p-6 text-center shadow-xl">
                  <Smartphone className="h-12 w-12 mx-auto text-zinc-500 mb-4 animate-pulse" />
                  <h3 className="text-xl font-serif tracking-wider mb-2 text-white">예약 내역 조회</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed">
                    등록된 휴대폰 번호를 입력해 주세요.
                  </p>
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="예약번호 또는 휴대폰 번호 입력"
                      value={lookupPhone}
                      onChange={(e) => setLookupPhone(formatPhoneNumber(e.target.value))}
                      className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl px-4 py-3.5 text-base text-center text-white focus:outline-none focus:border-white transition-colors scheme-dark font-semibold placeholder:text-zinc-700 tracking-wider"
                    />
                    <Button
                      onClick={() => {
                        if (lookupPhone.trim()) {
                          setSearchedPhone(lookupPhone)
                        }
                      }}
                      className="w-full bg-white hover:bg-zinc-200 text-black rounded-xl py-3.5 h-auto font-bold transition-all shadow-md text-sm sm:text-base"
                    >
                      예약 확인하기 (Look up)
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Searched Phone Indicator */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2 bg-zinc-900/40 border border-zinc-800/50 rounded-xl px-4 py-3">
                    <div className="flex items-center text-sm">
                      <Smartphone className="h-5 w-5 text-zinc-400 mr-2" />
                      <span className="text-zinc-300 font-semibold">{searchedPhone}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSearchedPhone(null)
                        setLookupPhone("")
                      }}
                      className="text-xs text-zinc-400 hover:text-white underline transition-all"
                    >
                      다른 번호로 조회하기
                    </button>
                  </div>

                  <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-6 bg-zinc-900/50 p-1 border border-zinc-800/80 rounded-xl">
                      <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white transition-all py-2.5 text-sm font-semibold">이용 예정</TabsTrigger>
                      <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white transition-all py-2.5 text-sm font-semibold">이용 완료</TabsTrigger>
                      <TabsTrigger value="cancelled" className="rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-white transition-all py-2.5 text-sm font-semibold">취소 내역</TabsTrigger>
                    </TabsList>

                    {/* Upcoming Tab Content */}
                    <TabsContent value="upcoming">
                      {filteredReservations.filter((res) => res.status === "upcoming").length > 0 ? (
                        <div className="grid gap-4">
                          {filteredReservations
                            .filter((res) => res.status === "upcoming")
                            .map((res) => (
                              <Card key={res.id} className="bg-zinc-900/40 border-zinc-800/80 backdrop-blur-md rounded-2xl overflow-hidden">
                                <CardContent className="p-4">
                                  <div className="flex gap-4 items-center">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden relative border border-zinc-800 flex-shrink-0">
                                      <Image src={res.space.image} alt={res.space.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-serif text-base text-white truncate">
                                          {res.space.name} <span className="text-zinc-500 font-sans text-xs">({res.seat})</span>
                                        </h3>
                                      </div>
                                      <p className="text-xs text-zinc-400 mb-2">{res.date ? formatDate(res.date) : ''} | {res.time}</p>
                                      <Button
                                        variant="destructive"
                                        onClick={() => cancelReservation(res.id)}
                                        className="h-7 text-xs px-3 rounded-md uppercase tracking-wider transition-all bg-red-950/40 border border-red-900/50 text-red-400 font-bold"
                                      >
                                        취소 (Cancel)
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl">
                          <p className="text-zinc-400 text-sm">예약된 일정이 없습니다.</p>
                        </div>
                      )}
                    </TabsContent>

                    {/* Completed Tab Content */}
                    <TabsContent value="completed">
                      {filteredReservations.filter((res) => res.status === "completed").length > 0 ? (
                        <div className="grid gap-4">
                          {filteredReservations
                            .filter((res) => res.status === "completed")
                            .map((res) => (
                              <Card key={res.id} className="bg-zinc-900/20 border-zinc-800/80 backdrop-blur-md rounded-2xl overflow-hidden opacity-75">
                                <CardContent className="p-4">
                                  <div className="flex gap-4 items-center">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden relative border border-zinc-900 flex-shrink-0">
                                      <Image src={res.space.image} alt={res.space.name} fill className="object-cover grayscale" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-serif text-base text-zinc-300 truncate">
                                        {res.space.name} <span className="text-zinc-500 font-sans text-xs">({res.seat})</span>
                                      </h3>
                                      <p className="text-xs text-zinc-500 mb-2">{res.date ? formatDate(res.date) : ''} | {res.time}</p>
                                      <span className="text-xs text-zinc-400 border border-zinc-800 px-2 py-1 rounded-md">이용 완료</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl">
                          <p className="text-zinc-400 text-sm">이용 내역이 없습니다.</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    {/* Cancelled Tab Content */}
                    <TabsContent value="cancelled">
                      {filteredReservations.filter((res) => res.status === "cancelled").length > 0 ? (
                        <div className="grid gap-4">
                          {filteredReservations
                            .filter((res) => res.status === "cancelled")
                            .map((res) => (
                              <Card key={res.id} className="bg-zinc-900/10 border-zinc-800/40 backdrop-blur-md rounded-2xl overflow-hidden opacity-50">
                                <CardContent className="p-4">
                                  <div className="flex gap-4 items-center">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden relative border border-zinc-900 flex-shrink-0">
                                      <Image src={res.space.image} alt={res.space.name} fill className="object-cover grayscale opacity-50" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-serif text-base text-zinc-500 line-through truncate">
                                        {res.space.name} <span className="text-zinc-600 font-sans text-xs">({res.seat})</span>
                                      </h3>
                                      <p className="text-xs text-zinc-600 mb-2">{res.date ? formatDate(res.date) : ''} | {res.time}</p>
                                      <span className="text-xs text-red-500/80 border border-red-950 px-2 py-1 rounded-md">예약 취소됨</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl">
                          <p className="text-zinc-400 text-sm">취소 내역이 없습니다.</p>
                        </div>
                      )}
                    </TabsContent>

                  </Tabs>
                </div>
              )}
            </div>
            )}

            {/* Section 1: Wide Booking Form */}
            {activeMode === "reserve" && (
            <div className="w-full flex flex-col gap-6">
              
              {/* Selected Menu Display */}
              {(selectedDrink || selectedFood) && (
                <div className="hidden md:flex w-full bg-gradient-to-r from-[#3a0808]/80 via-[#2a0404]/80 to-[#1a0202]/80 border border-white/5 rounded-2xl p-4 md:p-5 flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 mix-blend-overlay pointer-events-none" />
                  <div className="flex-1 min-w-0 flex flex-col gap-3 relative z-10">
                    <span className="text-sm font-bold text-white/70 uppercase tracking-widest">나의 선택한 메뉴 (SELECTED MENU)</span>
                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-base font-semibold">
                      {selectedDrink && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="text-white/80">음료:</span>
                          <span className="text-amber-400 font-bold">{selectedDrink}</span>
                          <button onClick={() => router.push("/?view=next")} className="ml-1 text-xs text-amber-500/80 hover:text-amber-400 border border-amber-900/50 hover:bg-amber-900/30 transition-all rounded-full px-2.5 py-0.5 font-bold">추가/수정</button>
                          <button onClick={() => { localStorage.removeItem("selected_drink"); setSelectedDrink(null); }} className="text-xs text-red-400/80 hover:text-red-300 border border-red-900/50 hover:bg-red-900/30 transition-all rounded-full px-2.5 py-0.5 font-bold">초기화</button>
                        </div>
                      )}
                      {selectedFood && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="text-white/80">음식:</span>
                          <span className="text-amber-400 font-bold">{selectedFood}</span>
                          <button onClick={() => router.push("/?view=next")} className="ml-1 text-xs text-amber-500/80 hover:text-amber-400 border border-amber-900/50 hover:bg-amber-900/30 transition-all rounded-full px-2.5 py-0.5 font-bold">추가/수정</button>
                          <button onClick={() => { localStorage.removeItem("selected_food"); setSelectedFood(null); }} className="text-xs text-red-400/80 hover:text-red-300 border border-red-900/50 hover:bg-red-900/30 transition-all rounded-full px-2.5 py-0.5 font-bold">초기화</button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              <div className="w-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-[2rem] p-8 sm:p-10 md:p-12 shadow-2xl">
                <h2 className="text-3xl sm:text-4xl font-serif tracking-wider text-center border-b border-zinc-800/80 pb-6 mb-10 text-white">
                  RESERVE A SPACE
                </h2>

              <form onSubmit={handleBooking} className="flex flex-col gap-10 sm:gap-12">
                {/* Date Selection (Horizontal Ribbon Slider) */}
                <div className="flex flex-col gap-5 sm:gap-6">
                  <label className="text-base sm:text-lg font-bold text-zinc-300 uppercase tracking-widest">예약 날짜</label>
                  <div className="flex overflow-x-auto gap-4 sm:gap-5 pb-4 scrollbar-none snap-x snap-mandatory">
                    {dateList.map((date) => {
                      const isSelected = bookingDate && formatDate(bookingDate) === formatDate(date)
                      const dayNum = date.getDate()
                      const dayName = getDayOfWeek(date)
                      const monthName = `${date.getMonth() + 1}월`
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6

                      return (
                        <button
                          key={date.toISOString()}
                          type="button"
                          onClick={() => setBookingDate(date)}
                          className={`flex-shrink-0 w-20 h-24 rounded-2xl border flex flex-col items-center justify-center transition-all snap-start ${
                            isSelected
                              ? "bg-white text-black border-white shadow-lg scale-105 font-bold"
                              : "bg-zinc-950 border-zinc-800/80 hover:border-zinc-700 " + 
                                (isWeekend ? "text-zinc-300 hover:text-white" : "text-zinc-400 hover:text-white")
                          }`}
                        >
                          <span className="text-xs opacity-75 font-semibold mb-1">
                            {monthName}
                          </span>
                          <span className="text-2xl sm:text-3xl font-bold font-avenir leading-none">
                            {dayNum}
                          </span>
                          <span className={`text-xs mt-1 font-semibold ${
                            isSelected 
                              ? "text-black" 
                              : date.getDay() === 0 
                                ? "text-red-400" 
                                : date.getDay() === 6 
                                  ? "text-blue-400" 
                                  : "text-zinc-500"
                          }`}>
                            {dayName}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="flex flex-col gap-5 sm:gap-6">
                  <label className="text-base sm:text-lg font-bold text-zinc-300 uppercase tracking-widest">이용 시간</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      "10:00",
                      "11:00",
                      "12:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                      "18:00",
                      "19:00",
                      "20:00",
                    ].map((time) => {
                      const isSelected = bookingTime === time
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setBookingTime(time)}
                          className={`py-3.5 rounded-2xl border text-center text-sm sm:text-base font-bold transition-all ${
                            isSelected 
                              ? "bg-white text-black border-white shadow-md" 
                              : "bg-zinc-950 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:text-white"
                          }`}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Space Selection (Compact Grid) */}
                <div className="flex flex-col gap-5 sm:gap-6">
                  <label className="text-base sm:text-lg font-bold text-zinc-300 uppercase tracking-widest">공간 선택</label>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {spaces.map((s) => {
                      const isSelected = selectedSpaceId === s.id
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedSpaceId(s.id)}
                          className={`flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl border text-center transition-all ${
                            isSelected 
                              ? "bg-white text-black border-white shadow-lg scale-102" 
                              : "bg-zinc-950 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:text-white"
                          }`}
                        >
                          <span className="text-sm sm:text-base font-bold break-all leading-tight">
                            {s.name.replace("1F - ", "").replace("2F - ", "")}
                          </span>
                          <span className="text-xs opacity-75 mt-1.5 font-semibold">
                            {s.name.includes("1F") ? "1F" : "2F"}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Seat Selection */}
                <div className="hidden md:flex flex-col gap-5 sm:gap-6">
                  <label className="text-base sm:text-lg font-bold text-zinc-300 uppercase tracking-widest">좌석 선택</label>
                  <div className="w-full max-w-md sm:max-w-lg mx-auto bg-zinc-950 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col items-center border border-zinc-800/80">
                    
                    {/* Tables Layout */}
                    <div className="w-full flex justify-between px-1 sm:px-2 relative h-[400px] sm:h-[440px]">
                      
                      {/* Left Column (R01 - R04) */}
                      <div className="flex flex-col justify-between relative h-full py-1">
                        {/* The Left Sofa Bar spanning Rows 1-3 */}
                        <div className="absolute left-0 top-0 h-[58%] w-4 sm:w-5 bg-zinc-200 rounded-xl z-0" />
                        
                        {/* Row 1: R01 */}
                        <button
                          type="button"
                          onClick={() => handleSeatClick("R01")}
                          className="relative flex items-center group cursor-pointer z-10 outline-none ml-6 sm:ml-8"
                        >
                          <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-[0.75rem] flex items-center justify-center text-base sm:text-lg font-avenir font-bold transition-all ${
                            selectedSeat === "R01" ? 'bg-black text-white scale-110 shadow-lg ring-4 ring-white ring-offset-2 ring-offset-zinc-950 z-20' : 'bg-zinc-200 text-black group-hover:bg-white'
                          }`}>
                            <span className="scale-y-[1.3] inline-block">R01</span>
                          </div>
                          <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full ml-4 sm:ml-5 transition-all ${
                            selectedSeat === "R01" ? 'bg-zinc-200 scale-110' : 'bg-zinc-200 group-hover:bg-white'
                          }`} />
                        </button>

                        {/* Row 2: R02 */}
                        <button
                          type="button"
                          onClick={() => handleSeatClick("R02")}
                          className="relative flex items-center group cursor-pointer z-10 outline-none ml-6 sm:ml-8"
                        >
                          <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-[0.75rem] flex items-center justify-center text-base sm:text-lg font-avenir font-bold transition-all ${
                            selectedSeat === "R02" ? 'bg-black text-white scale-110 shadow-lg ring-4 ring-white ring-offset-2 ring-offset-zinc-950 z-20' : 'bg-zinc-200 text-black group-hover:bg-white'
                          }`}>
                            <span className="scale-y-[1.3] inline-block">R02</span>
                          </div>
                          <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full ml-4 sm:ml-5 transition-all ${
                            selectedSeat === "R02" ? 'bg-zinc-200 scale-110' : 'bg-zinc-200 group-hover:bg-white'
                          }`} />
                        </button>

                        {/* Row 3: R03 */}
                        <button
                          type="button"
                          onClick={() => handleSeatClick("R03")}
                          className="relative flex items-center group cursor-pointer z-10 outline-none ml-6 sm:ml-8"
                        >
                          <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-[0.75rem] flex items-center justify-center text-base sm:text-lg font-avenir font-bold transition-all ${
                            selectedSeat === "R03" ? 'bg-black text-white scale-110 shadow-lg ring-4 ring-white ring-offset-2 ring-offset-zinc-950 z-20' : 'bg-zinc-200 text-black group-hover:bg-white'
                          }`}>
                            <span className="scale-y-[1.3] inline-block">R03</span>
                          </div>
                          <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full ml-4 sm:ml-5 transition-all ${
                            selectedSeat === "R03" ? 'bg-zinc-200 scale-110' : 'bg-zinc-200 group-hover:bg-white'
                          }`} />
                        </button>

                        {/* Row 4: Empty space placeholder for row alignment */}
                        <div className="h-9 sm:h-11 opacity-0 pointer-events-none" />

                        {/* Row 5: R04 Standalone */}
                        <button
                          type="button"
                          onClick={() => handleSeatClick("R04")}
                          className="relative flex items-center group cursor-pointer z-10 outline-none ml-0"
                        >
                          <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full mr-2 sm:mr-3 transition-all ${
                            selectedSeat === "R04" ? 'bg-zinc-200 scale-110' : 'bg-zinc-200 group-hover:bg-white'
                          }`} />
                          <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-[0.75rem] flex items-center justify-center text-base sm:text-lg font-avenir font-bold transition-all ${
                            selectedSeat === "R04" ? 'bg-black text-white scale-110 shadow-lg ring-4 ring-white ring-offset-2 ring-offset-zinc-950 z-20' : 'bg-zinc-200 text-black group-hover:bg-white'
                          }`}>
                            <span className="scale-y-[1.3] inline-block">R04</span>
                          </div>
                          <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full ml-4 sm:ml-5 transition-all ${
                            selectedSeat === "R04" ? 'bg-zinc-200 scale-110' : 'bg-zinc-200 group-hover:bg-white'
                          }`} />
                        </button>
                      </div>

                      {/* Right Column (R05 - R09) */}
                      <div className="flex flex-col justify-between relative h-full py-1">
                        {/* Decorative Bar (Sofa) spanning R05 to R09 */}
                        <div className="absolute right-0 top-0 bottom-0 w-4 sm:w-5 bg-zinc-200 rounded-xl z-0" />
                        
                        {["R05", "R06", "R07", "R08", "R09"].map((seat) => {
                          const isSelected = selectedSeat === seat;
                          return (
                            <button
                              key={seat}
                              type="button"
                              onClick={() => handleSeatClick(seat)}
                              className="relative flex items-center flex-row-reverse group cursor-pointer z-10 outline-none mr-6 sm:mr-8"
                            >
                              <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-[0.75rem] flex items-center justify-center text-base sm:text-lg font-avenir font-bold transition-all ${
                                  isSelected ? 'bg-black text-white scale-110 shadow-lg ring-4 ring-white ring-offset-2 ring-offset-zinc-950 z-20' : 'bg-zinc-200 text-black group-hover:bg-white'
                                }`}>
                                <span className="scale-y-[1.3] inline-block">{seat}</span>
                              </div>
                              <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full mr-4 sm:mr-5 transition-all ${
                                  isSelected ? 'bg-zinc-200 scale-110' : 'bg-zinc-200 group-hover:bg-white'
                                }`} />
                            </button>
                          )
                        })}
                      </div>

                    </div>

                  </div>
                </div>

                {/* Phone/Reservation Number Input */}
                <div className="flex flex-col gap-5 sm:gap-6">
                  <label className="text-base sm:text-lg font-bold text-zinc-300 uppercase tracking-widest">휴대폰 번호(예약번호)</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    placeholder="예약번호 또는 휴대폰 번호 입력"
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-2xl px-5 py-4 sm:py-5 text-base sm:text-lg text-white focus:outline-none focus:border-white transition-colors scheme-dark font-extrabold placeholder:text-zinc-600 tracking-wider"
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full bg-white hover:bg-zinc-200 text-black rounded-2xl py-5 sm:py-6 h-auto text-lg sm:text-xl font-black transition-all mt-6 shadow-xl tracking-wide">
                  예약 확정하기 (Confirm Reservation)
                </Button>
              </form>
            </div>
            </div>
            )}

          </div>
        </div>
      </div>
    </main>
  )
}
