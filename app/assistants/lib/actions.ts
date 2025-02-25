'use server';
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createInsertSchema } from "drizzle-zod"
import { drizzle } from "drizzle-orm/node-postgres"
import { usersTable } from "@/lib/db/schema"
import { sql } from "drizzle-orm"

const db = drizzle(process.env.POSTGRES_URL!)

const formSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    age: z.coerce.number(),
    email: z.string().email().optional().or(z.literal("")),
})

export type State = {
    message: string | null
    errors?: {
        name?: string[]
        age?: string[]
        email?: string[]
        message?: string[]
    }
}

type PostgresError = {
    code: string
    constraint: string
}



// Update the deleteUser function
export async function deleteUser(id: number, name: string): Promise<State> {
    try {
        await db.delete(usersTable).where(sql`id = ${id}`)
         } catch (error) {
        console.error("Database Error:", error)
        return {
            message: "Failed to delete user",
            errors: {
                message: ["An unexpected error occurred"],
            },
        }

    }

    revalidatePath("/assistants")
    redirect(`/assistants?message=${encodeURIComponent(`User ${name} was successfully deleted`)}`)

}

// Update the updateUser function
export async function updateUser(id: number, prevState: State, formData: FormData): Promise<State> {
    const validatedFields = formSchema.safeParse({
        name: formData.get("name"),
        age: formData.get("age"),
        email: formData.get("email"),
    })

    if (!validatedFields.success) {
        return {
            message: "Invalid form data",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    try {
        const userInsertSchema = createInsertSchema(usersTable)
        const parsed = userInsertSchema.parse(validatedFields.data)

        await db.update(usersTable).set(parsed).where(sql`id = ${id}`)
  } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === "23505") {
            return {
                message: "Failed to update user",
                errors: {
                    email: ["This email is already registered"],
                },
            }
        }

    }
        revalidatePath("/assistants")
        redirect(`/assistants?message=${encodeURIComponent(`User ${validatedFields.data.name} was successfully updated`)}`)
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

export async function fetchUserById(id: number) {
    try {
        const users = await db.select().from(usersTable).where(sql`id = ${id}`)

        return users[0]
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch user.")
    }
}


// Update the createAssistant function
export async function createAssistant(prevState: State, formData: FormData): Promise<State> {
    const validatedFields = formSchema.safeParse({
        name: formData.get("name"),
        age: formData.get("age"),
        email: formData.get("email"),
    })

    if (!validatedFields.success) {
        return {
            message: "Invalid form data",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    try {
        const userInsertSchema = createInsertSchema(usersTable)
        const parsed = userInsertSchema.parse(validatedFields.data)
        await db.insert(usersTable).values(parsed)
  } catch (error) {
        const isPostgresError = (err: unknown): err is PostgresError => {
            return typeof err === "object" && err !== null && "code" in err && typeof (err as PostgresError).code === "string"
        }

        if (isPostgresError(error)) {
            if (error.code === "23505" && error.constraint === "users_email_unique") {
                return {
                    message: "Failed to create profile",
                    errors: {
                        email: ["This email is already registered"],
                    },
                }
            }
        }

        console.error("Unexpected error:", error)
        return {
            message: "Failed to create profile",
            errors: {
                message: ["An unexpected error occurred"],
            },
        }
    }


    revalidatePath("/assistants")
    redirect(`/assistants?message=${encodeURIComponent(`User ${validatedFields.data.name} was successfully created`)}`)

}

