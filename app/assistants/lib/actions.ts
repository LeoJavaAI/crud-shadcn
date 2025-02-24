"use server"

import { z } from "zod"
import { usersTable } from "@/lib/db/schema"
import { createInsertSchema } from "drizzle-zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { drizzle } from "drizzle-orm/node-postgres"
import {sql} from "drizzle-orm";



type PostgresError = {
    code: string
    constraint?: string
    detail?: string
    table?: string
    severity?: string
}

const db = drizzle(process.env.POSTGRES_URL!)

const formSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    age: z.coerce.number(),
    email: z.string().email().optional().or(z.literal("")),
})

export type State = {
    errors?: {
        name?: string[]
        age?: string[]
        email?: string[]
        message?: string[]
    }
    message?: string | null
}

export async function createAssistant(prevState: State, formData: FormData): Promise<State> {
    // Validate the form data
    const validatedFields = formSchema.safeParse({
        name: formData.get("name"),
        age: formData.get("age"),
        email: formData.get("email"),
    })

    // Return early if validation fails
    if (!validatedFields.success) {
        return {
            message: "Invalid form data",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    try {
        const userInsertSchema = createInsertSchema(usersTable)
        const parsed: { name: string; age: number; email: string } = userInsertSchema.parse(validatedFields.data)
        await db.insert(usersTable).values(parsed)


    }  catch (error) {
        // Type guard to check if error is a PostgreSQL error
        const isPostgresError = (err: unknown): err is PostgresError => {
            return typeof err === "object" && err !== null && "code" in err && typeof (err as PostgresError).code === "string"
        }

        if (isPostgresError(error)) {
            // Handle database constraint errors
            if (error.code === "23505" && error.constraint === "users_email_unique") {
                return {
                    message: "Failed to create profile",
                    errors: {
                        email: ["This email is already registered"],
                    },
                }
            }
        }

        // Handle other errors
        console.error(error)
        return {
            message: "Failed to create profile",
            errors: {
                message: ["An unexpected error occurred"],
            },
        }
    }

    // This return is needed for TypeScript, but it won't be reached due to the redirect
    // Return success state
    revalidatePath("/assistants")
    redirect("/assistants")
}



// export type User = {
//     id: number
//     name: string
//     email: string
//     age: number
//     createdAt: Date
// }


const ITEMS_PER_PAGE = 6
export async function fetchFilteredUsers(query: string, currentPage: number) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE

    try {
        const users = await db
            .select()
            .from(usersTable)
            .where(
                sql`LOWER(name) LIKE LOWER(${`%${query}%`}) OR 
            LOWER(email) LIKE LOWER(${`%${query}%`}) OR
            CAST(age AS TEXT) LIKE ${`%${query}%`}`,
            )
            .limit(ITEMS_PER_PAGE)
            .offset(offset)

        return users
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch users.")
    }
}

// Also update the fetchUsersPages function to include the same conditions
export async function fetchUsersPages(query: string) {
    try {
        const count = await db
            .select({ count: sql<number>`count(*)` })
            .from(usersTable)
            .where(
                sql`LOWER(name) LIKE LOWER(${`%${query}%`}) OR 
            LOWER(email) LIKE LOWER(${`%${query}%`}) OR
            CAST(age AS TEXT) LIKE ${`%${query}%`}`,
            )

        const totalPages = Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE)
        return totalPages
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch total number of users.")
    }
}





