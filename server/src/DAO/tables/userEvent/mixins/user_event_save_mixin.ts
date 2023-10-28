import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";
import {RatingWithTypeT} from "../../../../types/rating.types";
import {UserEventT} from "../../../../types/userEvent.types";

class UserEventSaveDAO__mixin extends DAOMixinHelper{
    async saveOne(event:UserEventT){
        this._testDb ? await this._client.testUserEvent.create({data: event}) : await this._client.userEvent.create({data: event})

    }

}


export function createUserEventSaveDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new UserEventSaveDAO__mixin(client,testDb)

    return {
        'saveOne':mixin.saveOne.bind(mixin),
    }
}