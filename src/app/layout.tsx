import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '회사 MBTI',
  description: '출근만 하면 달라지는 나의 성격! 회사 속 360도 다른 내 MBTI는?',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <script data-ad-client="ca-pub-4627540690656912" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
} 