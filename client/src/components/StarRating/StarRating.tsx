'use client'
import {useUserData} from "@/context/UserDataContext";
import {Skeleton} from "@/components/ui/skeleton";
import {Star, StarHalf} from "lucide-react";
import React, {useRef, useState} from "react";
import {useToast} from "@/components/ui/use-toast";

const StarRating = ({movieId}: { movieId: string }) => {
    const [hoveredRating,setHoveredRating] = useState(0)
    const { toast } = useToast()
    const ref = useRef<HTMLDivElement>(null);
    const user = useUserData()

    if (user.isLoading) return <Skeleton className="h-8 w-[150px]"/>

    const userRating = user.userMovies.rated.filter(m => m.id == movieId)[0]?.rating || 0.5
    function rateHandler(rating:number){
        user.rate(movieId,rating)
        console.log(rating)
    }
    const starWidth = 24
    function onPointerMoveEventHandler(event:React.PointerEvent<SVGSVGElement>,index:number){

        const element = event.target as any
        const width = starWidth
        const x = event.clientX - element.getBoundingClientRect().left
        if (x <= width / 2) {
            setHoveredRating(index+0.5)
        }else {
            setHoveredRating(index+1)

        }

    }

    function onPointerClickHandler(event:  React.MouseEvent<SVGSVGElement, MouseEvent>,index:number){
        const element = event.target as any
        const width = starWidth
        const x = event.clientX - element.getBoundingClientRect().left
        if (x <= width / 2) {

            user.rate(movieId,index+0.5)
        }else {
            user.rate(movieId,index+1)
        }
        toast({
            description: 'Оценка сохранена!',
        })
    }

    function getColor(index:number, half:boolean){
        const n = half ? 0.5 : 1
        if (index + n <= hoveredRating) return  "fill-destructive text-destructive"

        if (index + n <= userRating) return  "fill-primary text-primary"

        return "text-primary"
    }

    return (
        <div ref={ref} className="flex space-x-2 w-auto" onPointerLeave={()=>setHoveredRating(0)}>
            {Array.from({length: 5}, (_, index) => {
                return (<div key={index} className="relative h-6 w-6" >
                    <Star className={`z-1 absolute h-6 w-6 ${getColor(index,false)} `}/>
                    <StarHalf onPointerMove={(e)=>onPointerMoveEventHandler(e,index)} onClick={(e)=>onPointerClickHandler(e,index)} className={`z-10 absolute  h-6 w-6 ${getColor(index,true)} `}/>

                </div>)
            })}
        </div>
    )
}

export default StarRating