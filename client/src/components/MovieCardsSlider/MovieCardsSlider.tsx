'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import HoverTracer from "@/components/HoverTracer/HoverTracer";
import MovieCard from "@/components/MovieCard/MovieCard";

import {Swiper, SwiperSlide} from "swiper/react";
const MovieCardsSlider = ({title,movieData}:{title:string,movieData:any[]})=>{
    const breakpoints ={
        460: {
            slidesPerView: 3, // на планшетах отображать 2 слайда
        },
        650: {
            slidesPerView: 4
        },
        800: {
            slidesPerView: 5, // на планшетах отображать 2 слайда
        },
        1024: {
            slidesPerView: 6, // на десктопах отображать 3 слайда
        },
        1280: {
            slidesPerView: 7,
        },
        1536: {
            slidesPerView: 'auto',
        }
    } as any
    return (
        <Card >
            <CardHeader>
                <CardTitle>
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent >
                <Swiper className={"ml-0"} slidesPerView={'auto'} centeredSlides={false} spaceBetween={10}>
                    { movieData.map((v,i)=>{

                        return (
                            <SwiperSlide key={i} className={"w-auto"}>
                                <HoverTracer data={{url:'d'}}>
                                    <MovieCard movieData={{url:'d'}}  className={`w-32 ${i<movieData.length - 1 ? "":"mr-2"}`}></MovieCard>
                                </HoverTracer>
                            </SwiperSlide>
                        )

                    })}

                </Swiper>
            </CardContent>
        </Card>
    )
}

export default MovieCardsSlider