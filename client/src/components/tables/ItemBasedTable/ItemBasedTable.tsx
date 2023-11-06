import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import {ItemBasedTableT,columns} from "@/components/tables/ItemBasedTable/columns";



export default function ItemBasedTable({header,data}:{header:string,data:ItemBasedTableT[]}) {
    // const data = await getData()

    const dataWithFilterField = data.map(r=>({...r,
        filterField:[
            r.movie.year,
            r.movie.title,
            ...r.movie.genres.map(g=>g.name),r.rating,r.similarity
        ].join(" ")}))

    return (
        <BaseTable header={header} filterPlaceholder={"Фильм, сходство..."} columns={columns} data={dataWithFilterField} />
    )
}