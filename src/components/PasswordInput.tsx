"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'

interface PasswordFieldProps {
    form: any,
    name: string,
    label: string,
    placeHolder: string,
    cls?: string,
    disabled?: boolean
    lcls?: string
}

const PasswordInput = ({ form, name, placeHolder, label, cls='w-[50%]', disabled=false, lcls="" }: PasswordFieldProps) => {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={cn("relative", cls)}>
            <FormField
                control={form.control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className={cn(lcls)}>{label}</FormLabel>
                        <FormControl>
                            <Input disabled={disabled} className="auth-input" {...field} id="password" type={showPassword ? "text" : "password"} placeholder={placeHolder} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <button
                type="button"
                className="absolute inset-y-0 right-3 top-8 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <EyeOff className="w-6 h-6 text-gray-500" /> : <Eye className="w-6 h-6 text-gray-500" />}
            </button>
        </div>
    )
}

export default PasswordInput