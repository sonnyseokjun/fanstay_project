import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'
import { Icon } from '../illustrations/icons'
import type { SignupResult } from '../lib/api'

export function ThankYou({ result, onBack }: { result: SignupResult; onBack: () => void }) {
  const { t } = useLanguage()
  const [status, setStatus] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  // 공유 링크는 언어 파라미터 없이 기본 페이지 주소로 보낸다.
  const shareUrl = `${window.location.origin}${window.location.pathname}`

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'FANSTAY', text: t.thanks.shareText, url: shareUrl })
        return
      } catch (error) {
        if ((error as DOMException).name === 'AbortError') return
      }
    }
    // 위챗 내장 브라우저 등 공유 API가 없으면 링크 복사로 대체
    const text = `${t.thanks.shareText} ${shareUrl}`
    try {
      await navigator.clipboard.writeText(text)
      setStatus(t.thanks.copied)
    } catch {
      setStatus(copyWithTextarea(text) ? t.thanks.copied : t.thanks.copyFailed)
    }
  }

  return (
    <main className="thanks">
      <div className="thanks__ticket">
        <span className="thanks__stamp" aria-hidden="true">
          <Icon name="check" size={28} />
        </span>
        <h1 className="thanks__title" ref={headingRef} tabIndex={-1}>
          {t.thanks.title}
        </h1>
        <p className="thanks__position">
          {result.created ? t.thanks.position(result.position) : t.thanks.already(result.position)}
        </p>
        <p className="thanks__body">{t.thanks.body}</p>
      </div>

      <div className="thanks__share">
        <h2 className="thanks__share-title">{t.thanks.shareTitle}</h2>
        <button type="button" className="button" onClick={share}>
          <Icon name="share" size={18} />
          {t.thanks.shareButton}
        </button>
        <p className="thanks__status" role="status">
          {status}
        </p>
      </div>

      <button type="button" className="text-button" onClick={onBack}>
        {t.thanks.back}
      </button>
    </main>
  )
}

function copyWithTextarea(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  textarea.remove()
  return ok
}
