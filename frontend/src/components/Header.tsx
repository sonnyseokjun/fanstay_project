import type { Lang } from '../content/types'
import { useLanguage } from '../i18n/LanguageContext'

export function Header({ onCta, onHome }: { onCta: (label: string) => void; onHome: () => void }) {
  const { t, setLang } = useLanguage()
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a
          className="wordmark"
          href="#top"
          aria-label={t.header.home}
          onClick={(e) => {
            e.preventDefault()
            onHome()
          }}
        >
          <span className="wordmark__mark" aria-hidden="true" />
          FANSTAY
        </a>
        <div className="site-header__actions">
          <button
            type="button"
            className="lang-switch"
            lang={t.header.switchTo === 'ko' ? 'ko' : 'zh-CN'}
            onClick={() => setLang(t.header.switchTo as Lang)}
          >
            {t.header.switchLabel}
          </button>
          <button type="button" className="button button--small" onClick={() => onCta('header')}>
            {t.header.cta}
          </button>
        </div>
      </div>
    </header>
  )
}
