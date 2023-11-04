import {BaseTable} from "@/components/tables/BaseTable/BaseTable";

import {UserRatingT,columns} from "@/components/tables/UserRatings/columns";

async function getData(): Promise<UserRatingT[]> {
    return [
        {type:"IMPLICIT", rating:0.0001, movie:{id:"12345",count_ratings:10,title:"Длинное название длинного фильма",mean_rating:7.7,year:2010,description:"dd",poster_path:null,genres:[{id:1,name:'Comedy'},{id:2,name:'Drama'}]}},
        {type:"EXPLICIT", rating:4.5, movie:{id:"12345",count_ratings:10,title:"Длинное название длинного фильма",mean_rating:7.7,year:2010,description:"dd",poster_path:null,genres:[{id:1,name:'Comedy'},{id:3,name:'Action'}]}},
        {type:"PRIORITY", rating:7.37, movie:{id:"12345",count_ratings:10,title:"Длинное название длинного фильма",mean_rating:7.7,year:2010,description:"dd",poster_path:null,genres:[{id:1,name:'Comedy'},{id:3,name:'Action'}]}},
    ]
}

export default async function UserRatingTable() {
    const data = await getData()

    const dataWithFilterField = data.map(r=>({...r,
        filterField:[
            r.movie.year,
            r.movie.title,
            ...r.movie.genres.map(g=>g.name),
            r.type,
            r.rating
        ].join(" ")}))

    return (
        // <div className="container mx-auto py-10">
        <BaseTable header={"Оценки пользователя"} filterPlaceholder={"Фильм, тип, оценка..."} columns={columns} data={dataWithFilterField} />
        // </div>
    )
}