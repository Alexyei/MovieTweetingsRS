import MovieCardsSlider from "@/components/MovieCardsSlider/MovieCardsSlider";
import MovieSearchPanel from "@/components/MovieSearchPanel/MovieSearchPanel";
export default async function Home() {

  return (
      <>
        <MovieCardsSlider title={"Рекомендуемые элементы"} movieData={Array.from({length:5}).fill(0)}/>
        <MovieSearchPanel title={"Поиск по каталогу"}/>
      </>
      )
}
