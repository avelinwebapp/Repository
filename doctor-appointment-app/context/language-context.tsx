"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Translation } from "@/lib/translations"

type Language = {
  code: string
  name: string
  flag: string
}

type LanguageContextType = {
  currentLanguage: Language
  changeLanguage: (language: Language) => void
  languages: Language[]
  t: (key: string) => string
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
]

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0])
  const [currentTranslations, setCurrentTranslations] = useState<Translation>(translations.en)

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage")
    if (savedLanguage) {
      const language = languages.find((lang) => lang.code === savedLanguage)
      if (language) {
        setCurrentLanguage(language)
        setCurrentTranslations(translations[language.code as keyof typeof translations] || translations.en)
        document.documentElement.lang = language.code
      }
    }
  }, [])

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language)
    setCurrentTranslations(translations[language.code as keyof typeof translations] || translations.en)
    localStorage.setItem("preferredLanguage", language.code)
    document.documentElement.lang = language.code
  }

  const t = (key: string): string => {
    return currentTranslations[key] || key
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
