import MovieSearchPanel from "@/components/MovieSearchPanel/MovieSearchPanel";
import {getServerAPI} from "@/api/server_api";
import {notFound} from "next/navigation";
// export const dynamicParams = false;
const api = getServerAPI()
// export async function generateStaticParams() {
//     // const posts = await fetch('https://.../posts').then((res) => res.json())
//     //
//     // return posts.map((post) => ({
//     //     slug: post.slug,
//     // }))
//     const response = await api.genre.genres()
//     return response.status == 200 ? response.response.map(el=>({...el,name:el.name.toLowerCase()})) : []
// }
export default async function Page({ params }: { params: { name: string } }){
    const response = await api.genre.genreData(params.name)
    // console.log(response.status == 200 ? response.response : [])
    if (response.status != 200)
        notFound()

    const genreData = response.response

    // get genre id by genre name

    const id = 1;

    try {
        //fetch log GENRE_VIEW
    }
    catch (e) {}


    return (
        // TODO: slider с популярными элементами по категории
        <MovieSearchPanel title={`Категория: ${genreData.name}`} canSelectGenre={false} initialValues={{genreIDs:[genreData.id]}}/>
    )
}