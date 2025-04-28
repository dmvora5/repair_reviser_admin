"use client"

import Image from 'next/image'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, signIn, useSession } from 'next-auth/react'
import { parseAndShowErrorInToast, sucessToast } from '@/utils'
import { PAGE_ROUTES } from '@/constant/routes'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PasswordInput from '@/components/PasswordInput'


const formSchema = z.object({
    username: z.string().min(2, {
        message: "username must be at least 2 characters.",
    }),
    password: z.string().min(1, { message: "Password must be at least 1 character" }),
})

const Page = () => {

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const sessions: any = useSession()

    console.log('sessions', sessions)

    useEffect(() => {
        if (!sessions?.data) return;
        router.push(PAGE_ROUTES.DASHBOARD)
    }, [sessions])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            // company_name: ""

        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        setLoading(true)
        try {
            const res: any = await signIn('credentials', {
                username: values?.username,
                password: values?.password,
                // company_name: values?.company_name,
                redirect: false
            })

            if (!res?.ok) {
                return parseAndShowErrorInToast(res);
            }

            if (res && res.ok) {
                const session: any = await getSession();
                sucessToast("Login sussfully!");
                if (session?.access_token) {
                    router.replace(PAGE_ROUTES.DASHBOARD)
                }
            }

        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="text-white bg-black border border-[#242c3c] rounded-[20px] shadow-sm w-[469px] min-h-[466px] py-[30px] px-[48px] space-y-4">
            <Form {...form}>
                <Image
                    src="/images/AuthLogo.svg"
                    width={131}
                    height={40}
                    alt="Logo"
                    className="p-2 mx-auto"
                />
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} className="auth-input" placeholder="Enter Your Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        <PasswordInput disabled={loading} form={form} name="password" placeHolder="Password" label="Password" cls='w-full mb-2' />

                    </div>
                    <Button type="submit" disabled={loading} className="auth-button">
                        {loading ? (
                            <Image
                                src="images/loader.svg"
                                alt="loader"
                                width={24}
                                height={24}
                                className="ml-2 animate-spin"
                            />
                        ) : "Sign In"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default Page