'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { PageHeader, Spinner, SourceBadge } from '@/components/ui'
import { IconSparkles, IconTrash } from '@/components/icons'
import type { Quest, Reflection } from '@/lib/types'

export default function ReflectPage() {
  const [reflections, setReflections] = useState<Reflection[] | null>(null)
  const [quests, setQuests] = useState<Quest[]>([])
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [prompt, setPrompt] = useState<{ text: string; source: 'llm' | 'local' } | null>(null)
  const [promptLoading, setPromptLoading] = useState(false)

  useEffect(() => {
    api.reflections.list().then(setReflections).catch(() => setReflections([]))
    api.quests.list().then(setQuests).catch(() => setQuests([]))
  }, [])

  const questTitle = useMemo(() => {
    const map = new Map(quests.map((q) => [q.id, q.title]))
    return (id: string | null) => (id ? map.get(id) : undefined)
  }, [quests])

  const fetchPrompt = async () => {
    setPromptLoading(true)
    try {
      const res = await api.insights.reflectionPrompt()
      setPrompt({ text: res.prompt, source: res.source })
    } finally {
      setPromptLoading(false)
    }
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSaving(true)
    try {
      const created = await api.reflections.create({ message: message.trim() })
      setReflections((rs) => [created, ...(rs ?? [])])
      setMessage('')
      setPrompt(null)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    await api.reflections.remove(id)
    setReflections((rs) => rs?.filter((r) => r.id !== id) ?? rs)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Reflect" subtitle="A quiet place to look back and learn." />

      <form onSubmit={save} className="card p-6">
        {prompt && (
          <div className="mb-3 flex items-start gap-2 rounded-2xl bg-forest-50 p-3 text-sm text-forest-800">
            <IconSparkles className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" />
            <span className="flex-1">{prompt.text}</span>
            <SourceBadge source={prompt.source} />
          </div>
        )}
        <textarea
          className="input min-h-[110px] resize-y"
          placeholder="What happened this week, and how do you feel about it?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={2000}
        />
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={fetchPrompt}
            disabled={promptLoading}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-600 hover:text-forest-700"
          >
            {promptLoading ? <Spinner className="h-4 w-4" /> : <IconSparkles className="h-4 w-4" />}
            Get a prompt
          </button>
          <button type="submit" disabled={saving || !message.trim()} className="btn-primary">
            {saving ? <Spinner className="h-4 w-4" /> : 'Save reflection'}
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-3">
        {reflections === null ? (
          <div className="flex justify-center py-12">
            <Spinner className="h-7 w-7 text-forest-400" />
          </div>
        ) : reflections.length === 0 ? (
          <p className="py-10 text-center text-bark-400">
            Your reflections will appear here. Start with one above.
          </p>
        ) : (
          reflections.map((r) => {
            const title = questTitle(r.questId)
            return (
              <div key={r.id} className="card flex items-start gap-3 p-4">
                <div className="min-w-0 flex-1">
                  {title && (
                    <Link
                      href={`/quests/${r.questId}`}
                      className="mb-1 inline-block text-xs font-semibold text-forest-600 hover:text-forest-700"
                    >
                      {title}
                    </Link>
                  )}
                  <p className="whitespace-pre-wrap text-bark-700">{r.message}</p>
                  <p className="mt-2 text-xs text-bark-400">
                    {new Date(r.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </p>
                </div>
                <button
                  onClick={() => remove(r.id)}
                  className="rounded-lg p-1.5 text-bark-300 transition hover:bg-rose-50 hover:text-rose-500 focus-visible:bg-rose-50 focus-visible:text-rose-500"
                  aria-label="Delete reflection"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
