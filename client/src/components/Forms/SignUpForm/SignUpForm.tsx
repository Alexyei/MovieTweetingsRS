'use client';
import { useForm } from 'react-hook-form';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from 'next/link';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useToast} from "@/components/ui/use-toast";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {getClientAPI} from "@/api/client_api";

const api = getClientAPI()

const FormSchema = z
    .object({
        login: z.string().min(3, 'Длина логина от 3 символов').max(16,'Длина логина до 16 символов'),
        email: z.string().min(1, 'Email обязателен').email('Недействительный email'),
        password: z
            .string()
            .min(5, 'Длина пароля от 5 символов')
            .max(32, 'Длина пароля до 32 символов'),
        confirmPassword: z.string().min(1, 'Повторите пароль'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Пароли не совпадают',
    });

const SignUpForm = () => {
    const router = useRouter()
    // const API_URL = process.env.NEXT_PUBLIC_API_URL
    const { toast } = useToast()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            login: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {

        console.log(values);
        // console.log(API_URL)

        // const response = await fetch(API_URL + '/api/v1.0.0/auth/signup', {
        //     method: 'POST',
        //     credentials: "include",
        //     headers: {
        //         'Content-type':'application/json'
        //     },
        //     body: JSON.stringify(values)
        // })

        // if(response.ok){
        //     router.refresh()
        //     router.push('/sign-in')
        // }else{
        //     const answer = await response.json()
        //     toast({
        //         variant: "destructive",
        //         title: `Ошибка ${response.status}!`,
        //         description: answer.message,
        //     })
        //
        // }

        const response = await api.authAPI.signUp(values)

        if (response.status == 201){
            router.refresh()
            router.push('/')
        }else{
                const message = response.response.message
                toast({
                    variant: "destructive",
                    title: `Ошибка ${response.status}!`,
                    description: message,
                })
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Создать аккаунт</CardTitle>
            </CardHeader>
            <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
                <div className='space-y-2'>
                    <FormField
                        control={form.control}
                        name='login'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Имя пользователя</FormLabel>
                                <FormControl>
                                    <Input placeholder='username' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder='mail@example.com' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Пароль</FormLabel>
                                <FormControl>
                                    <Input
                                        type='password'
                                        placeholder='Введите пароль'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='confirmPassword'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Повторите пароль</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Повторите пароль'
                                        type='password'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button className='w-full mt-6' type='submit'>
                    Создать аккаунт
                </Button>
            </form>
            <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-border after:ml-4 after:block after:h-px after:flex-grow after:bg-border'>
                или
            </div>
            <p className='text-center text-sm  mt-2'>
                Есди у вас уже есть аккаунт, пожалуйста&nbsp;
                <Link className='text-primary hover:underline' href='/sign-in'>
                    войдите
                </Link>
            </p>
        </Form>
            </CardContent>
        </Card>
    );
};

export default SignUpForm;