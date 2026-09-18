import { useEffect, useState } from 'react'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Journey } from './components/Journey'
import { Neighborhoods } from './components/Neighborhoods'
import { Packs } from './components/Packs'
import { Problems } from './components/Problems'
import { SignupForm, type Preselect } from './components/SignupForm'
import { Solution } from './components/Solution'
import { ThankYou } from './components/ThankYou'
import type { AreaCode } from './content/types'
import { useLanguage } from './i18n/LanguageContext'
import type { SignupResult } from './lib/api'
import { track } from './lib/track'

let pageViewSent = false

export default function App() {
  const { lang, t } = useLanguage()
  const [result, setResult] = useState<SignupResult | null>(null)
  const [preselect, setPreselect] = useState<Preselect>(null)

  useEffect(() => {
    // 개발 모드(StrictMode)에서 effect가 두 번 실행돼도 방문은 1회만 기록
    if (pageViewSent) return
    pageViewSent = true
    track('page_view', { lang })
  }, [lang])

  // 감사 화면에서 브라우저 뒤로가기를 누르면 랜딩으로 돌아온다.
  useEffect(() => {
    const onPop = () => setResult(null)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const scrollToSignup = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('signup')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  const handleCta = (label: string) => {
    track('cta_click', { label, lang })
    if (result) {
      goHome()
      requestAnimationFrame(scrollToSignup)
      return
    }
    scrollToSignup()
  }

  const handleChoosePack = (area: AreaCode) => {
    setPreselect({ area, nonce: Date.now() })
    handleCta(`pack_${area}`)
  }

  const handleDone = (next: SignupResult) => {
    setResult(next)
    window.history.pushState({ view: 'thanks' }, '', '#thanks')
    window.scrollTo(0, 0)
  }

  const goHome = () => {
    if (result) {
      setResult(null)
      window.history.pushState(null, '', window.location.pathname + window.location.search)
    }
    window.scrollTo(0, 0)
  }

  return (
    <>
      <a className="skip-link" href="#signup">
        {t.header.skipToForm}
      </a>
      <Header onCta={handleCta} onHome={goHome} />
      {result ? (
        <ThankYou result={result} onBack={goHome} />
      ) : (
        <main>
          <Hero onCta={handleCta} />
          <Problems />
          <Solution />
          <Neighborhoods />
          <Journey />
          <Packs onChoose={handleChoosePack} />
          <SignupForm preselect={preselect} onDone={handleDone} />
          <Faq />
        </main>
      )}
      <Footer />
    </>
  )
}
