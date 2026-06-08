'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { useAuth } from '@/components/AuthProvider'
import { TreeVisual } from '@/components/TreeVisual'
import { ProgressBar } from '@/components/ProgressBar'
import { QuestCard } from '@/components/QuestCard'
import { useQuestToggle } from '@/components/useQuestToggle'
import { Spinner, Stat } from '@/components/ui'
import { IconArrowRight, IconFeather, IconPlus } from '@/components/icons'
import { STAGE_META } from '@/lib/game'
import type { Quest } from '@/lib/types'

function timeGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardPage() {
  const { user, plant } = useAuth()
  const [quests, setQuests] = useState<Quest[] | null>(null)
  const [greeting, setGreeting] = useState('Welcome back')

  const { toggle, busyId } = useQuestToggle((updated) =>
    setQuests((qs) => qs?.map((q) => (q.id === updated.id ? updated : q)) ?? qs),
  )

  useEffect(() => {
    setGreeting(timeGreeting())
    api.quests.list().then(setQuests).catch(() => setQuests([]))
  }, [])

  const active = quests?.filter((q) => !q.completed) ?? []
  const completed = quests?.filter((q) => q.completed) ?? []
  const stage = plant?.stage ?? 'seedling'
  const stageMeta = STAGE_META[stage]

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="card animate-fade-up overflow-hidden">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-medium text-forest-500">{greeting},</p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-forest-900 sm:text-4xl">
              {user?.username}
            </h1>
            <p className="mt-3 max-w-md text-bark-500">
              Your tree is a <span className="font-semibold text-forest-700">{stageMeta.label}</span>.{' '}
              {stageMeta.blurb} Complete a quest to help it grow.
            </p>

            {plant && (
              <div className="mt-5 max-w-sm">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-semibold text-forest-700">Level {plant.level}</span>
                  <span className="text-bark-400">
                    {plant.xpIntoLevel} / {plant.xpForNextLevel} XP
                  </span>
                </div>
                <ProgressBar value={plant.progress} />
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/quests/new" className="btn-primary">
                <IconPlus className="h-4 w-4" /> New quest
              </Link>
              <Link href="/reflect" className="btn-secondary">
                <IconFeather className="h-4 w-4" /> Reflect
              </Link>
            </div>
          </div>

          <Link
            href="/tree"
            className="flex items-center justify-center rounded-3xl bg-gradient-to-b from-forest-50 to-cream p-6 transition-transform hover:scale-[1.02]"
          >
            <TreeVisual stage={stage} size={200} />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Total XP" value={plant?.exp ?? 0} hint={`Level ${plant?.level ?? 1}`} />
        <Stat label="Active quests" value={active.length} hint="In progress" />
        <Stat label="Completed" value={completed.length} hint="All time" />
      </section>

      {/* Active quests */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-forest-900">Active quests</h2>
          <Link
            href="/quests"
            className="inline-flex items-center gap-1 text-sm font-semibold text-forest-600 hover:text-forest-700"
          >
            View all <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {quests === null ? (
          <div className="flex justify-center py-12">
            <Spinner className="h-7 w-7 text-forest-400" />
          </div>
        ) : active.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 p-10 text-center">
            <p className="text-bark-500">No active quests right now.</p>
            <Link href="/quests/new" className="btn-primary">
              <IconPlus className="h-4 w-4" /> Start a quest
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {active.slice(0, 4).map((quest) => (
              <QuestCard key={quest.id} quest={quest} onToggle={toggle} busy={busyId === quest.id} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
