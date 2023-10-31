'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowDown, ArrowUp, Check, ChevronsUpDown, Plus, SlidersHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useDeferredValue, useEffect, useRef, useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import GenreSelector from "@/components/MovieSearchPanel/components/GenreSelector";
import MovieSearchParamsSelector from "@/components/MovieSearchPanel/components/MovieSearchParamsSelector";
import {GenreT} from "@/types/genre.types";
import Search from "@/components/MovieSearchPanel/components/Search";
import {Skeleton} from "@/components/ui/skeleton";
import MovieCard from "@/components/MovieCard/MovieCard";
import {getClientAPI} from "@/api/client_api";
import {MovieFullDataT, MovieOrderingT} from "@/types/movie.types";
import HoverTracer from "@/components/HoverTracer/HoverTracer";


export type SearchParamsT = {
    genreIDs: number[],
    yearFrom:number,
    yearTo:number,
    ordering: MovieOrderingT,
    searchRequest:string,
}

const api = getClientAPI()
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




// function getGenres() {
//     return new Promise<GenreT[]>((resolve, reject) => {
//         setTimeout(() => resolve([
//             {
//                 id: 1,
//                 name: "Comedy",
//                 moviesCount: 1000,
//             },
//             {
//                 id:2,
//                 name: "Drama",
//                 moviesCount: 1500
//             },
//             {
//                 id:3,
//                 name: "Action",
//                 moviesCount: 500
//             },
//             {
//                 id: 4,
//                 name: "Sci-fi",
//                 moviesCount:2000
//             },
//         ]),2000)
//     })
// }

const moviesInResponse = 30


const MovieSearchPanel = ({title, initialValues={}, canSelectGenre=true}:{title:string,initialValues?:Partial<SearchParamsT>,canSelectGenre?:boolean}) =>{
    const genres = useRef<GenreT[]>([])
    const searchParams = useRef<SearchParamsT>({
        genreIDs: [],
        yearFrom: 1878,
        yearTo: new Date().getFullYear(),
        ordering: "year desc",
        searchRequest: "",
        ...initialValues
    })
    const lastSearchParams = useRef<SearchParamsT>(searchParams.current)

    const[isMounted,setIsMounted] = useState(false)
    const [isLoading,setIsLoading] = useState(true)
    const [movies,setMovies] = useState<MovieFullDataT[]>([])
    const [total,setTotal] = useState(0)
    const [skip,setSkip] = useState(0)

    useEffect(()=>{
        api.genre.genres().then(response=>{
            if (response.status == 200){
                genres.current = response.response
                setIsMounted(true)
            }
        })
        // getGenres().then((gens)=>genres.current = gens).then(()=>setIsMounted(true))
    },[])

    useEffect(()=>{
        search()
    },[])



    function onGenresChanged(genreIds:number[]){
        searchParams.current.genreIDs = genreIds
    }

    function onSearchParamsChanged(from:number,to:number,sort:MovieOrderingT){
        searchParams.current.yearFrom = from
        searchParams.current.yearTo = to
        searchParams.current.ordering = sort
    }

    function onSearchInputChanged(input:string){
        searchParams.current.searchRequest = input
    }

    function search(){
        console.log("SEARCH")
        setIsLoading(true)
        api.movie.search(searchParams.current,moviesInResponse,0).then(response=>{
            if (response.status == 200){
                const total = response.response.count
                setMovies(response.response.data)
                setTotal(total)
                setSkip(Math.min(total,moviesInResponse))
                lastSearchParams.current = searchParams.current
            }
        }).finally(()=>{
            setIsLoading(false)
        })
        // makeRequest(searchParams,current).then(({movies,total})=>{
        //     setMovies(movies)
        //     setTotal(total)
        //     setCurrent(Math.min(total,moviesInResponse))
        //     lastSearchParams.current = searchParams.current
        // }).finally(()=>{
        //     setIsLoading(false)
        // })
    }

    function loadMore(){
        console.log("LOAD MORE")
        setIsLoading(true)
        api.movie.search(searchParams.current,moviesInResponse,skip).then(response=>{
            if (response.status == 200){
                const total = response.response.count
                const movies = response.response.data

                setMovies(prev=>[...prev,...movies])
                setTotal(total)
                setSkip(prev=>Math.min(total,prev+moviesInResponse))
                // lastSearchParams.current = searchParams.current
            }
        }).finally(()=>{
            setIsLoading(false)
        })
        // makeRequest(lastSearchParams,skip).then(({movies,total})=>{
        //     setMovies(prev=>[...prev,...movies])
        //     setTotal(total)
        //     setSkip(prev=>Math.min(total,prev+moviesInResponse))
        // }).finally(()=>{
        //     setIsLoading(false)
        // })
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
                {movies.length ?
                <ScrollArea className="h-96 w-full rounded-md border ">
                    {/*<div className={"min-h-screen bg-yellow-300"}></div>*/}

                    <div className={"flex flex-wrap gap-4 p-4"}>
                        {movies.map((el,i)=><HoverTracer key={el.id} movieID={el.id}><MovieCard  className={"w-[128px]"} movie={el}/></HoverTracer>)}
                    </div>
                </ScrollArea>
                    :
                    <div className="w-full h-96 flex items-center justify-center rounded-md border">
                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Ничего не найдено</h4>
                    </div>
                }
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        { total ? `Показано ${skip} элементов из ${total}`: ""}
                    </div>
                    <div className={"flex space-x-2"}>
                        <Button disabled={isLoading} variant="default" size="sm" onClick={onSearchBtnClickHandler}>
                            Найти
                        </Button>
                        {total > skip &&
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