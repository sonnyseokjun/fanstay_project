import { useLanguage } from '../i18n/LanguageContext'

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="wordmark wordmark--footer">
          <span className="wordmark__mark" aria-hidden="true" />
          FANSTAY
        </p>
        <p className="site-footer__tagline">{t.footer.tagline}</p>
        <p className="site-footer__note">{t.footer.note}</p>
        <p className="site-footer__note">{t.footer.copyright}</p>
      </div>
    </footer>
  )
}
