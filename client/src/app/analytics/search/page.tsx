import {getServerAPI} from "@/api/server_api";
import ServerAdminRoute from "@/components/routes/ServerAdminRoute/ServerAdminRoute";
import UserSearch from "@/components/tables/UserSearch/UserSearch";
import MovieSearchPanel from "@/components/MovieSearchPanel/MovieSearchPanel";

const api = getServerAPI()
export default async function Page(){
    return (
        <ServerAdminRoute>
            <div className="grid w-full gap-4 lg:grid-cols-2">
                <UserSearch/>
                <MovieSearchPanel title={"Поиск фильма"} admin={true}/>
            </div>
        </ServerAdminRoute>
    )
}