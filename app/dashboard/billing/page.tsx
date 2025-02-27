"use client"

import { useState } from "react"
import { Check, Users, LayoutTemplate } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {createSubscription} from "@/app/dashboard/billing/actions";

type PlanPrice = {
    monthly: number
    yearly: number
}

type Plan = {
    name: string
    description: string
    price: PlanPrice
    numberOfAssistants: number
    numberOfTemplates: number
    features: string[]
    cta: string
    popular: boolean
}

type SelectedPlan = Plan & {
    billingCycle: "monthly" | "yearly"
    currentPrice: number
}

export default function PricingComponent() {
    const [isYearly, setIsYearly] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)

    const plans: Plan[] = [
        {
            name: "Free",
            description: "Essential features for individuals and small teams",
            price: {
                monthly: 0,
                yearly: 0,
            },
            numberOfAssistants: 1,
            numberOfTemplates: 3,
            features: ["24-hour support response time", "Community access"],
            cta: "Get Started",
            popular: false,
        },
        {
            name: "Professional",
            description: "Advanced features for professionals and growing teams",
            price: {
                monthly: 15,
                yearly: 144,
            },
            numberOfAssistants: 5,
            numberOfTemplates: 25,
            features: ["1-hour support response time", "Community access", "Custom integrations", "API access"],
            cta: "Start Free Trial",
            popular: true,
        },
    ]

    const handleSelectPlan = async (plan: Plan) => {
        const selectedPlanData: SelectedPlan = {
            ...plan,
            billingCycle: isYearly ? "yearly" : "monthly",
            currentPrice: isYearly ? plan.price.yearly : plan.price.monthly,
        }

        try {
            // In a real application, you would get the userId from your auth system
            const userId = "user_123" // Example user ID

            // Convert price to cents for database storage
            const priceInCents = selectedPlanData.currentPrice * 100

            // Example of how to use the createSubscription function
            // This would typically be called via a server action or API route

            await createSubscription({
              userId,
              plan: {
                name: plan.name,
                description: plan.description,
                numberOfAssistants: plan.numberOfAssistants,
                numberOfTemplates: plan.numberOfTemplates,
                features: plan.features,
              },
              billingCycle: selectedPlanData.billingCycle,
              currentPrice: priceInCents,
            })


            console.log("Selected Plan:", selectedPlanData)
            setSelectedPlan(selectedPlanData)
            setShowSuccess(true)
        } catch (error) {
            console.error("Error creating subscription:", error)
            // Handle error appropriately
        }
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Simple, transparent pricing</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Choose the perfect plan for your needs. Always know what you&apos;ll pay.
                </p>
            </div>

            <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-2">
                    <span className={`text-sm ${!isYearly ? "font-medium" : "text-muted-foreground"}`}>Monthly</span>
                    <Switch checked={isYearly} onCheckedChange={setIsYearly} id="billing-toggle" />
                    <span className={`text-sm ${isYearly ? "font-medium" : "text-muted-foreground"}`}>
            Yearly <span className="text-xs text-emerald-600 font-medium">(Save 20%)</span>
          </span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {plans.map((plan) => (
                    <Card key={plan.name} className={`flex flex-col relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
                        {plan.popular && (
                            <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full absolute -top-3 right-4">
                                Popular
                            </div>
                        )}
                        <CardHeader className="relative">
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="mb-6">
                                <span className="text-4xl font-bold">€{isYearly ? plan.price.yearly : plan.price.monthly}</span>
                                <span className="text-muted-foreground ml-2">
                  {plan.price.monthly === 0 ? "forever" : isYearly ? "/year" : "/month"}
                </span>
                                {isYearly && plan.price.monthly > 0 && (
                                    <p className="text-sm text-muted-foreground mt-1">€12/mo when billed yearly</p>
                                )}
                            </div>

                            {/* Resources Section */}
                            <div className="mb-6 space-y-4 border rounded-lg p-4 bg-muted/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-medium">Assistants</span>
                                    </div>
                                    <span className="font-bold text-primary">{plan.numberOfAssistants}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <LayoutTemplate className="h-5 w-5 text-primary" />
                                        <span className="text-sm font-medium">Templates</span>
                                    </div>
                                    <span className="font-bold text-primary">{plan.numberOfTemplates}</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-semibold mb-3">Features included:</h4>
                                <ul className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center">
                                            <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                                variant={plan.popular ? "default" : "outline"}
                                onClick={() => handleSelectPlan(plan)}
                            >
                                {plan.cta}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {showSuccess && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <h3 className="text-xl font-semibold text-green-800 mb-2">
                        Thank you for choosing our {selectedPlan?.name} plan!
                    </h3>
                    <p className="text-green-700 mb-4">
                        You&apos;ve selected the {selectedPlan?.name} plan with {selectedPlan?.numberOfAssistants} assistants and{" "}
                        {selectedPlan?.numberOfTemplates} templates on {isYearly ? "yearly" : "monthly"} billing.
                    </p>
                    <Button
                        variant="outline"
                        className="bg-white text-green-700 border-green-300 hover:bg-green-50"
                        onClick={() => setShowSuccess(false)}
                    >
                        Close
                    </Button>
                </div>
            )}
        </div>
    )
}

