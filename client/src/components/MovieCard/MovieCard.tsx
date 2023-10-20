import * as React from "react";
import Link from "next/link";
import Image from 'next/image'
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Star} from "lucide-react";


const MovieCard = ({movieData, className}: { movieData: { url: string | null }, className?: string }) => {
    return (
        <div className={className}>
            <Link href={movieData.url || "/"}>
                <AspectRatio ratio={3 / 4} className={"relative group overflow-hidden"}>
                    {movieData.url ?
                        <Image src="http://localhost:3000/static/images/posters/1Aee8HBwkq1yjKYMnL9YMPhXJZ.jpg"
                               alt="Movie name"
                               fill
                               className={"rounded-md object-cover"}
                        /> :
                        <div
                            className={"rounded-md w-full h-full flex items-center justify-center bg-gradient-to-t from-purple-500 to-pink-500"}>
                            <h4 className={"scroll-m-20 text-sm font-semibold tracking-tight truncate"}>Movie Name</h4>
                        </div>
                    }
                    <div
                        className={"group-hover:bottom-0 transition-all absolute p-1 -bottom-28 left-0 right-0 rounded-md flex flex-col justify-end  bg-secondary"}>
                        <h4 className={"scroll-m-20 text-sm font-semibold tracking-tight truncate"}>Movie Name</h4>
                        <div className={"flex items-center mb-1"}>
                            <Star className={"h-3 w-3 fill-foreground  mr-1"}/>
                            <p className={"text-xs  leading-none line-clamp-5 mr-1"}>8.1 / 10.0</p>
                            <p className={"text-xs  leading-none line-clamp-5"}>| 2023</p>
                        </div>
                        <p className={"text-xs text-primary leading-none line-clamp-5"}>The moral of the story is: never
                            underestimate the power of a good laugh and always be careful of bad ideas. he moral of the
                            story is: never underestimate the power of a good laugh and always be careful of bad
                            ideas.</p>
                    </div>

                </AspectRatio>
            </Link>
        </div>
    )
}

export default MovieCard