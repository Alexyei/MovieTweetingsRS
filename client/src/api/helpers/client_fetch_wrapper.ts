'use client'



import {ErrorResponseT} from "@/types/fetch.types";

export function clientFetchWrapper<ResponseT extends {status:number, response:any},PayloadT>
(url:string, method: "GET"|"POST"|"DELETE"|"PUT", body:PayloadT | null = null) {

    const init:RequestInit = {
        method,
        credentials: "include",
        headers: {
            'Content-type':'application/json'
        },
    }



    if (body)
        init['body'] = JSON.stringify(body)

    return new Promise<ResponseT  | ErrorResponseT>((resolve, reject) => {

            fetch(url,init)
                .then(async (response) => {
                    const answer = await response.json()


                    // Проверяем статус ответа
                    if (response.status < 500){
                        // if (response.status == 401)
                        //     redirect('/sign-in')
                        // if (response.status == 403)
                        //     notFound()
                        return {status:response.status, response: answer} as ResponseT
                    } else {

                        // Если сервер вернул ошибку, передаем ее в catch
                        throw new Error(answer.message || `Fetch error - ${response.status}`);

                    }
                })
                .then(data => resolve(data))
                .catch(error => reject(error));


    });
}