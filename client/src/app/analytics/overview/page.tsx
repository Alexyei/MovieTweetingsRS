import {getServerAPI} from "@/api/server_api";
import ServerAdminRoute from "@/components/routes/ServerAdminRoute/ServerAdminRoute";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

import {ConversionChart} from "@/components/charts/ConversionChart/ConversionChart";
import {ReactNode} from "react";
import {CandlestickChart, Cookie, RussianRuble, Search, Users2} from "lucide-react";
import {UserT} from "@/types/user.types";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import RecentSalesTable from "@/components/tables/RecentSales/RecentSales";
import TopSalesTable from "@/components/tables/TopSales/TopSales";
import RatingDistributionCard from "@/components/cards/RatingDistributionCard/RatingDistributionCard";
import ConversionCard from "@/components/cards/ConversionCard/ConversionCard";
import OverviewCardPanel from "@/components/cards/OverviewCardPanel/OverviewCardPanel";


// function OverviewCard({title, description, value, icon}: {
//     title: string,
//     value: string,
//     description: string,
//     icon: ReactNode
// }) {
//     return (
//         <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                     {title}
//                 </CardTitle>
//                 {icon}
//             </CardHeader>
//             <CardContent>
//                 <div className="text-2xl font-bold">{value}</div>
//                 <p className="text-xs text-muted-foreground">{description}</p>
//             </CardContent>
//         </Card>
//     )
// }

const api = getServerAPI()
export default async function Page() {

    return (
        <ServerAdminRoute>
            {/*<Card className="w-full">*/}
            {/*    <CardHeader>*/}
            {/*        <CardTitle>*/}
            {/*            <Link href={"/analytics/search"}>*/}
            {/*                Панель аналитики*/}
            {/*                <Button className={"ml-2"} variant="outline" size="icon">*/}
            {/*                    <Search className="h-4 w-4"/>*/}
            {/*                </Button>*/}
            {/*            </Link>*/}
            {/*        </CardTitle>*/}
            {/*    </CardHeader>*/}
            {/*    <CardContent className={"px-2"}>*/}
            {/*        <div className={"flex w-full flex-col gap-4"}>*/}
            {/*            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">*/}
            {/*                <OverviewCard title={"Посетителей за месяц"} value={"1000"}*/}
            {/*                              description={"+20.1% с прошлого месяца"}*/}
            {/*                              icon={<Users2 className="h-6 w-6 text-muted-foreground" strokeWidth={2}/>}/>*/}
            {/*                <OverviewCard title={"Конверсия"} value={"10,07%"} description={"-2.1% с прошлого месяца"}*/}
            {/*                              icon={<RussianRuble className="h-6 w-6 text-muted-foreground"*/}
            {/*                                                  strokeWidth={2}/>}/>*/}
            {/*                <OverviewCard title={"Сессии"} value={"1579"} description={"+115.1% с прошлого месяца"}*/}
            {/*                              icon={<Cookie className="h-6 w-6 text-muted-foreground" strokeWidth={2}/>}/>*/}
            {/*                <OverviewCard title={"Продажи"} value={"157"} description={"+15.1% с прошлого месяца"}*/}
            {/*                              icon={<CandlestickChart className="h-6 w-6 text-muted-foreground"*/}
            {/*                                                      strokeWidth={2}/>}/>*/}
            {/*            </div>*/}


            {/*        </div>*/}
            {/*    </CardContent>*/}
            {/*</Card>*/}
            <OverviewCardPanel/>
            <div className="grid w-full gap-4 lg:grid-cols-2">
                <RatingDistributionCard/>
                <ConversionCard/>
            </div>
            <div className="grid  w-full gap-4 lg:grid-cols-2">
                <RecentSalesTable/>
                <TopSalesTable/>
            </div>
        </ServerAdminRoute>
    )
}