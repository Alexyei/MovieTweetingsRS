import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {SlidersHorizontal} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import SortSelector from "@/components/MovieSearchPanel/components/SortSelector";
import {useEffect, useRef, useState} from "react";

const MovieSearchParamsSelector = ({onSearchParamsChanged}:{onSearchParamsChanged:(from:number,to:number,sort:string)=>any})=>{
    const isMounted = useRef(false)
    const [from,setFrom] = useState(1890)
    const [to,setTo] = useState(2020)
    const [sort, setSort] = useState("desc rating")


    useEffect(()=>{
        if (isMounted.current){
            onSearchParamsChanged(from,to,sort)
        }else{
            isMounted.current = true
        }
    },[from,to,sort])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="m-w-auto">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Параметры</h4>
                        <p className="text-sm text-muted-foreground">
                            Настройте дополнительыне параметры поиска
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="from">Год от:</Label>
                            <Input
                                id="from"
                                type="number"
                                className="col-span-2 h-8"
                                value={from}
                                onChange={(e)=>setFrom(Number(e.target.value))}
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="to">Год до:</Label>
                            <Input
                                id="to"
                                type="number"
                                className="col-span-2 h-8"
                                value={to}
                                onChange={(e)=>setTo(Number(e.target.value))}
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="sort">Сортировка</Label>
                            <SortSelector value={sort} onChangeSort={(sort)=>setSort(sort)}/>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default MovieSearchParamsSelector