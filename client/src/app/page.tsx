import MovieCardsSlider from "@/components/MovieCardsSlider/MovieCardsSlider";
import MovieSearchPanel from "@/components/MovieSearchPanel/MovieSearchPanel";
import {getServerAPI} from "@/api/server_api";
import CFNBItemItemRecsSlider from "@/components/recs/CFNBItemItemRecsSlider/CFNBItemItemRecsSlider";
export default async function Home() {




  return (
      <>
          {/*<MovieCardsSlider title={"Рекомендуемые элементы"} movies={[]}/>*/}
          <CFNBItemItemRecsSlider title={"Рекомендуемые элементы"}/>
        <MovieSearchPanel title={"Поиск по каталогу"}/>
      </>
      )
}
