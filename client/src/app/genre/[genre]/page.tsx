import MovieSearchPanel from "@/components/MovieSearchPanel/MovieSearchPanel";
export const dynamicParams = false;
export async function generateStaticParams() {
    // const posts = await fetch('https://.../posts').then((res) => res.json())
    //
    // return posts.map((post) => ({
    //     slug: post.slug,
    // }))

    return [
        {genre: 'comedy'},
        {genre: 'action'},
        {genre: 'sci-fi'}
    ]
}
export default async function Page({ params }: { params: { genre: string } }){
    // get genre id by genre name
    const id = 1;

    return (
        // TODO: slider с популярными элементами по категории
        <MovieSearchPanel title={`Категория: ${params.genre}`} canSelectGenre={false} initialValues={{genreIDs:[id]}}/>
    )
}