import { ShareNetwork } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { ko as t } from '../content/ko'
import type { SignupResult } from '../lib/api'

export function ThankYou({ result, onBack }: { result: SignupResult; onBack: () => void }) {
  const [status, setStatus] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const th = t.thanks

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  const shareUrl = `${window.location.origin}/`

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: th.shareTitle, text: th.shareText, url: shareUrl })
        return
      } catch (error) {
        if ((error as DOMException).name === 'AbortError') return
      }
    }
    // 공유 기능이 없는 브라우저(대부분의 데스크톱)에서는 링크를 복사한다.
    const text = `${th.shareText} ${shareUrl}`
    try {
      await navigator.clipboard.writeText(text)
      setStatus(th.copied)
    } catch {
      setStatus(copyWithTextarea(text) ? th.copied : th.copyFailed)
    }
  }

  return (
    <main className="thanks">
      <div className="thanks__sheet">
        <h1 className="thanks__title" ref={headingRef} tabIndex={-1}>
          {th.title}
        </h1>
        <p className="thanks__position">
          <span className="thanks__marker">{result.created ? th.position(result.position) : th.already(result.position)}</span>
        </p>
        <p className="thanks__body">{th.body}</p>
        <div className="thanks__actions">
          <button type="button" className="button" onClick={share}>
            <ShareNetwork size={20} aria-hidden="true" />
            {th.share}
          </button>
          <button type="button" className="text-button" onClick={onBack}>
            {th.back}
          </button>
        </div>
        <p className="thanks__status" role="status">
          {status}
        </p>
      </div>
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
