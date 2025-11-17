import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Everlast Clipper System - Verdiene mit deinen Social Media Videos',
  description: 'Reiche deine Social Media Video-Links ein und verdiene bis zu €10 pro 10.000 Views. Automatisches Tracking und Bonus-System für Content Creator.',
  keywords: 'Social Media, Video, Content Creator, Verdienst, Bonus, TikTok, Instagram, YouTube',
  authors: [{ name: 'Everlast Consulting GmbH' }],
  openGraph: {
    title: 'Everlast Clipper System',
    description: 'Verdiene mit deinen Social Media Videos',
    type: 'website',
    locale: 'de_DE',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-black">
          {children}
        </div>

        {/* Background Grid Effect */}
        <div className="fixed inset-0 bg-grid pointer-events-none z-0" style={{ opacity: 0.03 }}></div>
      </body>
    </html>
  )
}