"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, LayoutDashboard, ChevronLeft, CheckCircle2, XCircle, Clock, Calendar } from "lucide-react"

interface Space {
  id: string
  name: string
  type: string
  image: string
}

interface Reservation {
  id: string
  space: Space
  seat: string
  date: string
  time: string
  location: string
  status: "upcoming" | "completed" | "cancelled"
  phone?: string
  drink?: string
  food?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filter, setFilter] = useState<"all" | "upcoming" | "cancelled" | "completed">("all")

  useEffect(() => {
    const loadReservations = () => {
      const saved = localStorage.getItem("avelin_reservations")
      if (saved) {
        try {
          setReservations(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to load reservations")
        }
      }
    }
    
    loadReservations()
    
    window.addEventListener("storage", loadReservations)
    return () => window.removeEventListener("storage", loadReservations)
  }, [])

  const updateStatus = (id: string, newStatus: "upcoming" | "completed" | "cancelled") => {
    const updated = reservations.map(res => 
      res.id === id ? { ...res, status: newStatus } : res
    )
    setReservations(updated)
    localStorage.setItem("avelin_reservations", JSON.stringify(updated))
  }

  const deleteReservation = (id: string) => {
    if (window.confirm("정말 이 예약 내역을 완전히 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다)")) {
      const updated = reservations.filter(res => res.id !== id)
      setReservations(updated)
      localStorage.setItem("avelin_reservations", JSON.stringify(updated))
    }
  }

  const filteredReservations = reservations.filter(res => {
    if (filter === "all") return true
    return res.status === filter
  })

  // Summary Metrics
  const totalBookings = reservations.length
  const upcomingBookings = reservations.filter(r => r.status === "upcoming").length
  const cancelledBookings = reservations.filter(r => r.status === "cancelled").length

  return (
    <main className="min-h-screen w-full bg-zinc-950 text-white font-sans p-6 md:p-12 selection:bg-red-900/30">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/")}
            className="w-10 h-10 rounded-full bg-zinc-900/80 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-serif tracking-widest text-[#e8e4d9]">AVELIN ADMIN</h1>
            <p className="text-zinc-500 text-sm mt-1">예약 고객 현황 대시보드</p>
          </div>
        </div>
      </header>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-900/20 border border-white/5 p-6 rounded-3xl shadow-xl flex items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full pointer-events-none" />
          <div className="w-14 h-14 rounded-full bg-blue-950/50 flex items-center justify-center border border-blue-900/50 relative z-10">
            <LayoutDashboard className="w-6 h-6 text-blue-400" />
          </div>
          <div className="relative z-10">
            <p className="text-zinc-400 text-sm font-medium">총 예약 건수</p>
            <p className="text-3xl font-bold text-white mt-1">{totalBookings}</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-950/40 to-zinc-900/20 border border-white/5 p-6 rounded-3xl shadow-xl flex items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[50px] rounded-full pointer-events-none" />
          <div className="w-14 h-14 rounded-full bg-green-950/50 flex items-center justify-center border border-green-900/50 relative z-10">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
          </div>
          <div className="relative z-10">
            <p className="text-zinc-400 text-sm font-medium">진행 예정 예약</p>
            <p className="text-3xl font-bold text-white mt-1">{upcomingBookings}</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-950/40 to-zinc-900/20 border border-white/5 p-6 rounded-3xl shadow-xl flex items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[50px] rounded-full pointer-events-none" />
          <div className="w-14 h-14 rounded-full bg-red-950/50 flex items-center justify-center border border-red-900/50 relative z-10">
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
          <div className="relative z-10">
            <p className="text-zinc-400 text-sm font-medium">취소된 예약</p>
            <p className="text-3xl font-bold text-white mt-1">{cancelledBookings}</p>
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
        
        {/* Table Toolbar */}
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            예약 리스트
          </h2>
          
          <div className="flex bg-zinc-950/50 p-1 rounded-full border border-white/5 w-fit">
            <button 
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${filter === "all" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              전체 보기
            </button>
            <button 
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${filter === "upcoming" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              진행 예정
            </button>
            <button 
              onClick={() => setFilter("cancelled")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${filter === "cancelled" ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              취소됨
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-950/50 text-zinc-400 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">상태</th>
                <th className="px-6 py-4 font-medium">날짜 및 시간</th>
                <th className="px-6 py-4 font-medium">고객 (연락처)</th>
                <th className="px-6 py-4 font-medium">공간 및 좌석</th>
                <th className="px-6 py-4 font-medium">주문 메뉴</th>
                <th className="px-6 py-4 font-medium">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <p className="text-zinc-500">해당 조건의 예약 내역이 없습니다.</p>
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => (
                  <tr key={res.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      {res.status === "upcoming" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-950/50 text-green-400 border border-green-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          UPCOMING
                        </span>
                      )}
                      {res.status === "cancelled" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-950/50 text-red-400 border border-red-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          CANCELLED
                        </span>
                      )}
                      {res.status === "completed" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-950/50 text-blue-400 border border-blue-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          COMPLETED
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        <span className="font-medium">{new Date(res.date).toLocaleDateString('ko-KR')}</span>
                        <Clock className="w-4 h-4 text-zinc-500 ml-2" />
                        <span className="text-zinc-400">{res.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-zinc-300">
                      {res.phone || "미입력"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-amber-500">{res.space.name}</span>
                        <span className="text-xs text-zinc-500 mt-0.5">{res.seat}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 max-w-[200px] md:max-w-[300px]">
                        {res.drink ? (
                          <div className="truncate text-xs"><span className="text-zinc-500 mr-1">음료:</span>{res.drink}</div>
                        ) : (
                          <div className="text-xs text-zinc-700">음료 없음</div>
                        )}
                        {res.food ? (
                          <div className="truncate text-xs"><span className="text-zinc-500 mr-1">음식:</span>{res.food}</div>
                        ) : (
                          <div className="text-xs text-zinc-700">음식 없음</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {res.status !== "upcoming" && (
                          <button 
                            onClick={() => updateStatus(res.id, "upcoming")}
                            className="text-[10px] text-green-400/80 hover:text-green-300 border border-green-900/50 hover:bg-green-900/30 transition-all rounded-full px-2 py-1"
                          >
                            진행 예정으로
                          </button>
                        )}
                        {res.status !== "completed" && (
                          <button 
                            onClick={() => updateStatus(res.id, "completed")}
                            className="text-[10px] text-blue-400/80 hover:text-blue-300 border border-blue-900/50 hover:bg-blue-900/30 transition-all rounded-full px-2 py-1"
                          >
                            완료 처리
                          </button>
                        )}
                        {res.status !== "cancelled" && (
                          <button 
                            onClick={() => updateStatus(res.id, "cancelled")}
                            className="text-[10px] text-red-400/80 hover:text-red-300 border border-red-900/50 hover:bg-red-900/30 transition-all rounded-full px-2 py-1"
                          >
                            예약 취소
                          </button>
                        )}
                        <button 
                          onClick={() => deleteReservation(res.id)}
                          className="text-[10px] text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-900/50 hover:bg-red-950/30 transition-all rounded-full px-2 py-1 ml-1"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
