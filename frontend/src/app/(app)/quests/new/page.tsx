'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import { ApiError, api } from '@/lib/api'
import { PageHeader, Spinner, SourceBadge } from '@/components/ui'
import { IconArrowRight, IconSparkles } from '@/components/icons'
import { DIFFICULTIES, DIFFICULTY_META } from '@/lib/game'
import type { Difficulty, QuestIdea } from '@/lib/types'

export default function NewQuestPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty>('Slime')
  const [dueDate, setDueDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // AI idea helper
  const [theme, setTheme] = useState('')
  const [ideas, setIdeas] = useState<QuestIdea[] | null>(null)
  const [ideasSource, setIdeasSource] = useState<'llm' | 'local'>('local')
  const [ideasLoading, setIdeasLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      await api.quests.create({
        title: title.trim(),
        description: description.trim() || undefined,
        category: category.trim() || undefined,
        difficulty,
        dueDate: dueDate || undefined,
      })
      router.push('/quests')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
      setSaving(false)
    }
  }

  const fetchIdeas = async () => {
    if (!theme.trim()) return
    setIdeasLoading(true)
    try {
      const res = await api.insights.questIdeas(theme.trim())
      setIdeas(res.ideas)
      setIdeasSource(res.source)
    } catch {
      setIdeas([])
    } finally {
      setIdeasLoading(false)
    }
  }

  const applyIdea = (idea: QuestIdea) => {
    setTitle(idea.title)
    setDifficulty(idea.difficulty)
    setDescription(idea.description)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Start a new quest" subtitle="Name your goal and choose a worthy foe." />

      {/* AI idea helper */}
      <div className="card mb-6 p-5">
        <div className="flex items-center gap-2 text-forest-700">
          <IconSparkles className="h-5 w-5" />
          <h2 className="font-semibold">Need inspiration?</h2>
        </div>
        <p className="mt-1 text-sm text-bark-500">
          Tell us a theme and we&apos;ll suggest a few quests.
        </p>
        <div className="mt-3 flex gap-2">
          <input
            className="input"
            placeholder="e.g. learning guitar, getting fit, reading more"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchIdeas()}
          />
          <button
            type="button"
            onClick={fetchIdeas}
            disabled={ideasLoading || !theme.trim()}
            className="btn-secondary shrink-0"
          >
            {ideasLoading ? <Spinner className="h-4 w-4" /> : 'Suggest'}
          </button>
        </div>

        {ideas && ideas.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-bark-400">
              Suggestions <SourceBadge source={ideasSource} />
            </div>
            {ideas.map((idea, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyIdea(idea)}
                className="flex w-full items-center gap-3 rounded-2xl border border-bark-100 p-3 text-left transition-colors hover:border-forest-300 hover:bg-forest-50"
              >
                <span aria-hidden="true">{DIFFICULTY_META[idea.difficulty].emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-bark-900">
                    {idea.title}
                  </span>
                  <span className="block truncate text-xs text-bark-400">{idea.description}</span>
                </span>
                <IconArrowRight className="h-4 w-4 text-forest-400" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-5 p-6">
        <div>
          <label htmlFor="title" className="label">
            Quest
          </label>
          <input
            id="title"
            className="input"
            placeholder="What do you want to accomplish?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={120}
          />
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description <span className="font-normal text-bark-300">(optional)</span>
          </label>
          <textarea
            id="description"
            className="input min-h-[90px] resize-y"
            placeholder="Add any details or your why."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
          />
        </div>

        <div>
          <span className="label">Difficulty</span>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DIFFICULTIES.map((d) => {
              const meta = DIFFICULTY_META[d]
              const selected = difficulty === d
              return (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={clsx(
                    'flex flex-col items-center gap-1 rounded-2xl border-2 p-3 transition-all',
                    selected
                      ? 'border-forest-500 bg-forest-50'
                      : 'border-bark-100 hover:border-forest-200',
                  )}
                >
                  <span className="text-xl" aria-hidden="true">
                    {meta.emoji}
                  </span>
                  <span className="text-sm font-semibold text-bark-800">{meta.label}</span>
                  <span className="text-xs text-bark-400">{meta.xp} XP</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="label">
              Category <span className="font-normal text-bark-300">(optional)</span>
            </label>
            <input
              id="category"
              className="input"
              placeholder="Body, Mind, Work…"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              maxLength={60}
            />
          </div>
          <div>
            <label htmlFor="due" className="label">
              Due date <span className="font-normal text-bark-300">(optional)</span>
            </label>
            <input
              id="due"
              type="date"
              className="input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-sm font-medium text-rose-500">{error}</p>}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link href="/quests" className="btn-ghost">
            Cancel
          </Link>
          <button type="submit" disabled={saving || !title.trim()} className="btn-primary">
            {saving ? <Spinner className="h-4 w-4" /> : 'Create quest'}
          </button>
        </div>
      </form>
    </div>
  )
}
