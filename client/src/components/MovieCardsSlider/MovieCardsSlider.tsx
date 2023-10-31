'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import HoverTracer from "@/components/HoverTracer/HoverTracer";
import MovieCard from "@/components/MovieCard/MovieCard";

import {Swiper, SwiperSlide} from "swiper/react";
import {MovieFullDataT} from "@/types/movie.types";




const MovieCardsSlider = ({title,movies}:{title:string,movies:MovieFullDataT[]})=>{
    const breakpoints ={
        460: {
            slidesPerView: 3,
        },
        650: {
            slidesPerView: 4
        },
        800: {
            slidesPerView: 5,
        },
        1024: {
            slidesPerView: 6,
        },
        1280: {
            slidesPerView: 7,
        },
        1536: {
            slidesPerView: 8,
        }
    } as any
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent >
                { movies.length > 0 ?
                <Swiper className={"ml-0"}   slidesPerView={'auto'} centeredSlides={false} spaceBetween={0}>
                    { movies.map((movie,i)=>{

                        return (
                            <SwiperSlide key={i}>
                                <HoverTracer movieID={movie.id}>
                                    <MovieCard movie={movie}  className={`w-32 ${i<movies.length - 1 ? "mr-4":""}`}></MovieCard>
                                </HoverTracer>
                            </SwiperSlide>
                        )

                    })}

                </Swiper>
                :null
                }

            </CardContent>
        </Card>
    )
}

export default MovieCardsSlider