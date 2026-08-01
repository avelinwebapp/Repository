"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Feature {
  id: string
  title: string
  description: string
  image: string
}

const features: Feature[] = [
  {
    id: "colors",
    title: "Colors",
    description: "Choose from three bold finishes. iPhone 17 Pro shown in Cosmic Orange.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone%2017%20Pro%20Orange%20Color-uCZ3uSKy2JGsKMuy4xYsHTJmf39Xbv.jpg",
  },
  {
    id: "aluminum",
    title: "Aluminum unibody",
    description: "Precision-crafted from aerospace-grade aluminum for exceptional durability and a premium feel.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone%2017%20Pro%20Orange%20Color-uCZ3uSKy2JGsKMuy4xYsHTJmf39Xbv.jpg",
  },
  {
    id: "vapor",
    title: "Vapor chamber",
    description: "Advanced thermal architecture keeps your device cool during intensive tasks and gaming.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone%2017%20Pro%20Orange%20Color-uCZ3uSKy2JGsKMuy4xYsHTJmf39Xbv.jpg",
  },
  {
    id: "ceramic",
    title: "Ceramic Shield",
    description: "Tougher than any smartphone glass. Four times better drop performance.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone%2017%20Pro%20Orange%20Color-uCZ3uSKy2JGsKMuy4xYsHTJmf39Xbv.jpg",
  },
  {
    id: "display",
    title: "Immersive pro display",
    description: "ProMotion technology with adaptive refresh rates up to 120Hz for incredibly smooth scrolling.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone%2017%20Pro%20Orange%20Color-uCZ3uSKy2JGsKMuy4xYsHTJmf39Xbv.jpg",
  },
  {
    id: "camera",
    title: "Camera Control",
    description: "A new way to capture. Slide to zoom, press lightly to lock focus, and press to take the shot.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone%2017%20Pro%20Orange%20Color-uCZ3uSKy2JGsKMuy4xYsHTJmf39Xbv.jpg",
  },
  {
    id: "action",
    title: "Action button",
    description: "Customize your Action button to instantly access your favorite feature.",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone%2017%20Pro%20Orange%20Color-uCZ3uSKy2JGsKMuy4xYsHTJmf39Xbv.jpg",
  },
]

export function FeatureShowcase() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null)

  const expanded = features.find((f) => f.id === expandedFeature)

  return (
    <div className="relative min-h-screen w-full overflow-hidden grid lg:grid-cols-[420px_1fr]">
      {/* Sidebar - Feature Buttons */}
      <div className="flex flex-col gap-3 p-4 md:p-6 lg:p-8 lg:sticky lg:top-0 h-screen overflow-y-auto max-w-full">
        {/* Color Selector Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[2rem] p-6 mb-2"
        >
          <h3 className="text-white font-semibold mb-2">
            Colors. <span className="text-zinc-400 font-normal">Choose from three bold finishes.</span>
          </h3>
          <p className="text-sm text-zinc-500 mb-4">iPhone 17 Pro shown in Cosmic Orange.</p>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full bg-orange-500 border-2 border-white shadow-lg" />
            <button className="w-10 h-10 rounded-full bg-slate-700 border-2 border-transparent hover:border-white/50 transition-colors" />
            <button className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-transparent hover:border-white/50 transition-colors" />
          </div>
        </motion.div>

        {features.slice(1).map((feature, index) => {
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
                      <p className="text-sm text-zinc-400 leading-relaxed break-words whitespace-normal">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Main Image Area */}
      <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
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
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone%2017%20Pro%20Orange%20Color-uCZ3uSKy2JGsKMuy4xYsHTJmf39Xbv.jpg"
                alt="iPhone 17 Pro"
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
