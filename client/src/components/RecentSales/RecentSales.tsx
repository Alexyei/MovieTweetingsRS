import {UserT} from "@/types/user.types";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";

export function RecentSales({salesData}: { salesData: { user: UserT, movie: { title: string, id: string } }[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Недавние продажи</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="space-y-4 h-96 w-full pr-4 relative">
                    {salesData.map((sd,i) =>
                        <div key={i} >
                        <div  className="flex justify-between  w-full items-center flex-wrap gap-2"><Avatar className="h-9 w-9">

                            <AvatarImage
                                src={`https://api.dicebear.com/7.x/identicon/svg?seed=${sd.user.login || sd.user.id}`}
                                alt="@avatar"/>
                            <AvatarFallback>AV</AvatarFallback>
                        </Avatar>
                            <div className="space-y-1 sm:px-2">
                                <Link  href={`/analytics/user/${sd.user.id}`}> <p
                                    className="text-sm font-medium leading-none ">{sd.user.login}</p></Link>
                                <p className="text-sm text-muted-foreground overflow-hidden">
                                    {sd.user.email}
                                </p>
                            </div>
                            <Link  href={`/analytics/movie/${sd.movie.id}`}>
                                <div className=" text-sm font-medium text-primary">{sd.movie.title}</div>
                            </Link>
                        </div>
                            <Separator className="my-4" />
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>)
}