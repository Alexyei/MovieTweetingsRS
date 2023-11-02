import Link from "next/link";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";

export function TopSales({topSalesData}: { topSalesData: { movie: { title: string, id: string,purchased: number } }[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Топ продаж</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="space-y-4 h-96 w-full pr-4">
                    {topSalesData.map((sd,i) =>
                        <div key={i} >
                            <div  className="flex justify-between  w-full items-center flex-wrap gap-2">
                                <div className={"flex items-center"}>
                                <p className="text-sm font-medium leading-none mr-4">{i+1}</p>
                                <Link  href={`/analytics/movie/${sd.movie.id}`}>
                                    <div className=" text-sm font-medium text-primary">{sd.movie.title}</div>
                                </Link>
                                </div>
                                <p
                                    className="text-md font-bold ">{sd.movie.purchased}</p>
                            </div>
                            <Separator className="my-4" />
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>)
}