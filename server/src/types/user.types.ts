import {TestUser, User} from "@prisma/client";

export type UserT = Omit<User | TestUser, "email" | "name">
export type UserDataT = {name: string | null, id: number}