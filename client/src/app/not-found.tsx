import Link from 'next/link'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {buttonVariants} from "@/components/ui/button";




export default function NotFound() {
    return (
        <div className="flex absolute top-0 left-0 right-0 bottom-0 h-screen items-center justify-center">
            <Card className="w-[300px]">
                <CardHeader>
                    <CardTitle>404</CardTitle>
                    <CardDescription>Страница не найдена</CardDescription>
                    {/* <Comp1/>
                    <Comp2/> */}
                </CardHeader>
                <CardContent>
                    <Link href={"/"} className={buttonVariants({ variant: "default" })}>Вернуться на главную</Link>
                </CardContent>
            </Card>
        </div>
    )
}