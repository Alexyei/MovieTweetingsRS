import {getServerAPI} from "@/api/server_api";
import ServerAdminRoute from "@/components/routes/ServerAdminRoute/ServerAdminRoute";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Overview} from "@/components/temp/overview";
import {RecentSales} from "@/components/temp/recent-sales";
import {RatingChart} from "@/components/charts/RatingChart/RatingChart";
import {ConversionChart} from "@/components/charts/ConversionChart/ConversionChart";


const api = getServerAPI()
export default async function Page(){

    const ratingsData  = [
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
        {type: "GENRE_VIEW",no_buy:100011,buy:9789},
        {type: "DETAILS",no_buy:42790,buy:5678},
        {type: "MORE_DETAILS",no_buy:20790,buy:3450},
        {type: "ADD_TO_FAVORITES_LIST",no_buy:10011,buy:2350},
        {type: "REMOVE_FROM_FAVORITES_LIST",no_buy:7000,buy:350},
        {type: "BUY",no_buy:970,buy:970},
    ] as any[]
    return (
        <ServerAdminRoute>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Панель аналитики</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={"flex w-full flex-col gap-4"}>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Revenue
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">$45,231.89</div>
                                <p className="text-xs text-muted-foreground">
                                    +20.1% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Subscriptions
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+2350</div>
                                <p className="text-xs text-muted-foreground">
                                    +180.1% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <rect width="20" height="14" x="2" y="5" rx="2" />
                                    <path d="M2 10h20" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+12,234</div>
                                <p className="text-xs text-muted-foreground">
                                    +19% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active Now
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+573</div>
                                <p className="text-xs text-muted-foreground">
                                    +201 since last hour
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid w-full gap-4 lg:grid-cols-2">
                        <Card >
                            <CardHeader>
                                <CardTitle>Распределение оценок</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <RatingChart data={ratingsData}></RatingChart>
                            </CardContent>
                        </Card>
                        <Card >
                            <CardHeader>
                                <CardTitle>Конверсия</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ConversionChart data={conversionData}/>
                            </CardContent>
                        </Card>
                    </div>
                        <div className="grid  w-full gap-4 lg:grid-cols-2">
                        <Card >
                            <CardHeader>
                                <CardTitle>Recent Sales</CardTitle>
                                <CardDescription>
                                    You made 265 sales this month.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RecentSales />
                            </CardContent>
                        </Card>
                            <Card >
                                <CardHeader>
                                    <CardTitle>Recent Sales</CardTitle>
                                    <CardDescription>
                                        You made 265 sales this month.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RecentSales />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </ServerAdminRoute>
    )
}