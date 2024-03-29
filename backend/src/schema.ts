import { relations } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { boolean, numeric, text, pgTable, timestamp, integer, serial } from "drizzle-orm/pg-core";

export const user = pgTable('users', {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    username: text('username').notNull(),
    password: text('password').notNull(),
})

export const quest = pgTable('quest', {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    createDate: timestamp('create_date', { withTimezone: true }).notNull().defaultNow(),
    endDate: timestamp('end_date', { withTimezone: true }).notNull(),
    completed: boolean('completed').default(false),
    difficulty: text('difficulty'),
    category: text('category'),
    userId: text("user_id")
        .references(() => user.id) 
});

export const plant = pgTable('plant', {
    id: text('id')
      .$defaultFn(() => createId())
      .primaryKey(),
    stage: text('stage').notNull(),
    exp: numeric('exp').notNull(),
    userId: text("user_id").references(() => user.id).unique()
})

export const spell = pgTable('spell', {
    id: text('id')
        .$defaultFn(() => createId())
        .primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    exp: numeric('exp').notNull(),
    questId: text("quest_id").references(() => quest.id)
})

export const reflection = pgTable('reflection', {
    id: text('id')
        .$defaultFn(() => createId())
        .primaryKey(),
    date: timestamp('date', { withTimezone: true }).notNull().defaultNow(),
    message: text('message').notNull(),
    questId: text("quest_id").references(() => quest.id)
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

export const questRelation = relations(quest, ({ one, many }) => ({
    user: many(user),
    reflect: many(reflection),
    // one to one
    spell: one(spell)
}))

export const reflectionRelation = relations(reflection, ({ one }) => ({
    quest: one(quest, {
        fields: [reflection.id],
        references: [quest.id],
      }),
}))