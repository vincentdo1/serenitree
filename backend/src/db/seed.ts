// Seeds a demo account so the app has something to show on first run.
//   username: demo   password: serenitree123
import { eq } from 'drizzle-orm'
import { db, runMigrations, closeDb, usingPglite } from './index'
import { plants, quests, reflections, users } from '../schema'
import { hashPassword } from '../lib/auth'
import { summarizeProgress, xpForDifficulty } from '../lib/leveling'

const DEMO = {
  username: 'demo',
  email: 'demo@serenitree.app',
  password: 'serenitree123',
}

async function main() {
  console.log(`Seeding ${usingPglite ? 'PGlite' : 'Postgres'} database...`)
  await runMigrations()

  const [existing] = await db.select().from(users).where(eq(users.username, DEMO.username)).limit(1)
  if (existing) {
    console.log('Demo user already exists — nothing to seed.')
    await closeDb()
    return
  }

  const passwordHash = await hashPassword(DEMO.password)
  const [user] = await db
    .insert(users)
    .values({ username: DEMO.username, email: DEMO.email, passwordHash })
    .returning()

  const seedQuests: {
    title: string
    difficulty: string
    category: string
    completed: boolean
    reflection?: string
  }[] = [
    { title: 'Ship the API refactor', difficulty: 'Dragon', category: 'Work', completed: true, reflection: 'Months of dread, done in an afternoon once I just started. Funny how that works.' },
    { title: 'Launch the landing page', difficulty: 'Dragon', category: 'Work', completed: true, reflection: 'Hit publish and felt that little jolt of pride. Worth every late night.' },
    { title: 'Keep a 30-day journaling streak', difficulty: 'Dragon', category: 'Mind', completed: true, reflection: 'Some entries were two lines. Showing up mattered more than the words.' },
    { title: 'Run a 10k', difficulty: 'Dragon', category: 'Body', completed: true },
    { title: 'Finish the portfolio redesign', difficulty: 'Witch', category: 'Work', completed: true },
    { title: 'Read a full book this month', difficulty: 'Witch', category: 'Mind', completed: true },
    { title: 'Learn a song on guitar', difficulty: 'Witch', category: 'Joy', completed: true },
    { title: 'Meditate five mornings', difficulty: 'Goblin', category: 'Mind', completed: true },
    { title: 'Declutter the apartment', difficulty: 'Goblin', category: 'Home', completed: true },
    { title: 'Call a friend I miss', difficulty: 'Slime', category: 'Connection', completed: false },
    { title: 'Plan a weekend trip', difficulty: 'Goblin', category: 'Joy', completed: false },
    { title: 'Launch the side project', difficulty: 'Dragon', category: 'Work', completed: false },
  ]

  let exp = 0
  for (const q of seedQuests) {
    const xpReward = xpForDifficulty(q.difficulty)
    if (q.completed) exp += xpReward
    const [quest] = await db
      .insert(quests)
      .values({
        userId: user.id,
        title: q.title,
        description: '',
        category: q.category,
        difficulty: q.difficulty,
        xpReward,
        completed: q.completed,
        completedAt: q.completed ? new Date() : null,
      })
      .returning()

    if (q.reflection) {
      await db.insert(reflections).values({
        userId: user.id,
        questId: quest.id,
        message: q.reflection,
      })
    }
  }

  const progress = summarizeProgress(exp)
  await db.insert(plants).values({ userId: user.id, exp, stage: progress.stage })

  console.log(
    `Seeded demo user (level ${progress.level}, ${progress.stage} tree, ${exp} XP).`,
  )
  console.log(`Login with  username: ${DEMO.username}  password: ${DEMO.password}`)
  await closeDb()
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
