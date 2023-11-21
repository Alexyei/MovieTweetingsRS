import { getDAO } from "../DAO/DAO";

const dao = getDAO(false)
export class AssociationRuleRecommender{
    async recommendItems(movieId: string, take: number|undefined) {
        const rules = await dao.associationRule.getAssociationRules(movieId, take)

        return rules.map(rule=>{
            const {id, createdAt,source,...rest} = rule
            return rest
        })
    }
}