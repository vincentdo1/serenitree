import { relations } from 'drizzle-orm'
import { boolean, text, pgTable, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable('user', {
    id: text('id')
        .primaryKey(),
    username: text('username').notNull(),
    password: text('password').notNull(),
})

export const quest = pgTable('quest', {
    id: text('id')
        .primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    createDate: timestamp('create_date', { withTimezone: true }).notNull().defaultNow(),
    completed: boolean('completed').default(false),
    difficulty: text('difficulty'),
    category: text('category'),
})

export const plant = pgTable('plant', {
    id: text('id')
        .primaryKey(),
    stage: text('stage').notNull(),
    exp: text('exp').notNull(),
})

export const spell = pgTable('spell', {
    id: text('id')
        .primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    exp: text('exp').notNull(),
})

export const reflection = pgTable('reflection', {
    id: text('id')
        .primaryKey(),
    date: timestamp('date', { withTimezone: true }).notNull().defaultNow(),
    message: text('message').notNull(),
})
