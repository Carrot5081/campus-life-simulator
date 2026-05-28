import { createContext, useContext, useState } from 'react'
import { ui } from '../i18n/ui'
import { eventsEn } from '../i18n/events'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'zh')

  const toggle = () => {
    const next = lang === 'zh' ? 'en' : 'zh'
    setLang(next)
    localStorage.setItem('lang', next)
  }

  const t = (path) => {
    const keys = path.split('.')
    let val = ui[lang]
    for (const k of keys) {
      val = val?.[k]
    }
    return val ?? path
  }

  const tEvent = (eventId, field) => {
    if (lang === 'zh') return null
    return eventsEn[eventId]?.[field] ?? null
  }

  const tChoice = (eventId, label) => {
    if (lang === 'zh') return null
    return eventsEn[eventId]?.choices?.[label] ?? null
  }

  return (
    <LanguageContext.Provider value={{ lang, toggle, t, tEvent, tChoice }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
