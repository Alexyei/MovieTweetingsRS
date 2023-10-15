'use client';

import { useForm } from 'react-hook-form';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from 'next/link';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const FormSchema = z.object({
    login: z.string().min(3, 'Длина логина от 3 символов').max(16, 'Длина логина до 16 сиволов'),
    password: z
        .string()
        .min(5, 'Длина пароля от 5 символов')
        .max(32, 'Длина пароля до 32 символов'),
});

const SignInForm = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            login: '',
            password: '',
        },
    });

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        console.log(values);

    };

    return (
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
            <div className='mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
                или
            </div>
            {/*<GoogleSignInButton>Sign in with Google</GoogleSignInButton>*/}
            <p className='text-center text-sm text-gray-600 mt-2'>
                Если у вас нет аккаунта, пожалуйста&nbsp;
                <Link className='text-primary hover:underline' href='/sign-up'>
                    создайте его
                </Link>
            </p>
        </Form>
    );
};

export default SignInForm;