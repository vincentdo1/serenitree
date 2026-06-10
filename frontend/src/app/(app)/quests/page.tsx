'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { api } from '@/lib/api'
import { QuestCard } from '@/components/QuestCard'
import { useQuestToggle } from '@/components/useQuestToggle'
import { PageHeader, Spinner } from '@/components/ui'
import { IconPlus } from '@/components/icons'
import type { Quest } from '@/lib/types'

type Filter = 'active' | 'completed' | 'all'
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'all', label: 'All' },
]

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[] | null>(null)
  const [filter, setFilter] = useState<Filter>('active')

  const { toggle, busyId } = useQuestToggle((updated) =>
    setQuests((qs) => qs?.map((q) => (q.id === updated.id ? updated : q)) ?? qs),
  )

  useEffect(() => {
    api.quests.list().then(setQuests).catch(() => setQuests([]))
  }, [])

  const filtered = (quests ?? []).filter((q) =>
    filter === 'all' ? true : filter === 'active' ? !q.completed : q.completed,
  )

  return (
    <div>
      <PageHeader
        title="Your quests"
        subtitle="Every goal you finish feeds your tree."
        action={
          <Link href="/quests/new" className="btn-primary">
            <IconPlus className="h-4 w-4" /> New quest
          </Link>
        }
      />

      <div className="mb-6 inline-flex rounded-full border border-bark-100 bg-white p-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={clsx(
              'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
              filter === f.key ? 'bg-forest-600 text-white' : 'text-bark-500 hover:text-forest-700',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {quests === null ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-7 w-7 text-forest-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-12 text-center">
          <p className="text-bark-500">
            {filter === 'completed' ? 'No completed quests yet.' : 'Nothing here yet.'}
          </p>
          <Link href="/quests/new" className="btn-primary">
            <IconPlus className="h-4 w-4" /> Start a quest
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((quest) => (
            <QuestCard key={quest.id} quest={quest} onToggle={toggle} busy={busyId === quest.id} />
          ))}
        </div>
      )}
    </div>
  )
}
