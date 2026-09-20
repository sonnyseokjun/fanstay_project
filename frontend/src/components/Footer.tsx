import { ko as t } from '../content/ko'
import { Wordmark } from './Wordmark'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <Wordmark />
        <p>{t.footer.tagline}</p>
        <p className="site-footer__notice">{t.footer.notice}</p>
        <p className="site-footer__copy">{t.footer.copyright}</p>
      </div>
    </footer>
  )
}
