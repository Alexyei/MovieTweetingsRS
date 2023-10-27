import MovieSearchPanel from "@/components/MovieSearchPanel/MovieSearchPanel";
import RecsSlider from "@/components/RecsSlider/RecsSlider";
export default async function Home() {

  return (
      <>
          <RecsSlider title={"Рекомендуемые элементы"} type={"item-item"}/>
          <RecsSlider title={"Выбор других пользователей"} type={"user-user"}/>
          <RecsSlider title={"Популярные"} type={"pops"}/>
          <RecsSlider title={"Топ-продаж"} type={"bestsellers"}/>
        <MovieSearchPanel title={"Поиск по каталогу"}/>
      </>
      )
}
