import {cookies} from "next/headers";
import {ErrorResponse} from "@/types/fetch.types";




export function serverFetchWrapper<ResponseT extends {status:number, response:any},PayloadT>(url:string, method: "GET"|"POST"|"DELETE"|"PUT",body:PayloadT | null = null) {

    const init:RequestInit = {
        method,
        credentials: "include",
        headers: {
            'Content-type':'application/json',
            Cookie: cookies().toString()
        },
    }


    if (body)
        init['body'] = JSON.stringify(body)

    return new Promise<ResponseT  | ErrorResponse>((resolve, reject) => {

        fetch(url,init)
            .then(async (response) => {
                const answer = await response.json()
                // Проверяем статус ответа
                if (response.status < 500){
                    return {status:response.status, response: answer} as ResponseT
                } else {

                    // Если сервер вернул ошибку, передаем ее в catch
                    throw new Error(answer.message || `Fetch error - ${response.status}`);

                }
            })
            .then(data => resolve(data))
            .catch(error => resolve({status:400,response:{message:'Проверьте подключение к интернету'}} as ResponseT));


    });
}