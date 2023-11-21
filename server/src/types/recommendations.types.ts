export type CFNBItemItemRecommendationT = {target: string, sources: {id: string, similarity: number, rating: number}[], predictedRating: number}
export type CFNBUserUserRecommendationT = {target:string,sources:{id:number, similarity: number, rating: number}[],predictedRating:number}
export type AssociationRuleT = {target:string,source:string, support:number, confidence:number}