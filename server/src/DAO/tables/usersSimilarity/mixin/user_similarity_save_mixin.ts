import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";
import {UserSimilarityT} from "../../../../types/similarity.types";

class UserSimilaritySaveDAO__mixin extends DAOMixinHelper{

    async saveMany(userSimsData: UserSimilarityT[],skipDuplicates=false) {
        this._testDb ? await this._client.testUsersSimilarity.createMany({data: userSimsData,skipDuplicates}) : await this._client.usersSimilarity.createMany({data: userSimsData,skipDuplicates})
    }
}


export function createUserSimilaritySaveDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new UserSimilaritySaveDAO__mixin(client,testDb)

    return {
        'saveMany':mixin.saveMany.bind(mixin),
    }
}