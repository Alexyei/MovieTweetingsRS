import MovieCardsSlider from "@/components/MovieCardsSlider/MovieCardsSlider";
export default async function Home() {

  return <div className={"sm:container mx-auto "}>
    <MovieCardsSlider title={"Рекомендуемые элементы"} movieData={Array.from({length:5}).fill(0)}/>
  </div>;
}
