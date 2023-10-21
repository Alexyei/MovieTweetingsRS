'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import HoverTracer from "@/components/HoverTracer/HoverTracer";
import MovieCard from "@/components/MovieCard/MovieCard";

import {Swiper, SwiperSlide} from "swiper/react";
import {Suspense} from "react";
const MovieCardsSlider = ({title,movieData}:{title:string,movieData:any[]})=>{
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
                { movieData.length &&
                <Swiper className={"ml-0"}   slidesPerView={'auto'} centeredSlides={false} spaceBetween={0}>
                    { movieData.map((v,i)=>{

                        return (
                            <SwiperSlide key={i}>
                                <HoverTracer data={{url:'d'}}>
                                    <MovieCard movieData={{url:'d'}}  className={`w-32 ${i<movieData.length - 1 ? "mr-4":""}`}></MovieCard>
                                </HoverTracer>
                            </SwiperSlide>
                        )

                    })}

                </Swiper>}

            </CardContent>
        </Card>
    )
}

export default MovieCardsSlider