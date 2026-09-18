import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import ko from '../content/ko'
import type { Content, Lang } from '../content/types'
import zh from '../content/zh'

const CONTENT: Record<Lang, Content> = { zh, ko }
const STORAGE_KEY = 'hanstay.lang'

type LanguageState = { lang: Lang; t: Content; setLang: (lang: Lang) => void }

const LanguageContext = createContext<LanguageState | null>(null)

// 기본은 중국어. ?lang=ko 링크나 이전에 고른 언어가 있으면 그것을 따른다.
function initialLang(): Lang {
  const param = new URLSearchParams(window.location.search).get('lang')
  if (param === 'zh' || param === 'ko') return param
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'zh' || saved === 'ko') return saved
  } catch {
    // 저장소를 쓸 수 없는 환경(사생활 보호 모드 등)
  }
  return 'zh'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const t = CONTENT[lang]

  useEffect(() => {
    document.documentElement.lang = t.meta.htmlLang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [t])

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // 무시
    }
  }

  return <LanguageContext.Provider value={{ lang, t, setLang }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const value = useContext(LanguageContext)
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider')
  return value
}
