import { ko as t } from '../content/ko'
import { Wordmark } from './Wordmark'

export function Header({ onCta, onHome }: { onCta: () => void; onHome: () => void }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a
          className="site-header__home"
          href="/"
          aria-label={t.header.home}
          onClick={(e) => {
            e.preventDefault()
            onHome()
          }}
        >
          <Wordmark />
        </a>
        <button type="button" className="button button--small" onClick={onCta}>
          {t.header.cta}
        </button>
      </div>
    </header>
  )
}
