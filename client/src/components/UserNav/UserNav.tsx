'use client'
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuShortcut,
    DropdownMenuTrigger, DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton/LogoutButton";
import LoginButton from "@/components/LoginButton/LoginButton";
import {useUserData} from "@/context/UserDataContext";
import {Skeleton} from "@/components/ui/skeleton";


export function UserNav() {
    const user = useUserData()

    if (user.isLoading) return (<Skeleton className="h-10 w-10 rounded-full"/>)


    if (user.user == null) return (<LoginButton/>)


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={`https://api.dicebear.com/7.x/identicon/svg?seed=${user.user.login || user.user.id}`}
                            alt="@avatar"/>
                        <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.user.login}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    {/*<DropdownMenuItem >*/}
                    {/*    <Link className='flex w-full justify-between' href={'/'}>*/}
                    {/*        Профиль*/}
                    {/*    </Link>*/}
                    {/*    /!*<DropdownMenuShortcut>⌘P</DropdownMenuShortcut>*!/*/}
                    {/*</DropdownMenuItem>*/}
                    <DropdownMenuItem>
                        <Link className='flex w-full justify-between' href={'/my/#purchased'}>
                            Мои фильмы
                            <Badge className='ml-auto bg-primary'>{user.userMovies.purchased.length}</Badge>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link className='flex w-full justify-between' href={'/my/#liked'}>
                            Избранное
                            <Badge variant="secondary">{user.userMovies.liked.length}</Badge>
                        </Link>

                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link className='flex w-full justify-between' href={'/my/#rated'}>
                            Оценённые
                            <Badge variant="secondary">{user.userMovies.rated.length}</Badge>
                        </Link>
                    </DropdownMenuItem>
                    {(user.user.role == 'ADMIN') &&
                        <>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>
                                <Link className='flex w-full justify-between' href={'/analytics/overview'}>
                                    Аналитика
                                </Link>
                            </DropdownMenuItem>
                        </>}
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <LogoutButton/>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}