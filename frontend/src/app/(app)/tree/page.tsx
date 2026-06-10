'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useAuth } from '@/components/AuthProvider'
import { TreeVisual } from '@/components/TreeVisual'
import { ProgressBar } from '@/components/ProgressBar'
import { Spinner } from '@/components/ui'
import { STAGE_META, STAGE_ORDER } from '@/lib/game'
import type { Stage } from '@/lib/types'

export default function TreePage() {
  const { plant, refresh } = useAuth()
  const [view, setView] = useState<Stage | null>(null)

  // Keep XP current after completing quests elsewhere.
  useEffect(() => {
    void refresh()
  }, [refresh])

  if (!plant) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-7 w-7 text-forest-400" />
      </div>
    )
  }

  const actual = plant.stage
  const shown = view ?? actual
  const meta = STAGE_META[shown]
  const actualIdx = STAGE_ORDER.indexOf(actual)
  const remaining = Math.max(0, plant.xpForNextLevel - plant.xpIntoLevel)
  const previewing = shown !== actual

  return (
    <div className="leaf-backdrop -mx-4 -my-8 px-4 py-12 lg:-mx-10 lg:-my-12 lg:px-10 lg:py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <span className="rounded-full bg-white/70 px-4 py-1 text-sm font-semibold text-forest-700 backdrop-blur">
          Your tree · Level {plant.level}
        </span>

        <div className="my-8 flex h-72 items-end justify-center">
          <TreeVisual stage={shown} size={260} />
        </div>

        <h1 className="font-display text-3xl font-semibold text-forest-900">{meta.label}</h1>
        <p className="mt-2 max-w-sm text-bark-600">{meta.blurb}</p>

        {previewing && (
          <button
            onClick={() => setView(null)}
            className="mt-3 text-sm font-semibold text-forest-600 underline-offset-4 hover:underline"
          >
            ← Back to your tree
          </button>
        )}

        <div className="mt-8 w-full max-w-sm rounded-3xl border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-semibold text-forest-700">{plant.exp} XP total</span>
            <span className="text-bark-400">
              {remaining} XP to level {plant.level + 1}
            </span>
          </div>
          <ProgressBar value={plant.progress} />
        </div>

        {/* Interactive growth journey — tap a stage to watch the tree move there. */}
        <div className="mt-10 w-full">
          <p className="mb-4 text-sm font-medium text-bark-500">
            Your growth journey <span className="text-bark-300">· tap a stage</span>
          </p>
          <ol className="flex items-center justify-between">
            {STAGE_ORDER.map((stage, i) => {
              const reached = i <= actualIdx
              const isShown = stage === shown
              const isActual = stage === actual
              return (
                <li key={stage} className="flex flex-1 flex-col items-center gap-2">
                  <button
                    onClick={() => setView(stage)}
                    aria-label={`Preview the ${STAGE_META[stage].label} stage`}
                    aria-pressed={isShown}
                    className={clsx(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all hover:scale-110',
                      isShown
                        ? 'border-forest-600 bg-forest-600 text-white'
                        : isActual
                          ? 'border-forest-500 bg-forest-100 text-forest-700 ring-2 ring-forest-300 ring-offset-2 ring-offset-cream'
                          : reached
                            ? 'border-forest-300 bg-forest-100 text-forest-700'
                            : 'border-bark-200 bg-white/60 text-bark-400',
                    )}
                  >
                    {i + 1}
                  </button>
                  <span
                    className={clsx(
                      'text-[11px] font-medium',
                      reached ? 'text-forest-700' : 'text-bark-300',
                    )}
                  >
                    {STAGE_META[stage].label}
                  </span>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </div>
  )
}
