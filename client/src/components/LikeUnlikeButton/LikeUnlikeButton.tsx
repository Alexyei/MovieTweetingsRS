'use client'
import {MovieT} from "@/types/movie.types";
import {useUserData} from "@/context/UserDataContext";
import {Button} from "@/components/ui/button";
import {Heart} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";

const LikeUnlikeButton = ({movieId}:{movieId:string})=>{
    const user = useUserData()

    if (user.isLoading) return <Skeleton className="h-10 w-10"/>

    const liked = user.userMovies.liked.filter(m=>m.id == movieId).length > 0

    function unlike(){
        user.removeFromList(movieId)
    }
    function like(){
        user.addToList(movieId)
    }

    return (
        <Button variant="outline" size="icon">
            { liked ?
                <Heart onClick={unlike} strokeWidth={3} className="text-primary fill-primary h-6 w-6" /> :
                <Heart onClick={like} strokeWidth={3} className="text-primary h-6 w-6" />
            }
        </Button>
    )
}

export default LikeUnlikeButton