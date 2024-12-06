"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "./ui/label"

//name 
//description
//api url
//

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    name: z.string().min(1, {
        message: "Name is required.",
    }),
    apiUrl: z.string().url({
        message: "Invalid URL.",
    }),
    description: z.string().optional(),
    costPerOutputToken: z.number().min(0, {
        message: "Cost must be a positive number.",
    }),
    pfpUpload: z.instanceof(File, {
        message: "File is required.",
    }),
})

export function ProfileForm() {
    // ...
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex space-x-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="apiUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>API URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="API URL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex space-x-4">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="Description" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your agent's description.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="costPerOutputToken"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cost Per Output Token</FormLabel>
                                <FormControl>
                                    <Input placeholder="Cost Per Output Token" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your agent's cost per token.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="pfpUpload"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Picture</FormLabel>
                            <FormControl>
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Input id="picture" type="file" onChange={(e) => field.onChange(e.target.files?.[0])} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
