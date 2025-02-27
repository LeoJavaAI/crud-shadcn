'use server'
import {feedbacks} from "@/lib/db/schema";
import {revalidatePath} from "next/cache";
import {drizzle} from "drizzle-orm/node-postgres";

export async function submitFeedback(formData: FormData) {
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string
    const willBuy = formData.get("willBuy") === "on"
    const price = willBuy ? Number.parseInt(formData.get("price") as string) : null

    const db = drizzle(process.env.POSTGRES_URL!)


    try {
        // const session = await auth();
        // if (!session || !session.user || !session.user.id) {
        //     return redirect("/login")
        // }

        const userId = "775c8930-d518-446d-be76-1bdd69ddb70c"

        await db.insert(feedbacks).values({
            subject,
            message,
            willBuy,
            price,
            userId:userId,
        })

        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Error submitting feedback:", error)
        return { success: false, error: "Error submitting feedback" }
    }
}