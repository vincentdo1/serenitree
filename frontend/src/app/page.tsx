import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { TreeVisual } from '@/components/TreeVisual'
import { IconArrowRight, IconFeather, IconScroll, IconSparkles, IconSprout } from '@/components/icons'

const FEATURES = [
  {
    icon: IconScroll,
    title: 'Set quests',
    body: 'Turn goals into quests and choose a foe to defeat — from a humble Slime to an epic Dragon.',
  },
  {
    icon: IconSprout,
    title: 'Grow your tree',
    body: 'Every quest you complete earns XP that grows a magical tree through five living stages.',
  },
  {
    icon: IconFeather,
    title: 'Reflect weekly',
    body: 'Journal what you did and how it felt. Small reflections build real self-awareness.',
  },
  {
    icon: IconSparkles,
    title: 'Weekly recap',
    body: 'See what you accomplished each week and celebrate the progress you made.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 via-cream to-cream">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost">
            Sign in
          </Link>
          <Link href="/login" className="btn-primary">
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:py-20">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-forest-600 shadow-soft">
            <IconLeafDot /> Self-growth, gamified
          </span>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-forest-900 sm:text-6xl">
            Grow your goals into something{' '}
            <span className="text-forest-500">beautiful.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-bark-500">
            Serenitree turns your personal goals into quests for a magical tree. Complete them,
            reflect on your week, and watch your tree — and yourself — flourish.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="btn-primary text-base">
              Start growing <IconArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features" className="btn-secondary text-base">
              See how it works
            </a>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute inset-0 -z-10 rounded-full bg-forest-200/40 blur-3xl" />
          <div className="animate-float">
            <TreeVisual stage="mature" size={360} animate={false} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-forest-900 sm:text-4xl">
            A calmer way to chase your goals
          </h2>
          <p className="mt-3 text-bark-500">
            No streaks to break, no guilt — just steady, visible growth.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-100 text-forest-700">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-forest-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bark-500">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="card overflow-hidden">
          <div className="flex flex-col items-center gap-4 bg-gradient-to-br from-forest-600 to-forest-700 p-10 text-center sm:p-14">
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              Plant your first quest today
            </h2>
            <p className="max-w-md text-forest-100">
              It takes thirty seconds to start, and your tree will thank you.
            </p>
            <Link
              href="/login"
              className="btn mt-2 bg-white text-base text-forest-700 hover:bg-forest-50"
            >
              Create your free account <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-bark-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-bark-400 sm:flex-row">
          <Logo showText />
          <p>Built at HackIllinois · Serenitree</p>
        </div>
      </footer>
    </div>
  )
}

function IconLeafDot() {
  return <span className="h-2 w-2 rounded-full bg-forest-400" aria-hidden="true" />
}
