// AI-assisted endpoints (skeleton for a future feature). Each works without an
// API key by falling back to deterministic local content, so the UI never breaks.
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { and, desc, eq, gte } from 'drizzle-orm'
import { db } from '../db'
import { plants, quests, reflections } from '../schema'
import { llm } from '../lib/llm'
import { summarizeProgress } from '../lib/leveling'
import { requireAuth } from '../middleware/auth'
import type { AppEnv } from '../types'

const app = new Hono<AppEnv>()

type Source = 'llm' | 'local'

/** Call the model when configured; otherwise (or on error) use the fallback. */
async function generate(
  input: { system: string; prompt: string; maxTokens?: number },
  fallback: string,
): Promise<{ text: string; source: Source }> {
  if (!llm.enabled) return { text: fallback, source: 'local' }
  try {
    const text = await llm.complete(input)
    return { text: text || fallback, source: text ? 'llm' : 'local' }
  } catch (err) {
    console.error('LLM completion failed, using fallback:', err)
    return { text: fallback, source: 'local' }
  }
}

// Public: lets the frontend show whether AI features are live.
app.get('/status', (c) => c.json({ enabled: llm.enabled, provider: llm.name }))

app.use('*', requireAuth)

const reflectionPromptSchema = z.object({
  questTitle: z.string().trim().max(120).optional(),
})

app.post('/reflection-prompt', zValidator('json', reflectionPromptSchema), async (c) => {
  const { questTitle } = c.req.valid('json')
  const focus = questTitle ? `the quest "${questTitle}"` : 'their personal growth this week'

  const fallback = questTitle
    ? `Looking back on "${questTitle}", what is one small step you took, and what made it easier or harder than you expected?`
    : 'What is one moment from this week you are proud of, and what did it teach you about yourself?'

  const { text, source } = await generate(
    {
      system:
        'You are a warm, encouraging journaling guide inside a goal-tracking app called Serenitree, where progress grows a magical tree. Reply with a single thoughtful reflection question (max 2 sentences). No preamble.',
      prompt: `Write one reflective journaling question to help the user reflect on ${focus}.`,
      maxTokens: 120,
    },
    fallback,
  )

  return c.json({ prompt: text, source })
})

const questIdeasSchema = z.object({
  theme: z.string().trim().min(1).max(120),
})

const ideaSchema = z.object({
  title: z.string(),
  difficulty: z.enum(['Slime', 'Goblin', 'Witch', 'Dragon']),
  description: z.string(),
})

app.post('/quest-ideas', zValidator('json', questIdeasSchema), async (c) => {
  const { theme } = c.req.valid('json')

  const localIdeas = buildLocalIdeas(theme)

  if (!llm.enabled) {
    return c.json({ ideas: localIdeas, source: 'local' as Source })
  }

  try {
    const raw = await llm.complete({
      system:
        'You generate goal ideas for Serenitree, a gamified self-growth app. Difficulty is a "monster" to defeat: Slime (easy), Goblin (moderate), Witch (hard), Dragon (epic). Respond ONLY with a JSON array of exactly 3 objects: {"title": string, "difficulty": "Slime"|"Goblin"|"Witch"|"Dragon", "description": string (max 18 words)}. No prose, no code fences.',
      prompt: `Theme: ${theme}`,
      maxTokens: 400,
    })
    const parsed = z.array(ideaSchema).length(3).safeParse(JSON.parse(extractJson(raw)))
    if (parsed.success) {
      return c.json({ ideas: parsed.data, source: 'llm' as Source })
    }
  } catch (err) {
    console.error('Quest-idea generation failed, using fallback:', err)
  }

  return c.json({ ideas: localIdeas, source: 'local' as Source })
})

app.get('/weekly-recap', async (c) => {
  const userId = c.get('userId')
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [completed, weekReflections, plant] = await Promise.all([
    db
      .select()
      .from(quests)
      .where(and(eq(quests.userId, userId), eq(quests.completed, true), gte(quests.completedAt, since)))
      .orderBy(desc(quests.completedAt)),
    db
      .select()
      .from(reflections)
      .where(and(eq(reflections.userId, userId), gte(reflections.createdAt, since)))
      .orderBy(desc(reflections.createdAt)),
    db.select().from(plants).where(eq(plants.userId, userId)).limit(1),
  ])

  const progress = summarizeProgress(plant[0]?.exp ?? 0)
  const xpThisWeek = completed.reduce((sum, q) => sum + q.xpReward, 0)

  const stats = {
    questsCompleted: completed.length,
    reflectionsWritten: weekReflections.length,
    xpEarned: xpThisWeek,
    level: progress.level,
    stage: progress.stage,
  }

  const fallback = buildLocalRecap(stats, completed.map((q) => q.title))

  const { text, source } = await generate(
    {
      system:
        'You write a short, warm weekly recap for Serenitree, where finishing goals grows a magical tree. 2-3 sentences, second person, celebratory but genuine. No preamble.',
      prompt: `This week the user completed ${stats.questsCompleted} quest(s): ${
        completed.map((q) => q.title).join('; ') || 'none'
      }. They wrote ${stats.reflectionsWritten} reflection(s) and earned ${stats.xpEarned} XP. Their tree is at the "${stats.stage}" stage (level ${stats.level}). Write their recap.`,
      maxTokens: 200,
    },
    fallback,
  )

  return c.json({ summary: text, stats, source })
})

// --- Local (no-LLM) generators -------------------------------------------

function buildLocalIdeas(theme: string) {
  const t = theme.trim()
  return [
    { title: `Spend 15 focused minutes on ${t}`, difficulty: 'Slime' as const, description: `A gentle first step into ${t}.` },
    { title: `Make real progress on ${t} three times this week`, difficulty: 'Goblin' as const, description: `Build momentum with ${t}.` },
    { title: `Reach a meaningful milestone in ${t}`, difficulty: 'Witch' as const, description: `Push yourself toward mastery of ${t}.` },
  ]
}

function buildLocalRecap(
  stats: { questsCompleted: number; reflectionsWritten: number; xpEarned: number; stage: string },
  titles: string[],
): string {
  if (stats.questsCompleted === 0) {
    return 'A quiet week for your tree — every journey has them. Plant one small quest today and watch it begin to grow again.'
  }
  const headline = titles.slice(0, 3).join(', ')
  return `You completed ${stats.questsCompleted} quest${stats.questsCompleted === 1 ? '' : 's'}${
    headline ? ` (${headline})` : ''
  } and earned ${stats.xpEarned} XP this week. Your tree is now ${stats.stage}. Keep nurturing it — you're doing beautifully.`
}

/** Pull the first JSON array/object out of a model response, tolerating fences. */
function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const body = fenced ? fenced[1] : raw
  const start = body.search(/[[{]/)
  const end = Math.max(body.lastIndexOf(']'), body.lastIndexOf('}'))
  return start >= 0 && end > start ? body.slice(start, end + 1) : body
}

export default app
