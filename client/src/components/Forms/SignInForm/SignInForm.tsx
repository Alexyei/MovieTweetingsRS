'use client';

import { useForm } from 'react-hook-form';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from 'next/link';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {getClientAPI} from "@/api/client_api";
import {useRouter} from "next/navigation";
import {useToast} from "@/components/ui/use-toast";
import {useUserData} from "@/context/UserDataContext";

// const api = getClientAPI()

const FormSchema = z.object({
    login: z.string().min(3, 'Длина логина от 3 символов').max(16, 'Длина логина до 16 сиволов'),
    password: z
        .string()
        .min(5, 'Длина пароля от 5 символов')
        .max(32, 'Длина пароля до 32 символов'),
});

const SignInForm = () => {
    const router = useRouter()
    const user = useUserData()
    const { toast } = useToast()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            login: '',
            password: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        console.log(values);
        const response = await user.signIn(values)
        // const response = await api.authAPI.signIn(values)

        if (response.status == 200){
            router.back()
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
        <Card className="max-w-lg">
            <CardHeader>
                <CardTitle>Войти</CardTitle>
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
                                    <Input placeholder='Введите логин' {...field} />
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
                </div>
                <Button className='w-full mt-6' type='submit'>
                    Войти
                </Button>
            </form>
            <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-border after:ml-4 after:block after:h-px after:flex-grow after:bg-border'>
                или
            </div>
            {/*<GoogleSignInButton>Sign in with Google</GoogleSignInButton>*/}
            <p className='text-center text-sm mt-2'>
                Если у вас нет аккаунта, пожалуйста&nbsp;
                <Link className='text-primary hover:underline' href='/sign-up'>
                    создайте его
                </Link>
            </p>
        </Form></CardContent></Card>
    );
};

export default SignInForm;