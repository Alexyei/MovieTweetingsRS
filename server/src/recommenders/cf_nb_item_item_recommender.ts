import {BaseRecommender} from "./base_recommender";
import {PrismaClient} from "@prisma/client";
import {getRatingsWithPriorityByUserId} from "../utils/ORM";
import {not} from "mathjs";

const prisma = new PrismaClient()

export class ItemItemRecommender extends BaseRecommender {
    async predictScore(userId: number, movieId: string) {
        throw new Error("Method 'predictScore(userId:number, movieId:string)' must be implemented.");
    }

    async recommendItems(userId: number, take: number = 10) {
        const userRatings = await getRatingsWithPriorityByUserId(userId)
        if (userRatings.length == 0) return []

        const userMeanRating = userRatings.reduce((acc, rating) =>rating.rating + acc,0) / userRatings.length

        const userMovieIds = userRatings.map(r => r.movieId)

        const min_sims = 0.2
        const candidatesPairs = await prisma.moviesSimilarity.findMany({
            where: {
                source: {in: userMovieIds},
                target: {notIn: userMovieIds},
                similarity: {gte: min_sims}
            }
        })

        const recommendations:{target:string,sources:{id:string, similarity: number, rating: number}[],predictedRating:number}[] = []
        // const recommendations:{[key:string]:{sources:{id:string, similarity: number}[],predictedRating:number}} = {}
        for (const candidate of candidatesPairs){
            const target = candidate.target
            if (recommendations.findIndex(rec=>rec.target==target)!=-1) continue;

            const sources = candidatesPairs.filter(p=>p.target == target)
            if (sources.length == 0) continue;
            let numerator = 0;
            let denominator = 0;
            const sourcesInfo:{id:string, similarity: number, rating: number}[] = []
            for (const source of sources){
                const sourceRating = userRatings.find(r=>r.movieId==source.source)!.rating - userMeanRating
                numerator += source.similarity*sourceRating
                denominator += source.similarity

                sourcesInfo.push({id:source.source,similarity:source.similarity,rating:sourceRating+userMeanRating})
            }

            recommendations.push({target,sources: sourcesInfo, predictedRating:numerator/denominator})
        }

        const sortedRecommendations = recommendations.sort((a, b) => b.predictedRating - a.predictedRating);
        const notUserMoviesIds = candidatesPairs.map(p=>p.target)

        const moviesData = await prisma.movie.findMany({
            where: {
                id: {
                    in: Array.from(new Set([...notUserMoviesIds,...userMovieIds])),
                },

            },
            select: { id: true, poster_path: true,title:true },
        });

        sortedRecommendations.map(rec=>{
            const targetData = moviesData.find(m=>m.id==rec.target)!
            return {
                movieId: rec.target,
                posterPath: targetData.poster_path,
                title: targetData.title,
                predictedRating: rec.predictedRating,
                recommendedByMovies: rec.sources.map(s=>{
                    const sourceData = moviesData.find(m=>m.id==s.id)!
                    return {
                        movieId: s.id,
                        posterPath: targetData.poster_path,
                        title: targetData.title,
                        rating: s.rating
                    }
                })
            }
        })
        // const candidatePairs = await prisma.moviesSimilarity.findMany({
        //         where: {
        //             OR: [
        //                 {
        //                     AND: {
        //                         movieId1: {
        //                             in: userMovieIds
        //                         },
        //                         movieId2: {
        //                             notIn: userMovieIds
        //                         },
        //                     },
        //                 },
        //                 {
        //                     AND: {
        //                         movieId1: {
        //                             notIn: userMovieIds
        //                         },
        //                         movieId2: {
        //                             in: userMovieIds
        //                         },
        //                     }
        //                 }
        //             ],
        //             similarity: {gte: min_sims}
        //         },
        //         orderBy: {
        //             similarity: 'desc'
        //         }
        //     })


    }
}