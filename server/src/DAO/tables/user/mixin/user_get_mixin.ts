import {DAOMixinHelper} from "../../../dao_helper";
import {UserDataT, UserDataWithPasswordT, UserT} from "../../../../types/user.types";
import {PrismaClient} from "@prisma/client";

class UserGetDAO__mixin extends DAOMixinHelper{
    async getUsersDataByIds(userIds:number[]):Promise<UserDataT[]>{
        if (this._testDb){
            return this._client.testUser.findMany({
                where: {id: {in: userIds},},
                select: {id: true, login: true, email:true,role:true},
            });
        }
        return this._client.user.findMany({
            where: {id: {in: userIds},},
            select: {id: true, login: true, email:true,role:true},
        });
    }


    async getUserByLogin(login:string,returnPassword = false):Promise<UserDataT | UserDataWithPasswordT  | null>{
        if (this._testDb){
            return this._client.testUser.findFirst({
                where: {login: login,},
                select: {id: true, login: true, email:true,role:true,password:returnPassword},
            });
        }
        return this._client.user.findFirst({
            where: {login: login,},
            select: {id: true, login: true, email:true,role:true,password:returnPassword},
        });
    }

    async getUserByEmail(email:string):Promise<UserDataT | null>{
        if (this._testDb){
            return this._client.testUser.findFirst({
                where: {email: email,},
                select: {id: true, login: true, email:true,role:true},
            });
        }
        return this._client.user.findFirst({
            where: {email: email,},
            select: {id: true, login: true, email:true, role:true},
        });
    }

    async getUserByID(id:number):Promise<UserDataT | null>{
        if (this._testDb){
            return this._client.testUser.findFirst({
                where: {id: id,},
                select: {id: true, login: true, email:true,role:true},
            });
        }
        return this._client.user.findFirst({
            where: {id: id,},
            select: {id: true, login: true, email:true, role:true},
        });
    }
}


export function createUserGetDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new UserGetDAO__mixin(client,testDb)

    return {
        'getUsersDataByIds':mixin.getUsersDataByIds.bind(mixin),
        'getUserByLogin':mixin.getUserByLogin.bind(mixin),
        'getUserByEmail':mixin.getUserByEmail.bind(mixin),
        'getUserByID':mixin.getUserByID.bind(mixin),
    }
}