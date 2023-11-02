import {SalesT} from "@/components/tables/RecentSalesCustom/columns";
import {columns} from "@/components/tables/RecentSalesCustom/columns";
import {BaseTable} from "@/components/tables/BaseTable/BaseTable";

async function getData(): Promise<SalesT[]> {
    return [
        {user:{id:1,login:"длинный_логин",email:"Длинное_email@email.ru",role:"USER"}, date: "2023-10-02T07:41:47.267Z", movie:{id:"12345",title:"Длинное название длинного фильма",mean_rating:7.7,year:2010,description:"dd",poster_path:null,genres:[{id:1,name:'Comedy'},{id:2,name:'Drama'}]}},
        {user:{id:1,login:"длинный_логин",email:"Длинное_email@email.ru",role:"USER"}, date: "2023-10-02T07:41:47.267Z", movie:{id:"12345",title:"Длинное название длинного фильма",mean_rating:7.7,year:2010,description:"dd",poster_path:null,genres:[{id:1,name:'Comedy'},{id:3,name:'Action'}]}},
    ]
}

export default async function RecentSalesTableCustom() {
    const data = await getData()

    const dataWithFilterField = data.map(r=>({...r,
        filterField:[
            r.user.login,
            r.user.email,
            r.movie.year,
            r.movie.title,
            ...r.movie.genres.map(g=>g.name),
        ].join(" ")}))

    return (
        // <div className="container mx-auto py-10">
        <BaseTable header={"Недавние продажи"} filterPlaceholder={"Пользователь, фильм"} columns={columns} data={dataWithFilterField} />
        // </div>
    )
}