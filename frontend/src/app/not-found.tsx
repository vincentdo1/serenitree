import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-cream px-4 text-center">
      <Logo />
      <p className="font-display text-6xl font-semibold text-forest-300">404</p>
      <h1 className="text-xl font-semibold text-forest-900">This path leads nowhere</h1>
      <p className="max-w-sm text-bark-500">
        The page you’re looking for has wandered off into the forest.
      </p>
      <Link href="/" className="btn-primary">
        Back to safety
      </Link>
    </main>
  )
}
