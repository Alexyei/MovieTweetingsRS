'use client'
import {buttonVariants} from "@/components/ui/button";
import Link from "next/link";
import {Clapperboard} from "lucide-react";
import {useUserData} from "@/context/UserDataContext";
import {cookies} from "next/headers";
const Navbar = () => {
    const userData = useUserData()
    return (
        <div className=' bg-zinc-100 py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0'>
            <div className='container flex items-center justify-between'>
                <Link href='/' className='flex items-end'>
                    <Clapperboard  className="mr-2 text-primary"/>Cyber Cinema
                </Link>
                <Link className={buttonVariants()} href='/sign-in'>

                    {!userData.user ? 'Sign In':userData.user.login}

                </Link>
            </div>
        </div>
    );
};

export default Navbar;