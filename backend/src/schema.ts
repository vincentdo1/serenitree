import { relations } from 'drizzle-orm'
import { boolean, text, pgTable, timestamp, integer } from "drizzle-orm/pg-core";

export const user = pgTable('users', {
    id: integer('id')
        .primaryKey(),
    username: text('username').notNull(),
    password: text('password').notNull(),
})

export const quest = pgTable('quest', {
    id: integer('id')
        .primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    createDate: timestamp('create_date', { withTimezone: true }).notNull().defaultNow(),
    endDate: timestamp('end_date', { withTimezone: true }).notNull(),
    completed: boolean('completed').default(false),
    difficulty: text('difficulty'),
    category: text('category'),
    userId: integer("user_id").references(() => user.id)
})

export const plant = pgTable('plant', {
    id: integer('id')
        .primaryKey(),
    stage: text('stage').notNull(),
    exp: text('exp').notNull(),
    userId: integer("user_id").references(() => user.id).unique()
})

export const spell = pgTable('spell', {
    id: integer('id')
        .primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    exp: text('exp').notNull(),
    questId: integer("quest_id").references(() => quest.id)
})

export const reflection = pgTable('reflection', {
    id: integer('id')
        .primaryKey(),
    date: timestamp('date', { withTimezone: true }).notNull().defaultNow(),
    message: text('message').notNull(),
    questId: integer("quest_id").references(() => quest.id)
})


export const userRelation = relations(user, ({ one, many}) => ({
    quest: many(quest),
    plant: one(plant, {
        fields: [user.id],
        references: [plant.id],
      }),
}))

export const spellRelation = relations(spell, ({ one }) => ({
    quest: one(quest),
}))

export const plantRelation = relations(plant, ({ one }) => ({
    user: one(user),
}))

export const questRelation = relations(quest, ({ many }) => ({
    user: many(user),
    reflect: many(reflection)
}))

export const reflectionRelation = relations(reflection, ({ one }) => ({
    quest: one(quest, {
        fields: [reflection.id],
        references: [quest.id],
      }),
}))

