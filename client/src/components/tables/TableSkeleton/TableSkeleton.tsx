import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import React from "react";
import {Skeleton} from "@/components/ui/skeleton";

export default function TableSkeleton(){
    return (
        <Card className={"w-full flex flex-col"}>
            <CardHeader>
                <Skeleton className="h-8 w-[450px] rounded-lg" />
            </CardHeader>
            <CardContent className={"flex-grow flex flex-col gap-2"}>
                <Skeleton className="flex-grow w-full rounded-lg" />
                <div className={"w-full flex flex-row-reverse gap-2"}>
                    <Skeleton className="w-9 h-9 rounded-lg" />
                    <Skeleton className="w-9 h-9 rounded-lg" />
                </div>
            </CardContent>
        </Card>
    )
}