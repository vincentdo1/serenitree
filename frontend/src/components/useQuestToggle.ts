'use client'

import { useState } from 'react'
import { api } from '@/lib/api'
import type { Quest } from '@/lib/types'
import { useAuth } from './AuthProvider'

/**
 * Toggles a quest's completion and keeps the shared plant progress in sync, so
 * the tree/level update everywhere the moment a quest is checked off.
 */
export function useQuestToggle(onUpdated: (quest: Quest) => void) {
  const { setPlant } = useAuth()
  const [busyId, setBusyId] = useState<string | null>(null)

  const toggle = async (quest: Quest) => {
    setBusyId(quest.id)
    try {
      const res = quest.completed
        ? await api.quests.uncomplete(quest.id)
        : await api.quests.complete(quest.id)
      setPlant(res.plant)
      onUpdated(res.quest)
    } catch (err) {
      console.error('Failed to toggle quest:', err)
    } finally {
      setBusyId(null)
    }
  }

  return { toggle, busyId }
}
