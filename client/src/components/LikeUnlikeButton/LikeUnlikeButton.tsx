'use client'
import {useUserData} from "@/context/UserDataContext";
import {Button} from "@/components/ui/button";
import {Heart} from "lucide-react";
import {Skeleton} from "@/components/ui/skeleton";
import {useState} from "react";
import {useToast} from "@/components/ui/use-toast";

const LikeUnlikeButton = ({movieId}:{movieId:string})=>{
    const user = useUserData()
    const [loading,setLoading] = useState(false)
    const { toast } = useToast()

    if (user.isLoading) return <Skeleton className="h-10 w-10"/>

    const liked = user.userMovies.liked.filter(m=>m.id == movieId).length > 0

    async function unlike(){
        setLoading(true)
        const result = await user.removeFromList(movieId)
        if (result == "success"){
            toast({
                description: 'Фильм удалён из избранного!',
            })
        }
        else{
            toast({
                variant: "destructive",
                description: 'Ошибка при удалении фильма из избранного!',
            })
        }
        setLoading(false)
    }
    async function like(){
        setLoading(true)
        const result = await user.addToList(movieId)
        if (result == "success"){
            toast({
                description: 'Фильм добавлен в избранное!',
            })
        }
        else{
            toast({
                variant: "destructive",
                description: 'Ошибка при добавлении в избранное!',
            })
        }
        setLoading(false)
    }

    if (user.isLoading || (user.user == null)) return null;
    return (
        <Button disabled={loading} variant="outline" size="icon">
            { liked ?
                <Heart onClick={unlike} strokeWidth={3} className="text-primary fill-primary h-6 w-6" /> :
                <Heart onClick={like} strokeWidth={3} className="text-primary h-6 w-6" />
            }
        </Button>
    )
}

export default LikeUnlikeButton