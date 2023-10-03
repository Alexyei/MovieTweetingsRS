import {TestUser, User} from "@prisma/client";

export type UserT = Omit<User | TestUser, "email" | "name">