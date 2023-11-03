import * as React from "react";
import Link from "next/link";
import Image from 'next/image'
import {AspectRatio} from "@/components/ui/aspect-ratio";
import {Star} from "lucide-react";
import {MovieFullDataT} from "@/types/movie.types";
const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

const MovieCard = ({movie, className,hover=true,link=true,admin=false}: { movie: Omit<MovieFullDataT, "genres">, className?: string, hover?:boolean,link?:boolean,admin?:boolean }) => {
    const content = <AspectRatio ratio={3 / 4} className={"relative group overflow-hidden"}>
        {movie.poster_path ?
            <Image src={IMAGE_URL+movie.poster_path}
                   alt={movie.title}
                   priority={true}
                   fill
                   placeholder={"blur"}
                   blurDataURL={"/images/blured.png"}
                   className={"rounded-md object-cover"}
            /> :
            <div
                className={"rounded-md w-full h-full flex items-center justify-center bg-gradient-to-t from-purple-500 to-pink-500"}>
                <h4 className={"scroll-m-20 px-2 text-center text-sm font-semibold tracking-tight line-clamp-3 "}>{movie.title}</h4>
            </div>
        }
        { hover &&
            <div
                className={"group-hover:bottom-0 transition-all absolute p-1 -bottom-28 left-0 right-0 rounded-md flex flex-col justify-end  bg-secondary"}>
                <h4 className={"scroll-m-20 text-sm font-semibold tracking-tight truncate"}>{movie.title}</h4>
                <div className={"flex items-center mb-1"}>
                    <Star className={"h-3 w-3 fill-foreground  mr-1"}/>
                    <p className={"text-xs  leading-none line-clamp-5 mr-1"}>{movie.mean_rating.toFixed(1)} / 10.0</p>
                    <p className={"text-xs  leading-none line-clamp-5"}>| {movie.year}</p>
                </div>
                <p className={"text-xs text-primary leading-none line-clamp-5"}>{movie.description || "Описание отсутствует"}</p>
            </div>
        }
    </AspectRatio>

    return (
        <div className={className}>
            {link ? <Link href={admin ? `/analytics/movie/${movie.id}`:`/movie/${movie.id}`}>{content}</Link> : <>{content}</>}
        </div>
    )
}

export default MovieCard