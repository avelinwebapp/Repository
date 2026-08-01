"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Feature {
  id: string
  title: string
  description: string
  image: string
  concepts: string[]
}

const features: Feature[] = [
  {
    id: "lounge",
    title: "1F - 아베린 라운지",
    description: "다양한 사람들과 어울리며 자유로운 시간을 보낼 수 있는 1층 라운지 공간입니다.",
    image: "/main_page_1_5.jpeg",
    concepts: ["SEAT 001", "SEAT 002", "SEAT 003", "SEAT 004"],
  },
  {
    id: "room",
    title: "1F - 아베린 룸",
    description: "프라이빗한 분위기 속에서 소규모 모임을 즐길 수 있는 1층 룸 공간입니다.",
    image: "/main_page_1_5.jpeg",
    concepts: ["SEAT 001", "SEAT 002", "SEAT 003", "SEAT 004"],
  },
  {
    id: "link",
    title: "2F - 아베린 링크",
    description: "비즈니스 미팅이나 네트워킹에 적합한 2층 커넥팅 공간입니다.",
    image: "/main_page_1_5.jpeg",
    concepts: ["SEAT 001", "SEAT 002", "SEAT 003", "SEAT 004"],
  },
  {
    id: "prive",
    title: "2F - 아베크 프라이베",
    description: "가장 은밀하고 고급스러운 시간을 선사하는 2층 VVIP 프라이빗 공간입니다.",
    image: "/main_page_1_5.jpeg",
    concepts: ["SEAT 001", "SEAT 002", "SEAT 003", "SEAT 004"],
  },
]

interface FeatureShowcaseProps {
  onBookSeat?: (spaceId: string, spaceTitle: string, seatName: string) => void
  activeTab?: "explore" | "my-reservations"
  setActiveTab?: (tab: "explore" | "my-reservations") => void
  reservationsCount?: number
}

export function FeatureShowcase({
  onBookSeat,
  activeTab = "explore",
  setActiveTab,
  reservationsCount = 0,
}: FeatureShowcaseProps) {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  const expanded = features.find((f) => f.id === expandedFeature)

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden grid grid-rows-[40vh_1fr] lg:grid-rows-none lg:grid-cols-[420px_1fr]">
      {/* Sidebar - Feature Buttons */}
      <div className="flex flex-col gap-3 p-4 md:p-6 lg:p-8 order-2 lg:order-1 lg:sticky lg:top-0 h-full lg:h-screen overflow-y-auto max-w-full">
        {/* PLACE Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[2rem] p-6 mb-2"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold text-2xl">
              PLACE
            </h3>
            <div className="flex bg-zinc-950 p-1 border border-zinc-800/80 rounded-xl text-xs">
              <button 
                onClick={() => setActiveTab?.("explore")}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === "explore" ? "bg-zinc-800 text-white font-medium" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                공간 소개
              </button>
              <button 
                onClick={() => onBookSeat?.("lounge", "1F - 아베린 라운지", "SEAT 001")}
                className="px-3 py-1.5 rounded-lg transition-all text-zinc-400 hover:text-white flex items-center gap-1 font-medium"
              >
                예약하기
              </button>
              <button 
                onClick={() => setActiveTab?.("my-reservations")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${activeTab === "my-reservations" ? "bg-zinc-800 text-white font-medium" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                나의 예약
                {reservationsCount > 0 && (
                  <span className="bg-white text-black font-bold rounded-full w-4 h-4 flex items-center justify-center text-[9px]">
                    {reservationsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          <p className="text-sm text-zinc-400">원하는 공간과 컨셉을 선택해주세요.</p>
        </motion.div>

        {features.map((feature, index) => {
          const isExpanded = expandedFeature === feature.id

          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[2rem] overflow-hidden transition-all duration-300"
              style={{
                borderColor: isExpanded ? "rgba(255, 255, 255, 0.3)" : "rgba(39, 39, 42, 1)",
              }}
            >
              <Button
                onClick={() => setExpandedFeature(isExpanded ? null : feature.id)}
                className="w-full justify-start gap-3 bg-transparent hover:bg-zinc-800/50 text-white border-0 rounded-none px-6 py-6 h-auto transition-all duration-300"
              >
                <motion.div animate={{ rotate: isExpanded ? 45 : 0 }} transition={{ duration: 0.3 }}>
                  <Plus className="h-5 w-5 flex-shrink-0" />
                </motion.div>
                <span className="text-base font-medium">{feature.title}</span>
              </Button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 max-w-full">
                      <p className="text-sm text-zinc-400 leading-relaxed break-words whitespace-normal mb-4">
                        {feature.description}
                      </p>
                      
                      <button
                        onClick={() => onBookSeat?.(feature.id, feature.title, "SEAT 001")}
                        className="w-full py-2.5 mb-4 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        이 공간 예약하기 (Book Space)
                      </button>
                      
                      {feature.concepts && (
                        <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
                          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">Select Concept</p>
                          <div className="flex flex-wrap gap-2">
                            {feature.concepts.map(concept => (
                              <button 
                                key={concept} 
                                onClick={() => onBookSeat?.(feature.id, feature.title, concept)}
                                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 hover:text-white hover:border-white/30 transition-all shadow-sm"
                              >
                                {concept}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Main Image Area */}
      <div className="relative w-full h-[40vh] lg:h-screen bg-black flex items-center justify-center overflow-hidden order-1 lg:order-2">
        <AnimatePresence mode="wait">
          {expanded ? (
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
                alt={expanded.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src="/main_page_1_5.jpeg"
                alt="Avelin Space"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
