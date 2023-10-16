'use client'
import './global.css'
import {Inter} from "next/font/google";
import {Button} from "@/components/ui/button";
const inter = Inter({subsets: ['cyrillic-ext']})
export default function GlobalError({
                                        error,
                                        reset,
                                    }: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    console.log(error)
    return (
        <html>
        <body className={inter.className}>
        <main className='h-screen flex flex-col justify-center items-center'>
        <h2>{error.message}</h2>
        <Button onClick={() => reset()}>Попробовать снова</Button>
        </main>
        </body>
        </html>
    )
}