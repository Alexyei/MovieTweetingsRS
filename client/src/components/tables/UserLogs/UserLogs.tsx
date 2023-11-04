import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import {columns, UserLogsT} from "@/components/tables/UserLogs/columns";

async function getData(): Promise<UserLogsT[]> {
    return [
        {date: "2023-10-02T07:41:47.267Z",event:"DETAILS",genre:null, movie:{id:"12345",count_ratings:10,title:"Длинное название длинного фильма",mean_rating:7.7,year:2010,description:"dd",poster_path:null,genres:[{id:1,name:'Comedy'},{id:2,name:'Drama'}]}},
        {date: "2023-10-02T07:41:47.267Z",event:"REMOVE_FROM_FAVORITES_LIST",genre:{id:1,name:"comedy"},  movie:null},
    ]
}

export default async function UserLogsTable() {
    const data = await getData()

    const dataWithFilterField = data.map(r=>({...r,
        filterField:[
            r.event,
        ...(r.movie ? [
            r.movie.year,
            r.movie.title,
            ...r.movie.genres.map(g=>g.name)] : [r.genre?.name, r.genre?.id])
        ].join(" ")}))

    return (
        // <div className="container mx-auto py-10">
        <BaseTable header={"Действия пользователя"} filterPlaceholder={"Фильм, жанр, событие..."} columns={columns} data={dataWithFilterField} />
        // </div>
    )
}