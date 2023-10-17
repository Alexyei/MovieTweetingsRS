
import Link from "next/link";
import {Clapperboard} from "lucide-react";
import {ThemeToggle} from "@/components/ui/theme-toggle";
import {UserNav} from "@/components/UserNav/UserNav";
const Navbar = () => {
    // const userData = useUserData()
    return (
        <div className=' bg-secondary py-2 border-b border-s-secondary fixed w-full z-10 top-0'>
            <div className='container flex items-center justify-between'>
                <Link href='/' className='flex items-center'>
                    <Clapperboard  className="mr-2 text-primary "/><h4 className="scroll-m-20 text-xl font-semibold tracking-tigh">Cyber Cinema</h4>
                </Link>
                <div className='flex items-center'>
                    <ThemeToggle className='mr-2' />
                    {/*<Link className={`${buttonVariants()} inline-block`} href='/sign-in'>*/}

                    {/*    {!userData.user ? 'Sign In':userData.user.login}*/}

                    {/*</Link>*/}
                    <UserNav/>
                </div>

            </div>
        </div>
    );
};

export default Navbar;