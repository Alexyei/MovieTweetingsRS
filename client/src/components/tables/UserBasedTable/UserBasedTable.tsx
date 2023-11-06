import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import {UserBasedTableT,columns} from "@/components/tables/UserBasedTable/columns";



export default function UserBasedTable({header,data}:{header:string,data:UserBasedTableT[]}) {
    // const data = await getData()

    const dataWithFilterField = data.map(r=>({...r,
        filterField:[
            r.user.login,
            r.user.email,
            r.user.id,
            r.rating,r.similarity
        ].join(" ")}))

    return (
        <BaseTable header={header} filterPlaceholder={"Пользователь, сходство..."} columns={columns} data={dataWithFilterField} />
    )
}