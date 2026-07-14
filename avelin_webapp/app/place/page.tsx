"use client"
import { FeatureShowcase } from "@/components/feature-showcase"
import { Footer } from "@/components/footer"
import { useRouter } from "next/navigation"

export default function PlacePage() {
  const router = useRouter()
  
  return (
    <main className="min-h-[100dvh] w-full bg-black relative overflow-hidden">
      <Footer 
        view="place"
        setView={() => router.push("/")}
        setVideoSrc={() => {}}
      />
      <FeatureShowcase />
    </main>
  )
}
