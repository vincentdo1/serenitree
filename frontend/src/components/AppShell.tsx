'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import { useAuth } from './AuthProvider'
import { Logo } from './Logo'
import { Spinner } from './ui'
import {
  IconFeather,
  IconHome,
  IconLogout,
  IconScroll,
  IconSparkles,
  IconSprout,
} from './icons'

const NAV = [
  { href: '/dashboard', label: 'Home', icon: IconHome },
  { href: '/quests', label: 'Quests', icon: IconScroll },
  { href: '/tree', label: 'Tree', icon: IconSprout },
  { href: '/reflect', label: 'Reflect', icon: IconFeather },
  { href: '/recap', label: 'Recap', icon: IconSparkles },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, plant, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [loading, user, router])

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Spinner className="h-8 w-8 text-forest-500" />
      </div>
    )
  }

  const level = plant?.level ?? 1

  return (
    <div className="min-h-screen bg-cream lg:flex">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-bark-100 bg-white/70 px-5 py-7 backdrop-blur lg:flex">
        <Link href="/dashboard" aria-label="Serenitree home">
          <Logo />
        </Link>
        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-forest-600 text-white shadow-soft'
                    : 'text-bark-600 hover:bg-forest-50 hover:text-forest-700',
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-4 rounded-2xl border border-bark-100 bg-cream/60 p-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-forest-800">{user.username}</p>
              <p className="text-xs text-bark-400">Level {level}</p>
            </div>
            <button
              onClick={logout}
              className="rounded-xl p-2 text-bark-400 transition-colors hover:bg-white hover:text-bark-700"
              aria-label="Log out"
              title="Log out"
            >
              <IconLogout className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-bark-100 bg-cream/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/dashboard" aria-label="Serenitree home">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-forest-100 px-3 py-1 text-xs font-semibold text-forest-700">
            Level {level}
          </span>
          <button
            onClick={logout}
            className="rounded-xl p-1.5 text-bark-400 hover:bg-white hover:text-bark-700"
            aria-label="Log out"
          >
            <IconLogout className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 lg:ml-64">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 pb-28 lg:px-10 lg:py-12">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-bark-100 bg-white/95 backdrop-blur lg:hidden">
        <div className="grid grid-cols-5">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                  active ? 'text-forest-700' : 'text-bark-400',
                )}
              >
                <item.icon className={clsx('h-5 w-5', active && 'text-forest-600')} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
