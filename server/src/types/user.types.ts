import {TestUser, User, UserRole} from "@prisma/client";

export type UserT = Omit<User | TestUser, "email" | "login">
export type UserDataT = {login: string | null, id: number, email: string | null, role: UserRole}
export type UserDataWithPasswordT = {login: string | null, id: number, email: string | null, password:string |null, role: UserRole}
export type UserSaveT = {login?:string,email?:string,role?:UserRole,password:string}

declare module 'express-session' {
    interface SessionData {
        user: UserDataT
    }
}