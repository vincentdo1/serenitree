'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import { ApiError } from '@/lib/api'
import { useAuth } from '@/components/AuthProvider'
import { Logo } from '@/components/Logo'
import { Spinner } from '@/components/ui'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, login, register } = useAuth()
  const [mode, setMode] = useState<Mode>('login')

  const [identifier, setIdentifier] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [loading, user, router])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await login(identifier.trim(), password)
      } else {
        await register(username.trim(), email.trim(), password)
      }
      router.replace('/dashboard')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  const loginAsDemo = async () => {
    setError(null)
    setSubmitting(true)
    try {
      await login('demo', 'serenitree123')
      router.replace('/dashboard')
    } catch {
      setError('Demo account not found. Run `npm run seed` in the backend first.')
      setSubmitting(false)
    }
  }

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Spinner className="h-8 w-8 text-forest-500" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-forest-50 to-cream">
      <header className="p-6">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md animate-fade-up">
          <div className="card p-8">
            <h1 className="font-display text-3xl font-semibold text-forest-900">
              {mode === 'login' ? 'Welcome back' : 'Plant your tree'}
            </h1>
            <p className="mt-1 text-bark-500">
              {mode === 'login'
                ? 'Sign in to tend to your goals.'
                : 'Create an account and start growing.'}
            </p>

            {/* mode toggle */}
            <div className="mt-6 inline-flex w-full rounded-full border border-bark-100 bg-cream/60 p-1">
              {(['login', 'register'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m)
                    setError(null)
                  }}
                  className={clsx(
                    'flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    mode === m ? 'bg-white text-forest-700 shadow-soft' : 'text-bark-400',
                  )}
                >
                  {m === 'login' ? 'Sign in' : 'Sign up'}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
              {mode === 'login' ? (
                <div>
                  <label htmlFor="identifier" className="label">
                    Username or email
                  </label>
                  <input
                    id="identifier"
                    className="input"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="username" className="label">
                      Username
                    </label>
                    <input
                      id="username"
                      className="input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      minLength={3}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="label">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label htmlFor="password" className="label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={mode === 'register' ? 8 : undefined}
                  placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'}
                  required
                />
              </div>

              {error && <p className="text-sm font-medium text-rose-500">{error}</p>}

              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? (
                  <Spinner className="h-4 w-4" />
                ) : mode === 'login' ? (
                  'Sign in'
                ) : (
                  'Create account'
                )}
              </button>
            </form>
          </div>

          {mode === 'login' && (
            <div className="mt-4 text-center">
              <button
                onClick={loginAsDemo}
                disabled={submitting}
                className="btn-secondary w-full"
              >
                Try the demo — no signup needed
              </button>
              <p className="mt-2 text-xs text-bark-400">
                Signs you in as <span className="font-semibold text-bark-600">demo</span> with a
                tree already growing.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
