'use client'
import {useUserData} from "@/context/UserDataContext";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {useToast} from "@/components/ui/use-toast";
import {useState} from "react";

const WatchBuyMovieButton = ({movieId}:{movieId:string})=>{
    const user = useUserData()
    const [loading,setLoading] = useState(false)
    const { toast } = useToast()

    if (user.isLoading)
        return <Skeleton className="h-12 w-[100px]" />

    if (user.userMovies.purchased.filter(m=>m.id === movieId).length)
        return <Button disabled={true} variant="destructive">Смотреть</Button>

    async function onBuyHandler(){
        setLoading(true)
        const result = await user.buy(movieId)
        if (result == "success"){
            toast({
                description: 'Фильм успешно приобретён!',
            })
        }
        else{
            toast({
                variant: "destructive",
                description: 'Ошибка при покупке фильма!',
            })
        }
        setLoading(false)
    }

    return (
        <Button disabled={loading} onClick={onBuyHandler}>Купить</Button>
    )
}

export default WatchBuyMovieButton