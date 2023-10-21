'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowDown, ArrowUp, Check, ChevronsUpDown, Plus, SlidersHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {useDeferredValue, useEffect, useRef, useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {PopoverTrigger,Popover,PopoverContent} from "@/components/ui/popover";
import {Label} from "@/components/ui/label";
import GenreSelector from "@/components/GenreSelector";
import SortSelector from "@/components/SortSelector";
import MovieSearchParamsSelector from "@/components/MovieSearchParamsSelector";
import {Genre} from "@/types/genre.types";
import Search from "@/components/Search";
import {Skeleton} from "@/components/ui/skeleton";
import MovieCard from "@/components/MovieCard/MovieCard";

const  SearchPanelSkeleton = ({title}:{title:string})=>{
    return (
        <Card >
            <CardHeader>
                <CardTitle>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full">
                    <div className="flex items-center py-4 justify-between">
                        <Skeleton className="w-full h-8"/>
                    </div>
                </div>
                <Skeleton className="h-96 w-full rounded-md border"/>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        <Skeleton className="w-[120px] h-4"/>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
//TODO: sort types

type SearchParams = {
    genreIDs: number[],
    from:number,
    to:number,
    sort: string,
    input:string,
}

function getGenres() {
    return new Promise<Genre[]>((resolve, reject) => {
        setTimeout(() => resolve([
            {
                id: 1,
                name: "Comedy",
                count: 1000,
            },
            {
                id:2,
                name: "Drama",
                count: 1500
            },
            {
                id:3,
                name: "Action",
                count: 500
            },
            {
                id: 4,
                name: "Sci-fi",
                count:2000
            },
        ]),2000)
    })
}

const moviesInResponse = 100
function makeRequest(searchParams:any,startWith:number) {
    return new Promise<{movies:any[],total:number}>((resolve, reject) => {
        setTimeout(() => {
            console.log(searchParams,moviesInResponse)
            resolve({movies:Array.from({length:7}).fill(0),total:150})},2000)
    })

}

const MovieSearchPanel = ({title, initialValues={}, canSelectGenre=true}:{title:string,initialValues?:Partial<SearchParams>,canSelectGenre?:boolean}) =>{
    const genres = useRef<Genre[]>([])
    const searchParams = useRef<SearchParams>({
        genreIDs: [],
        from: 1890,
        to: new Date().getFullYear(),
        sort: "desc ratings",
        input: "",
        ...initialValues
    })
    const lastSearchParams = useRef<SearchParams>(searchParams.current)

    const[isMounted,setIsMounted] = useState(false)
    const [isLoading,setIsLoading] = useState(true)
    const [movies,setMovies] = useState<any[]>([])
    const [total,setTotal] = useState(0)
    const [current,setCurrent] = useState(0)

    useEffect(()=>{
        getGenres().then((gens)=>genres.current = gens).then(()=>setIsMounted(true))
    },[])

    useEffect(()=>{
        search()
    },[])



    function onGenresChanged(genreIds:number[]){
        searchParams.current.genreIDs = genreIds
    }

    function onSearchParamsChanged(from:number,to:number,sort:string){
        searchParams.current.from = from
        searchParams.current.to = to
        searchParams.current.sort = sort
    }

    function onSearchInputChanged(input:string){
        searchParams.current.input = input
    }

    function search(){
        setIsLoading(true)
        makeRequest(searchParams,current).then(({movies,total})=>{
            setMovies(movies)
            setTotal(total)
            setCurrent(Math.min(total,moviesInResponse))
            lastSearchParams.current = searchParams.current
        }).finally(()=>{
            setIsLoading(false)
        })
    }

    function loadMore(){
        setIsLoading(true)
        makeRequest(lastSearchParams,current).then(({movies,total})=>{
            setMovies(prev=>[...prev,...movies])
            setTotal(total)
            setCurrent(prev=>Math.min(total,prev+moviesInResponse))
        }).finally(()=>{
            setIsLoading(false)
        })
    }



    function onSearchBtnClickHandler(){
        search()
    }

    function onLoadMoreBtnClickHandler(){
        loadMore()
    }





    if (!isMounted) return <SearchPanelSkeleton title={title}/>

    return (
        <Card >
            <CardHeader>
                <CardTitle>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full">
                    <div className="flex items-center py-4 justify-between">
                        <Search onInputChanged={onSearchInputChanged}/>
                        <div className={"flex space-x-2 ml-2"}>
                            {canSelectGenre && <GenreSelector genres={genres.current} onGenresChanged={onGenresChanged}/>}
                            <MovieSearchParamsSelector onSearchParamsChanged={onSearchParamsChanged}/>
                        </div>
                    </div>
                </div>
                <ScrollArea className="h-96 w-full rounded-md border ">
                    {/*<div className={"min-h-screen bg-yellow-300"}></div>*/}
                    <div className={"flex flex-wrap gap-4 p-4"}>
                        {movies.map((el,i)=><MovieCard className={"w-[128px]"} movieData={{url:'d'}}/>)}
                    </div>
                </ScrollArea>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        { total ? `Показано ${current} элементов из ${total}`: ""}
                    </div>
                    <div className={"flex space-x-2"}>
                        <Button disabled={isLoading} variant="default" size="sm" onClick={onSearchBtnClickHandler}>
                            Найти
                        </Button>
                        {total > current &&
                        <Button disabled={isLoading} variant="secondary" size="sm" onClick={onLoadMoreBtnClickHandler}>
                            <Plus className="mr-2 h-4 w-4 " />
                            Показать ещё
                        </Button>}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}



export default MovieSearchPanel