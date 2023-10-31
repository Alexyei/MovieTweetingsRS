'use client'
import {useUserData} from "@/context/UserDataContext";
import {Skeleton} from "@/components/ui/skeleton";
import {Star, StarHalf} from "lucide-react";
import React, {useRef, useState} from "react";
import {useToast} from "@/components/ui/use-toast";

const StarRating = ({movieId}: { movieId: string }) => {
    const [hoveredRating,setHoveredRating] = useState(0)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const ref = useRef<HTMLDivElement>(null);
    const user = useUserData()

    if (user.isLoading) return <Skeleton className="h-8 w-[150px]"/>

    const userRating = user.userMovies.rated.filter(m => m.id == movieId)[0]?.rating || 0.5

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

    async function onPointerClickHandler(event:  React.MouseEvent<SVGSVGElement, MouseEvent>,index:number){
        if (loading) return;
        setLoading(true)
        const element = event.target as any
        const width = starWidth
        const x = event.clientX - element.getBoundingClientRect().left
        const result = await user.rate(movieId,(x <= width / 2 ? index+0.5 : index+1)*2)

        if (result == "success"){
            toast({
                description: 'Оценка сохранена!',
            })
        }
        else{
            toast({
                variant: "destructive",
                description: 'Ошибка при сохранении рейтинга!',
            })
        }
        setLoading(false)
    }

    function getColor(index:number, half:boolean){
        const n = half ? 0.5 : 1
        if (index + n <= hoveredRating) return  "fill-destructive text-destructive"

        if (index + n <= userRating/2) return  "fill-primary text-primary"

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