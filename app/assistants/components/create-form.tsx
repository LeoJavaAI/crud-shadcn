"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createAssistant, type State } from "@/app/assistants/lib/actions"
import { useActionState } from "react"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    age: z.coerce.number(),
    email: z.string().email().optional().or(z.literal("")),
})

export function ProfileForm() {
    const initialState: State = { message: null, errors: {} }
    const [state, formAction] = useActionState(createAssistant, initialState)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            age: 0,
            email: "",
        },
    })

    // 2. Define a submit handler.

    return (
        <Form {...form}>
            <form action={formAction} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                name <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="" required {...field} />
                            </FormControl>
                            <FormDescription>This is your public display name.</FormDescription>
                            <FormMessage />
                            <div id="name-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.name &&
                                    state.errors.name.map((error: string) => (
                                        <p className="mt-2 text-sm text-destructive" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>email</FormLabel>
                            <FormControl>
                                <Input placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>This is your email.</FormDescription>
                            <FormMessage />
                            <div id="email-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.email &&
                                    state.errors.email.map((error: string) => (
                                        <p className="mt-2 text-sm text-destructive" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="" {...field} />
                            </FormControl>
                            <FormDescription>This is your public age.</FormDescription>
                            <FormMessage />
                            <div id="age-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.age &&
                                    state.errors.age.map((error: string) => (
                                        <p className="mt-2 text-sm text-destructive" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </FormItem>
                    )}
                />
                {/* General form errors */}
                <div id="form-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.message?.map((error: string) => (
                        <p className="mt-2 text-sm text-destructive" key={error}>
                            {error}
                        </p>
                    ))}
                </div>

                {/* Success message */}
                {state.message && !state.errors && (
                    <div aria-live="polite" aria-atomic="true">
                        <p className="mt-2 text-sm text-green-600">{state.message}</p>
                    </div>
                )}
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

