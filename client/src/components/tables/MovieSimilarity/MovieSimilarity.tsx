import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import {columns, MovieSimilarityT} from "@/components/tables/MovieSimilarity/columns";

async function getData(): Promise<MovieSimilarityT[]> {
    return [
        {similarity:0.222,type:"OTIAI", movie:{id:"12345",count_ratings:10,title:"Длинное название длинного фильма",mean_rating:7.7,year:2010,description:"dd",poster_path:null,genres:[{id:1,name:'Comedy'},{id:2,name:'Drama'}]}},
        {similarity:0,type:"PEARSON",  movie:{id:"12345",count_ratings:10,title:"Длинное название длинного фильма",mean_rating:7.7,year:2010,description:"dd",poster_path:null,genres:[{id:1,name:'Comedy'},{id:3,name:'Action'}]}},
    ]
}

export default async function MovieSimilarityTable() {
    const data = await getData()

    const dataWithFilterField = data.map(r=>({...r,
        filterField:[
            r.movie.year,
            r.movie.title,
            r.type,r.similarity,
            ...r.movie.genres.map(g=>g.name),
        ].join(" ")}))

    return (
        // <div className="container mx-auto py-10">
        <BaseTable header={"Похожие фильмы"} filterPlaceholder={"Фильм, сходство..."} columns={columns} data={dataWithFilterField} />
        // </div>
    )
}