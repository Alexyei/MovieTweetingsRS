import {PrismaClient, TestUser} from "@prisma/client";
import {UserT} from "../types/user.types";
const prisma = new PrismaClient();
export async function saveUsers(usersData: UserT[], testDB=true) {
    testDB ? await prisma.testUser.createMany({data: usersData}) : await prisma.user.createMany({data: usersData})
}

export async function deleteAllUsers(testDB = true){
    testDB ? await prisma.testUser.deleteMany() : await prisma.user.deleteMany()
}