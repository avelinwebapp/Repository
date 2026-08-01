import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { V0Provider } from "@/lib/context"
import dynamic from "next/dynamic"

const V0Setup = dynamic(() => import("@/components/v0-setup"))

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
})

const isV0 = process.env["VERCEL_URL"]?.includes("vusercontent.net") ?? false

export const metadata: Metadata = {
  metadataBase: new URL("https://www.avelin.kr"),
  title: "AVELIN | 아벨린",
  description: "아벨린(Avelin) 공식 웹사이트에 오신 것을 환영합니다.",
  openGraph: {
    title: "AVELIN | 아벨린",
    description: "아벨린(Avelin) 공식 웹사이트에 오신 것을 환영합니다.",
    url: "https://www.avelin.kr",
    siteName: "AVELIN",
    images: [
      {
        url: "/02.main.jpg",
        width: 1200,
        height: 630,
        alt: "AVELIN Main Image",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AVELIN | 아벨린",
    description: "아벨린(Avelin) 공식 웹사이트에 오신 것을 환영합니다.",
    images: ["/02.main.jpg"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", geistSans.variable, geistMono.variable, instrumentSerif.variable)}>
        <V0Provider isV0={isV0}>
          {children}
          {isV0 && <V0Setup />}
        </V0Provider>
      </body>
    </html>
  )
}
