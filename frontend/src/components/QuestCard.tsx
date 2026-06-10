'use client'

import Link from 'next/link'
import clsx from 'clsx'
import type { Quest } from '@/lib/types'
import { DifficultyBadge } from './DifficultyBadge'
import { IconCheck } from './icons'
import { Spinner } from './ui'

function formatDue(due: string | null): string | null {
  if (!due) return null
  const date = new Date(due)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function QuestCard({
  quest,
  onToggle,
  busy = false,
}: {
  quest: Quest
  onToggle: (quest: Quest) => void
  busy?: boolean
}) {
  const due = formatDue(quest.dueDate)
  const overdue = quest.dueDate && !quest.completed && new Date(quest.dueDate) < new Date()

  return (
    <div
      className={clsx(
        'card flex items-center gap-4 p-4 transition-shadow hover:shadow-glow',
        quest.completed && 'opacity-70',
      )}
    >
      <button
        onClick={() => onToggle(quest)}
        disabled={busy}
        aria-label={quest.completed ? 'Mark as not done' : 'Mark as done'}
        className={clsx(
          'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all',
          quest.completed
            ? 'border-forest-600 bg-forest-600 text-white'
            : 'border-bark-200 text-transparent hover:border-forest-400',
        )}
      >
        {busy ? (
          <Spinner className="h-4 w-4 text-current" />
        ) : (
          <IconCheck className="h-5 w-5" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <Link
          href={`/quests/${quest.id}`}
          className={clsx(
            'block truncate font-medium text-bark-900 hover:text-forest-700',
            quest.completed && 'line-through',
          )}
        >
          {quest.title}
        </Link>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={quest.difficulty} />
          {quest.category && (
            <span className="rounded-full bg-bark-50 px-2.5 py-1 text-xs font-medium text-bark-500">
              {quest.category}
            </span>
          )}
          {due && (
            <span className={clsx('text-xs font-medium', overdue ? 'text-rose-500' : 'text-bark-400')}>
              {overdue ? 'Overdue · ' : 'Due '}
              {due}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
