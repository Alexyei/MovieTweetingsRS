import Link from "next/link";
import {LogIn} from "lucide-react";
import {Button} from "@/components/ui/button";

const LoginButton = () => {
    return (
        <Button variant="outline" size="icon">
            <Link href={'/sign-in'} className='w-full h-full flex items-center justify-center'>
                <LogIn className="h-4 w-4" />
            </Link>
        </Button>
    // <Link className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center border-solid border-2 border-white" href={"/sign-in"}>
    //     <div >
    //         <LogIn className="mr-2 text-accent-foreground "/>
    //     </div>
    // </Link>
    )
}

export default LoginButton