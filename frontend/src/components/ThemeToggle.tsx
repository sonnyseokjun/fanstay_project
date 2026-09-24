import { Moon, Sun } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { ko as t } from '../content/ko'

type Theme = 'light' | 'dark'

// 선택값은 이 브라우저에만 저장한다(개인정보 아님). 저장값이 없으면 기기 설정을 따른다.
const KEY = 'fanstay.theme'
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme
  if (set === 'light' || set === 'dark') return set
  return darkQuery().matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  // 직접 고르기 전에는 기기 설정이 바뀌면 따라간다.
  useEffect(() => {
    const query = darkQuery()
    const onChange = () => {
      if (!document.documentElement.dataset.theme) setTheme(currentTheme())
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // 저장이 막힌 브라우저에서는 이번 방문 동안만 적용된다.
    }
    setTheme(next)
  }

  const label = theme === 'dark' ? t.header.toLight : t.header.toDark
  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      {theme === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
    </button>
  )
}
