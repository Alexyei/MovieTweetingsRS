import {getServerAPI} from "@/api/server_api";
import ServerAdminRoute from "@/components/routes/ServerAdminRoute/ServerAdminRoute";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {RatingChart} from "@/components/charts/RatingChart/RatingChart";
import {ConversionChart} from "@/components/charts/ConversionChart/ConversionChart";
import {ReactNode} from "react";
import {CandlestickChart, Cookie, RussianRuble, Search, Users2} from "lucide-react";
import {UserT} from "@/types/user.types";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import RecentSalesTable from "@/components/tables/RecentSales/RecentSales";
import TopSalesTable from "@/components/tables/TopSales/TopSales";


function OverviewCard({title, description, value, icon}: {
    title: string,
    value: string,
    description: string,
    icon: ReactNode
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}

const api = getServerAPI()
export default async function Page() {

    const ratingsData = [
        {
            rating: 1,
            count: 20008,
        },
        {
            rating: 2,
            count: 24008,
        },
        {
            rating: 3,
            count: 27008,
        },
        {
            rating: 4,
            count: 32008,
        },
        {
            rating: 5,
            count: 54008,
        },
        {
            rating: 6,
            count: 60008,
        },
        {
            rating: 7,
            count: 70008,
        },
        {
            rating: 8,
            count: 115008,
        },
        {
            rating: 9,
            count: 85008,
        },
        {
            rating: 10,
            count: 73008,
        },
    ]
    const conversionData = [
        {type: "GENRE_VIEW", no_buy: 100011, buy: 9789},
        {type: "DETAILS", no_buy: 42790, buy: 5678},
        {type: "MORE_DETAILS", no_buy: 20790, buy: 3450},
        {type: "ADD_TO_FAVORITES_LIST", no_buy: 10011, buy: 2350},
        {type: "REMOVE_FROM_FAVORITES_LIST", no_buy: 7000, buy: 350},
        {type: "BUY", no_buy: 970, buy: 970},
    ] as any[]


    return (
        <ServerAdminRoute>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>
                        <Link href={"/analytics/search"}>
                            Панель аналитики
                            <Button className={"ml-2"} variant="outline" size="icon">
                                <Search className="h-4 w-4"/>
                            </Button>
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent className={"px-2"}>
                    <div className={"flex w-full flex-col gap-4"}>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <OverviewCard title={"Посетителей за месяц"} value={"1000"}
                                          description={"+20.1% с прошлого месяца"}
                                          icon={<Users2 className="h-6 w-6 text-muted-foreground" strokeWidth={2}/>}/>
                            <OverviewCard title={"Конверсия"} value={"10,07%"} description={"-2.1% с прошлого месяца"}
                                          icon={<RussianRuble className="h-6 w-6 text-muted-foreground"
                                                              strokeWidth={2}/>}/>
                            <OverviewCard title={"Сессии"} value={"1579"} description={"+115.1% с прошлого месяца"}
                                          icon={<Cookie className="h-6 w-6 text-muted-foreground" strokeWidth={2}/>}/>
                            <OverviewCard title={"Продажи"} value={"157"} description={"+15.1% с прошлого месяца"}
                                          icon={<CandlestickChart className="h-6 w-6 text-muted-foreground"
                                                                  strokeWidth={2}/>}/>
                        </div>


                    </div>
                </CardContent>
            </Card>
            <div className="grid w-full gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Распределение оценок</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <RatingChart data={ratingsData}></RatingChart>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Конверсия</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ConversionChart data={conversionData}/>
                    </CardContent>
                </Card>
            </div>
            <div className="grid  w-full gap-4 lg:grid-cols-2">
                <RecentSalesTable/>
                <TopSalesTable/>
            </div>
        </ServerAdminRoute>
    )
}