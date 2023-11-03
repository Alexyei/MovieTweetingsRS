import {BaseTable} from "@/components/tables/BaseTable/BaseTable";
import {columns, UserSimilarityT} from "@/components/tables/UserSimilarity/columns";

async function getData(): Promise<UserSimilarityT[]> {
    return [
        {similarity:0.222,type:"OTIAI", user:{id:1,login:"длинный_логин",email:"Длинное_email@email.ru",role:"USER"},},
        {similarity:0,type:"PEARSON",  user:{id:1,login:"длинный_логин",email:"Длинное_email@email.ru",role:"USER"},},
    ]
}

export default async function UserSimilarityTable() {
    const data = await getData()

    const dataWithFilterField = data.map(r=>({...r,
        filterField:[
            r.user.login,
            r.user.email,
            r.user.id,
            r.user.role,r.type,r.similarity
        ].join(" ")}))

    return (
        <BaseTable header={"Похожие пользователи"} filterPlaceholder={"Пользователь, сходство..."} columns={columns} data={dataWithFilterField} />
    )
}