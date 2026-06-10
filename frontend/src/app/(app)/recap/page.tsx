'use client'

import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { PageHeader, Spinner, SourceBadge, Stat } from '@/components/ui'
import { IconSparkles } from '@/components/icons'
import { STAGE_META } from '@/lib/game'
import type { RecapResponse } from '@/lib/types'

export default function RecapPage() {
  const [recap, setRecap] = useState<RecapResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setRecap(await api.insights.weeklyRecap())
    } catch {
      setRecap(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Weekly recap" subtitle="A look back at the last seven days." />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-7 w-7 text-forest-400" />
        </div>
      ) : !recap ? (
        <div className="card p-10 text-center text-bark-500">Could not load your recap.</div>
      ) : (
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-forest-600 to-forest-700 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-forest-100">
                <IconSparkles className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wide">Your week</span>
                <span className="ml-auto">
                  <SourceBadge source={recap.source} />
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-medium leading-snug text-white">
                {recap.summary}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Quests completed" value={recap.stats.questsCompleted} />
            <Stat label="XP earned" value={recap.stats.xpEarned} />
            <Stat label="Reflections" value={recap.stats.reflectionsWritten} />
          </div>

          <div className="card flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-100 text-forest-700">
              🌳
            </div>
            <div>
              <p className="text-sm text-bark-400">Tree status</p>
              <p className="font-semibold text-forest-800">
                Level {recap.stats.level} · {STAGE_META[recap.stats.stage].label}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
