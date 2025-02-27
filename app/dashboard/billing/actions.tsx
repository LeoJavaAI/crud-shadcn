'use server';

import { drizzle } from "drizzle-orm/node-postgres"
import {NewSubscription, subscriptions} from "@/lib/db/schema";
import {and, eq} from "drizzle-orm";


const db = drizzle(process.env.POSTGRES_URL!)

export async function createSubscription({
                                             userId,
                                             plan,
                                             billingCycle,
                                             currentPrice,
                                         }: {
    userId: string
    plan: {
        name: string
        description: string
        numberOfAssistants: number
        numberOfTemplates: number
        features: string[]
    }
    billingCycle: "monthly" | "yearly"
    currentPrice: number
}) {
    try {
        // First deactivate any existing active subscriptions
        await db
            .update(subscriptions)
            .set({
                isActive: false,
                endDate: new Date(),
                updatedAt: new Date(),
            })
            .where(and(eq(subscriptions.userId, userId), eq(subscriptions.isActive, true)))

        // Create new subscription with complete plan information
        const newSubscription: NewSubscription = {
            userId,
            planName: plan.name,
            planDescription: plan.description,
            numberOfAssistants: plan.numberOfAssistants,
            numberOfTemplates: plan.numberOfTemplates,
            features: plan.features,
            billingCycle,
            currentPrice,
            startDate: new Date(),
            isActive: true,
        }

        const [subscription] = await db.insert(subscriptions).values(newSubscription).returning()

        return subscription
    } catch (error) {
        console.error("Error creating subscription:", error)
        throw error
    }
}



export async function fetchActiveSubscription(userId: string) {
    return await db
        .select()
        .from(subscriptions)
        .where(and(eq(subscriptions.userId, userId), eq(subscriptions.isActive, true)))
        .limit(1)
        .then((subs) => subs[0])
}


