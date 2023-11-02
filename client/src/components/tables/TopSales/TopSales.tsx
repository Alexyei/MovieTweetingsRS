import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import {columns} from "@/components/tables/TopSales/columns";
import {TopSalesT} from "@/components/tables/TopSales/columns";

async function getData(): Promise<TopSalesT[]> {
    return [
        {user:{id:1,login:"длинный_логин",email:"Длинное_email@email.ru",role:"USER"}, count: 150, movie:{id:"12345",title:"Длинное название длинного фильма",mean_rating:7.7,year:2010,description:"dd",poster_path:null,genres:[{id:1,name:'Comedy'},{id:2,name:'Drama'}]}},
        {user:{id:1,login:"длинный_логин",email:"Длинное_email@email.ru",role:"USER"}, count: 17, movie:{id:"12345",title:"Длинное название длинного фильма",mean_rating:7.7,year:2010,description:"dd",poster_path:null,genres:[{id:1,name:'Comedy'},{id:3,name:'Action'}]}},
    ]
}
export default async function TopSalesTable() {
    const data = await getData()

    const dataWithFilterField = data.map(r=>({...r,
        filterField:[
            r.user.login,
            r.user.email,
            r.movie.year,
            r.movie.title,
            r.count,
            ...r.movie.genres.map(g=>g.name),
        ].join(" ")}))

    return (
        // <div className="container mx-auto py-10">
        <BaseTable header={"Топ продаж"} filterPlaceholder={"Пользователь, фильм..."} columns={columns} data={dataWithFilterField} />
        // </div>
    )
}