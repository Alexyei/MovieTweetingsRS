import {BaseTable} from "@/components/tables/BaseTable/BaseTable";

import {UserCollectionT,columns} from "@/components/tables/UserCollection/columns";

async function getData(): Promise<UserCollectionT[]> {
    return [
        {type:"BUY", movie:{id:"12345",count_ratings:10,title:"Длинное название длинного фильма",mean_rating:7.7,year:2010,description:"dd",poster_path:null,genres:[{id:1,name:'Comedy'},{id:2,name:'Drama'}]}},
        {type:"IN LIST",  movie:{id:"12345",count_ratings:10,title:"Длинное название длинного фильма",mean_rating:7.7,year:2010,description:"dd",poster_path:null,genres:[{id:1,name:'Comedy'},{id:3,name:'Action'}]}},
    ]
}

export default async function UserCollectionTable() {
    const data = await getData()

    const dataWithFilterField = data.map(r=>({...r,
        filterField:[
            r.movie.year,
            r.movie.title,
            ...r.movie.genres.map(g=>g.name),
            r.type,
        ].join(" ")}))

    return (
        // <div className="container mx-auto py-10">
        <BaseTable header={"Фильмы пользователя"} filterPlaceholder={"Фильм, тип..."} columns={columns} data={dataWithFilterField} />
        // </div>
    )
}