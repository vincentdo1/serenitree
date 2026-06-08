'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import { ApiError, api } from '@/lib/api'
import { useAuth } from '@/components/AuthProvider'
import { DifficultyBadge } from '@/components/DifficultyBadge'
import { Spinner, SourceBadge } from '@/components/ui'
import { IconArrowRight, IconCheck, IconSparkles, IconTrash } from '@/components/icons'
import { DIFFICULTIES, DIFFICULTY_META } from '@/lib/game'
import type { Difficulty, Quest, Reflection } from '@/lib/types'

export default function QuestDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { setPlant } = useAuth()

  const [quest, setQuest] = useState<Quest | null>(null)
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)

  // reflection composer
  const [message, setMessage] = useState('')
  const [savingReflection, setSavingReflection] = useState(false)
  const [prompt, setPrompt] = useState<{ text: string; source: 'llm' | 'local' } | null>(null)
  const [promptLoading, setPromptLoading] = useState(false)

  useEffect(() => {
    Promise.all([api.quests.get(id), api.reflections.list(id)])
      .then(([q, r]) => {
        setQuest(q)
        setReflections(r)
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) setMissing(true)
      })
      .finally(() => setLoading(false))
  }, [id])

  const toggleComplete = async () => {
    if (!quest) return
    setBusy(true)
    try {
      const res = quest.completed
        ? await api.quests.uncomplete(quest.id)
        : await api.quests.complete(quest.id)
      setQuest(res.quest)
      setPlant(res.plant)
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!quest || !confirm('Delete this quest? This cannot be undone.')) return
    await api.quests.remove(quest.id)
    router.push('/quests')
  }

  const fetchPrompt = async () => {
    if (!quest) return
    setPromptLoading(true)
    try {
      const res = await api.insights.reflectionPrompt(quest.title)
      setPrompt({ text: res.prompt, source: res.source })
    } finally {
      setPromptLoading(false)
    }
  }

  const saveReflection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quest || !message.trim()) return
    setSavingReflection(true)
    try {
      const created = await api.reflections.create({ message: message.trim(), questId: quest.id })
      setReflections((rs) => [created, ...rs])
      setMessage('')
      setPrompt(null)
    } finally {
      setSavingReflection(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-7 w-7 text-forest-400" />
      </div>
    )
  }

  if (missing || !quest) {
    return (
      <div className="card p-10 text-center">
        <p className="text-bark-500">This quest could not be found.</p>
        <Link href="/quests" className="btn-secondary mt-4 inline-flex">
          Back to quests
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/quests" className="text-sm font-semibold text-forest-600 hover:text-forest-700">
        ← All quests
      </Link>

      {editing ? (
        <EditForm
          quest={quest}
          onCancel={() => setEditing(false)}
          onSaved={(updated) => {
            setQuest(updated)
            setEditing(false)
          }}
        />
      ) : (
        <div className="card p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <DifficultyBadge difficulty={quest.difficulty} />
            {quest.category && (
              <span className="rounded-full bg-bark-50 px-2.5 py-1 text-xs font-medium text-bark-500">
                {quest.category}
              </span>
            )}
            {quest.completed && (
              <span className="rounded-full bg-forest-100 px-2.5 py-1 text-xs font-semibold text-forest-700">
                Completed
              </span>
            )}
          </div>

          <h1
            className={clsx(
              'mt-3 font-display text-3xl font-semibold text-forest-900',
              quest.completed && 'line-through opacity-70',
            )}
          >
            {quest.title}
          </h1>

          {quest.description && (
            <p className="mt-3 whitespace-pre-wrap text-bark-600">{quest.description}</p>
          )}

          {quest.dueDate && (
            <p className="mt-3 text-sm text-bark-400">
              Due {new Date(quest.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button onClick={toggleComplete} disabled={busy} className="btn-primary">
              {busy ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <>
                  <IconCheck className="h-4 w-4" />
                  {quest.completed ? 'Mark as not done' : `Complete · +${quest.xpReward} XP`}
                </>
              )}
            </button>
            <button onClick={() => setEditing(true)} className="btn-secondary">
              Edit
            </button>
            <button
              onClick={remove}
              className="btn-ghost ml-auto text-rose-500 hover:bg-rose-50"
              aria-label="Delete quest"
            >
              <IconTrash className="h-4 w-4" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Reflections */}
      <section className="card p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold text-forest-900">Reflections</h2>
        <p className="mt-1 text-sm text-bark-500">Note what you did or how it felt.</p>

        <form onSubmit={saveReflection} className="mt-4">
          {prompt && (
            <div className="mb-3 flex items-start gap-2 rounded-2xl bg-forest-50 p-3 text-sm text-forest-800">
              <IconSparkles className="mt-0.5 h-4 w-4 shrink-0 text-forest-500" />
              <span className="flex-1">{prompt.text}</span>
              <SourceBadge source={prompt.source} />
            </div>
          )}
          <textarea
            className="input min-h-[90px] resize-y"
            placeholder="Today I…"
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
            <button type="submit" disabled={savingReflection || !message.trim()} className="btn-primary">
              {savingReflection ? <Spinner className="h-4 w-4" /> : 'Save reflection'}
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-3">
          {reflections.length === 0 ? (
            <p className="text-sm text-bark-400">No reflections yet.</p>
          ) : (
            reflections.map((r) => (
              <div key={r.id} className="rounded-2xl border border-bark-100 p-4">
                <p className="whitespace-pre-wrap text-bark-700">{r.message}</p>
                <p className="mt-2 text-xs text-bark-400">
                  {new Date(r.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

function EditForm({
  quest,
  onCancel,
  onSaved,
}: {
  quest: Quest
  onCancel: () => void
  onSaved: (quest: Quest) => void
}) {
  const [title, setTitle] = useState(quest.title)
  const [description, setDescription] = useState(quest.description)
  const [category, setCategory] = useState(quest.category ?? '')
  const [difficulty, setDifficulty] = useState<Difficulty>(quest.difficulty)
  const [dueDate, setDueDate] = useState(quest.dueDate ? quest.dueDate.slice(0, 10) : '')
  const [saving, setSaving] = useState(false)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await api.quests.update(quest.id, {
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || null,
        difficulty,
        dueDate: dueDate || null, // empty clears the existing due date
      })
      onSaved(updated)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="card space-y-4 p-6 sm:p-8">
      <div>
        <label className="label">Quest</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          className="input min-h-[80px] resize-y"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <span className="label">Difficulty</span>
        <div className="grid grid-cols-4 gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              type="button"
              key={d}
              onClick={() => setDifficulty(d)}
              className={clsx(
                'rounded-2xl border-2 p-2 text-center text-sm font-semibold transition-all',
                difficulty === d ? 'border-forest-500 bg-forest-50' : 'border-bark-100',
              )}
            >
              <span aria-hidden="true">{DIFFICULTY_META[d].emoji}</span> {DIFFICULTY_META[d].label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Category</label>
          <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div>
          <label className="label">Due date</label>
          <input type="date" className="input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
        <button type="submit" disabled={saving || !title.trim()} className="btn-primary">
          {saving ? <Spinner className="h-4 w-4" /> : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
