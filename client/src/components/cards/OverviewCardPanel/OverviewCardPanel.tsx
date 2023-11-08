import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {CandlestickChart, Cookie, RussianRuble, Search, Users2} from "lucide-react";
import {ReactNode} from "react";
import {getServerAPI} from "@/api/server_api";

const api = getServerAPI()
async function  getPurchasesInfoData(){
    const response = await api.userEvent.purchasesInfo()
    if (response.status != 200) return null

    return response.response
}
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
export default async function OverviewCardPanel(){
    const data =  await getPurchasesInfoData()

    if (!data) return null


    return (
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
                        <OverviewCard title={"Посетителей за месяц"} value={data.visitors.value.toString()}
                                           description={`${data.visitors.diff > 0 ? '+':''}${data.visitors.diff.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})} с прошлого месяца`}
                                           icon={<Users2 className="h-6 w-6 text-muted-foreground" strokeWidth={2}/>}/>
                        <OverviewCard title={"Конверсия"} value={`${data.conversion.value.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})}`}
                                      description={`${data.conversion.diff > 0 ? '+':''}${data.conversion.diff.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})} с прошлого месяца`}
                                           icon={<RussianRuble className="h-6 w-6 text-muted-foreground"
                                                          strokeWidth={2}/>}/>

                        <OverviewCard title={"Сессии"} value={data.sessions.value.toString()} description={`${data.sessions.diff > 0 ? '+':''}${data.sessions.diff.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})} с прошлого месяца`}
                                           icon={<Cookie className="h-6 w-6 text-muted-foreground" strokeWidth={2}/>}/>
                        <OverviewCard title={"Продажи"} value={data.purchases.value.toString()} description={`${data.purchases.diff > 0 ? '+':''}${data.purchases.diff.toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})} с прошлого месяца`}
                                           icon={<CandlestickChart className="h-6 w-6 text-muted-foreground"
                                                              strokeWidth={2}/>}/>
                    </div>


                </div>
            </CardContent>
        </Card>
    )
}