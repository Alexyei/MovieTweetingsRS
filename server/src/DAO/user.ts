import {PrismaClient, TestUser} from "@prisma/client";
import {UserT} from "../types/user.types";
const prisma = new PrismaClient();

export async function getUsersDataByIds(userIds:number[], testDb=true){
    if (testDb){
        return prisma.testUser.findMany({
            where: {id: {in: userIds},},
            select: {id: true, name: true},
        });
    }
    return prisma.user.findMany({
        where: {id: {in: userIds},},
        select: {id: true, name: true},
    });
}
export async function saveUsers(usersData: UserT[], testDB=true) {
    testDB ? await prisma.testUser.createMany({data: usersData}) : await prisma.user.createMany({data: usersData})
}
export async function deleteAllUsers(testDB = true){
    testDB ? await prisma.testUser.deleteMany() : await prisma.user.deleteMany()
}