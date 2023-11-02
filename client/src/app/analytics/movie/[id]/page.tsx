import {getServerAPI} from "@/api/server_api";
import ServerAdminRoute from "@/components/routes/ServerAdminRoute/ServerAdminRoute";

const api = getServerAPI()
export default async function Page({params}: { params: { id: string } }){
    return (
        <ServerAdminRoute>
            {params.id}
        </ServerAdminRoute>
    )
}