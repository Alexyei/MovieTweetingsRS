import MovieCardsSlider from "@/components/MovieCardsSlider/MovieCardsSlider";
import MovieSearchPanel from "@/components/MovieSearchPanel/MovieSearchPanel";
export default async function Home() {

  return <div className={"sm:container mx-auto "}>
    <div className={"space-y-4 mb-4"}>
      <MovieCardsSlider title={"Рекомендуемые элементы"} movieData={Array.from({length:5}).fill(0)}/>
      <MovieSearchPanel title={"Поиск по каталогу"}/>
    </div>

  </div>;
}
