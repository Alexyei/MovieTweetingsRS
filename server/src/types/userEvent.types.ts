import {TestUserEvent, UserEvent} from "@prisma/client";

export type UserEventT = Omit<UserEvent | TestUserEvent,'createdAt' | 'id'>