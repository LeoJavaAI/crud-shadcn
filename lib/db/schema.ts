import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";






export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});

export const userInsertSchema = createInsertSchema(usersTable);
