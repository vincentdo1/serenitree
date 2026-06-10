import { type Metadata } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'

import '@/styles/tailwind.css'
import { AuthProvider } from '@/components/AuthProvider'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Serenitree — grow your goals',
    template: '%s · Serenitree',
  },
  description:
    'A calm, fantasy-themed companion for setting goals, reflecting on your week, and watching a magical tree grow with every quest you complete.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full`}>
      <body className="min-h-full font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
