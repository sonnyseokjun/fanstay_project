import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ko } from './src/content/ko'

// 페이지 제목·설명·공유 미리보기 문구는 ko.ts의 meta 한 곳에서 관리한다.
const escape = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
const META: Record<string, string> = {
  '%META_TITLE%': ko.meta.title,
  '%META_DESCRIPTION%': ko.meta.description,
  '%META_OG_TITLE%': ko.meta.ogTitle,
  '%META_OG_DESCRIPTION%': ko.meta.ogDescription,
}

// 개발 중에는 /api 요청을 Django(8000)로 넘긴다.
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'fill-meta',
      transformIndexHtml: (html) => Object.entries(META).reduce((out, [key, value]) => out.replaceAll(key, escape(value)), html),
    },
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
})
