import { InferSelectModel } from "drizzle-orm";
import {
    boolean,
    integer,
    json,
    pgEnum,
    pgTable,
    real,
    serial,
    text,
    timestamp,
    uuid,
    varchar
} from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";

export const feedbacks = pgTable("feedbacks", {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    willBuy: boolean("will_buy"),
    price: integer("price"),
    userId: uuid('userId')
        .notNull()
        .references(() => usersTable.id),
});

export type Feedback = InferSelectModel<typeof feedbacks>;


// Enum for billing cycle
export const billingCycleEnum = pgEnum("billing_cycle", ["monthly", "yearly"])



// Subscriptions table with complete plan information
export const subscriptions = pgTable("subscriptions", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),

    // Plan details stored directly in subscription
    planName: text("plan_name").notNull(),
    planDescription: text("plan_description").notNull(),
    numberOfAssistants: integer("number_of_assistants").notNull(),
    numberOfTemplates: integer("number_of_templates").notNull(),
    features: text("features").array().notNull(),

    // Billing details
    billingCycle: billingCycleEnum("billing_cycle").notNull(),
    currentPrice: integer("current_price").notNull(), // Store in cents

    // Subscription status
    startDate: timestamp("start_date").defaultNow(),
    endDate: timestamp("end_date"),
    isActive: boolean("is_active").default(true),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
})

// Types
export type NewSubscription = typeof subscriptions.$inferInsert
export type Subscription = typeof subscriptions.$inferSelect




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