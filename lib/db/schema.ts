import { InferSelectModel } from "drizzle-orm";
import { integer, json, pgTable, real, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";






export const usersTable = pgTable("users", {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});

export const userInsertSchema = createInsertSchema(usersTable);


export const assistantsTable = pgTable('assistants', {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    provider: text('provider', { enum: ['OpenAI', 'Anthropic'] }).notNull().default('OpenAI'),
    modelName: text('modelName').notNull(),
    type: text('type', { enum: ['text', 'image'] }).notNull(),
    systemPrompt: text('systemPrompt'),
    temperature: real('temperature').default(0.7),
    maxTokens: integer('maxTokens').default(2048),
    suggestions: json('suggestions'), // Changed from array to json
    apiKey: text('apiKey').notNull(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
    userId: uuid('userId')
        .notNull()
        .references(() => usersTable.id),
});

export type Assistant = InferSelectModel<typeof assistantsTable>;


// lib/db/enums.ts

export const ModelProvider = {
    OpenAI: 'OpenAI',
    Anthropic: 'Anthropic',

} as const;

export const ModelType = {
    Text: 'text',
    Image: 'image',
} as const;

export const ModelName = {
    GPT4Mini: 'gpt-4o-mini',
    GPT4: 'gpt-4o',
    Claude: 'claude-3-5-sonnet-20241022',

    GPT4Turbo: 'gpt-4-turbo',
    DallE2: 'dall-e-2',
    DallE3: 'dall-e-3',
} as const;

export type ModelProvider = typeof ModelProvider[keyof typeof ModelProvider];
export type ModelType = typeof ModelType[keyof typeof ModelType];
export type ModelName = typeof ModelName[keyof typeof ModelName];