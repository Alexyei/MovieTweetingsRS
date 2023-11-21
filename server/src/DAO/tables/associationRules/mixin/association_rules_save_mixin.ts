import {DAOMixinHelper} from "../../../dao_helper";
import {PrismaClient} from "@prisma/client";
import { AssociationRuleT } from "../../../../types/recommendations.types";

class AssociationRuleSaveDAO__mixin extends DAOMixinHelper{

    async saveMany(rules: AssociationRuleT[],skipDuplicates=false) {
        this._testDb ? await this._client.testAssociationRule.createMany({data: rules,skipDuplicates}) : await this._client.associationRule.createMany({data: rules,skipDuplicates})
    }
}


export function createAssociationRuleSaveDAOMixin(client:PrismaClient,testDb:boolean){
    const mixin = new AssociationRuleSaveDAO__mixin(client,testDb)

    return {
        'saveMany':mixin.saveMany.bind(mixin),
    }
}