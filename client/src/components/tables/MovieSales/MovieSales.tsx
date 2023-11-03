import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import {columns, MovieSalesT} from "@/components/tables/MovieSales/columns";

async function getData(): Promise<MovieSalesT[]> {
    return [
        {user:{id:1,login:"длинный_логин",email:"Длинное_email@email.ru",role:"USER"}, date: "2023-10-02T07:41:47.267Z",},
        {user:{id:1,login:"длинный_логин",email:"Длинное_email@email.ru",role:"USER"}, date: "2023-10-02T07:41:47.267Z",},
    ]
}

export default async function MovieSalesTable() {
    const data = await getData()

    const dataWithFilterField = data.map(r=>({...r,
        filterField:[
            r.user.login,
            r.user.email,
        ].join(" ")}))

    return (
        // <div className="container mx-auto py-10">
        <BaseTable header={`Продажи ${data.length}`} filterPlaceholder={"Пользователь..."} columns={columns} data={dataWithFilterField} />
        // </div>
    )
}