import { IconContext } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Faq } from './components/Faq'
import { Features } from './components/Features'
import { Flow } from './components/Flow'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Pricing } from './components/Pricing'
import { Problems } from './components/Problems'
import type { Preselect } from './components/SignupForm'
import { Solution } from './components/Solution'
import { ThankYou } from './components/ThankYou'
import { ko as t } from './content/ko'
import type { CountryCode } from './content/types'
import type { SignupResult } from './lib/api'
import { initPixel, trackLead } from './lib/pixel'
import { track } from './lib/track'

let pageViewSent = false

// 아이콘은 Phosphor 한 종류만 쓰고 굵기를 통일한다.
const ICONS = { size: 22, weight: 'regular' as const }

export default function App() {
  const [result, setResult] = useState<SignupResult | null>(null)
  const [preselect, setPreselect] = useState<Preselect>(null)

  useEffect(() => {
    // 개발 모드(StrictMode)에서 effect가 두 번 실행돼도 방문은 1회만 기록
    if (pageViewSent) return
    pageViewSent = true
    track('page_view')
    initPixel()
  }, [])

  // 감사 화면에서 브라우저 뒤로가기를 누르면 랜딩으로 돌아온다.
  useEffect(() => {
    const onPop = () => setResult(null)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const scrollToSignup = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const form = document.getElementById('signup')
    if (!form) return
    // 고정 헤더(64px)에 가리지 않도록 조금 위에서 멈춘다.
    const top = form.getBoundingClientRect().top + window.scrollY - 80
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' })
  }

  const handleCta = (label: string) => {
    track('cta_click', label)
    if (result) {
      goHome()
      requestAnimationFrame(scrollToSignup)
      return
    }
    scrollToSignup()
  }

  const handleChooseCity = (code: CountryCode, country: string) => {
    setPreselect({ country, nonce: Date.now() })
    handleCta(`price_${code}`)
  }

  const handleDone = (next: SignupResult) => {
    if (next.created) trackLead()
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
    <IconContext.Provider value={ICONS}>
      <a className="skip-link" href="#signup">
        {t.header.skipToForm}
      </a>
      <Header onCta={() => handleCta('header')} onHome={goHome} />
      {result ? (
        <ThankYou result={result} onBack={goHome} />
      ) : (
        <main>
          <Hero preselect={preselect} onDone={handleDone} />
          <Problems />
          <Solution />
          <Features />
          <Flow />
          <Pricing onChoose={handleChooseCity} />
          <Faq />
        </main>
      )}
      <Footer />
    </IconContext.Provider>
  )
}
