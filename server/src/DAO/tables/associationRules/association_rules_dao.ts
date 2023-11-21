import { PrismaClient } from "@prisma/client";
import { createAssociationRuleGetDAOMixin } from "./mixin/association_rules_get_mixin";
import { createAssociationRuleDeleteDAOMixin } from "./mixin/association_rules_delete_mixin";
import { createAssociationRuleSaveDAOMixin } from "./mixin/association_rules_save_mixin";

export default function getAssociationRuleDAO(client:PrismaClient,testDb:boolean){
    return Object.assign({},
        createAssociationRuleGetDAOMixin(client,testDb),
        createAssociationRuleDeleteDAOMixin(client, testDb),
        createAssociationRuleSaveDAOMixin(client,testDb)
    )
}