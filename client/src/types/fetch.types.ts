export type ErrorResponseT = {
    status: 400 | 401 | 403,
    response: { message: string }
}

export type fetchWrapperT
    = <ResponseT extends {status:number, response:any},PayloadT>(url:string, method: "GET"|"POST"|"DELETE"|"PUT",body?:PayloadT | null)
    =>Promise<ResponseT| ErrorResponseT>