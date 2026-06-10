import { relations } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

const id = () =>
  text('id')
    .$defaultFn(() => createId())
    .primaryKey()

const createdAt = () =>
  timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow()

export const users = pgTable('users', {
  id: id(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: createdAt(),
})

export const plants = pgTable('plants', {
  id: id(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  stage: text('stage').notNull().default('seedling'),
  exp: integer('exp').notNull().default(0),
  createdAt: createdAt(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
})

export const quests = pgTable('quests', {
  id: id(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  category: text('category'),
  difficulty: text('difficulty').notNull().default('Slime'),
  xpReward: integer('xp_reward').notNull().default(10),
  completed: boolean('completed').notNull().default(false),
  completedAt: timestamp('completed_at', { withTimezone: true, mode: 'date' }),
  dueDate: timestamp('due_date', { withTimezone: true, mode: 'date' }),
  createdAt: createdAt(),
})

export const reflections = pgTable('reflections', {
  id: id(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  questId: text('quest_id').references(() => quests.id, { onDelete: 'set null' }),
  message: text('message').notNull(),
  createdAt: createdAt(),
})

export const usersRelations = relations(users, ({ one, many }) => ({
  plant: one(plants, { fields: [users.id], references: [plants.userId] }),
  quests: many(quests),
  reflections: many(reflections),
}))

export const plantsRelations = relations(plants, ({ one }) => ({
  user: one(users, { fields: [plants.userId], references: [users.id] }),
}))

export const questsRelations = relations(quests, ({ one, many }) => ({
  user: one(users, { fields: [quests.userId], references: [users.id] }),
  reflections: many(reflections),
}))

export const reflectionsRelations = relations(reflections, ({ one }) => ({
  user: one(users, { fields: [reflections.userId], references: [users.id] }),
  quest: one(quests, { fields: [reflections.questId], references: [quests.id] }),
}))

export type User = typeof users.$inferSelect
export type Plant = typeof plants.$inferSelect
export type Quest = typeof quests.$inferSelect
export type Reflection = typeof reflections.$inferSelect
