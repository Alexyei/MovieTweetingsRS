import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";

const MovieCardsSliderSkeleton = ()=>{
    return (
        <Card><CardHeader><Skeleton className="h-8 w-96"/></CardHeader><CardContent>
            <div className="w-full flex space-x-4 overflow-hidden">
                <Skeleton className="min-w-[128px] w-32 h-[170px]"/>
                <Skeleton className="min-w-[128px] w-32 h-[170px]"/>
                <Skeleton className="min-w-[128px] w-32 h-[170px]"/>
                <Skeleton className="min-w-[128px] w-32 h-[170px]"/>
                <Skeleton className="min-w-[128px] w-32 h-[170px]"/>
            </div>

        </CardContent></Card>
    )
}

export default MovieCardsSliderSkeleton