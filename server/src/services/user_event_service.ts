import {getDAO} from "../DAO/DAO";
import {TypeEvent} from "@prisma/client";
import {ApiError} from "../exceptions/api_errors";

const dao = getDAO(false);

class UserEventService {
    async create(userId: number, movieId: string | null, genreId: number | null, type: TypeEvent, sessionId: string) {
        const events = await dao.userEvent.getUserEvents(userId)
        if (movieId) {
            const thisMovieEvents = events.filter(e => e.movieId == movieId)

            const addCountEvent = thisMovieEvents.find(e => e.event == "ADD_TO_FAVORITES_LIST")
            const removeCountEvent = thisMovieEvents.find(e => e.event == "REMOVE_FROM_FAVORITES_LIST")
            const buyEvent = thisMovieEvents.find(e => e.event == "BUY")
            const addCount = addCountEvent ? addCountEvent._count.event : 0
            const removeCount = removeCountEvent ? removeCountEvent._count.event : 0
            const buyCount = buyEvent ? buyEvent._count.event : 0

            if (type == "ADD_TO_FAVORITES_LIST") {
                if (addCount != 0 && removeCount < addCount)
                    throw ApiError.BadRequest('Элемент уже в списке');
            }
            if (type == "REMOVE_FROM_FAVORITES_LIST") {
                if (removeCount == addCount)
                    throw ApiError.BadRequest('Элемент уже удалён');
            }
            if (type == "BUY") {
                if (buyCount != 0)
                    throw ApiError.BadRequest('Элемент уже куплен');
            }
        }

        return await dao.userEvent.saveOne({
            userId: userId,
            movieId: movieId,
            genreId: genreId,
            event: type,
            sessionId
        });
    }

    async eventsCount() {
        const sessionsWithBuy = await dao.userEvent.getSessionsWithBuy()
        const sessionsIDs = sessionsWithBuy.map(s => s.sessionId!)
        const countsWithBuy = await dao.userEvent.getCountBySessionIDs(sessionsIDs)
        const countsWithNoBuy = await dao.userEvent.getCountBySessionIDs(sessionsIDs, false)

        const events = ["GENRE_VIEW", "DETAILS", "MORE_DETAILS", "ADD_TO_FAVORITES_LIST", "REMOVE_FROM_FAVORITES_LIST", "BUY"]
        const results = events.map(event => {
            return {
                event,
                buy: countsWithBuy.find(c=>c.event==event)?.count || 0,
                no_buy: countsWithNoBuy.find(c=>c.event==event)?.count || 0,
            }
        })

        results.sort((a, b) => b.buy - a.buy)

        return results
    }

    async purchasesInfo(){
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const twoMonthAgo = new Date();
        twoMonthAgo.setMonth(twoMonthAgo.getMonth() - 2);

        const purchasesOneMonthAgo = await dao.userEvent.getPurchasesForPeriod(oneMonthAgo)
        const purchasesTwoMonthAgo = await dao.userEvent.getPurchasesForPeriod(twoMonthAgo,oneMonthAgo)

        const visitorsOneMonthAgo = await dao.userEvent.getVisitorsForPeriod(oneMonthAgo)
        const visitorsTwoMonthAgo = await dao.userEvent.getVisitorsForPeriod(twoMonthAgo,oneMonthAgo)

        const sessionsOneMonthAgo = await dao.userEvent.getSessionsForPeriod(oneMonthAgo)
        const sessionsTwoMonthAgo = await dao.userEvent.getSessionsForPeriod(twoMonthAgo,oneMonthAgo)

        const sessionsWithBuyOneMonthAgo = await dao.userEvent.getSessionsWithBuyForPeriod(oneMonthAgo)
        const sessionsWithBuyTwoMonthAgo = await dao.userEvent.getSessionsWithBuyForPeriod(twoMonthAgo,oneMonthAgo)

        return {
            purchases: {
                value: purchasesOneMonthAgo,
                diff: purchasesOneMonthAgo/purchasesTwoMonthAgo,
            },
            visitors: {
                value: visitorsOneMonthAgo,
                diff: visitorsOneMonthAgo/visitorsTwoMonthAgo,
            },
            sessions: {
                value: sessionsOneMonthAgo,
                diff: sessionsOneMonthAgo/sessionsTwoMonthAgo,
            },
            conversion: {
                value: sessionsWithBuyOneMonthAgo/sessionsOneMonthAgo,
                diff: (sessionsWithBuyOneMonthAgo/sessionsOneMonthAgo)/(sessionsWithBuyTwoMonthAgo/sessionsTwoMonthAgo),
            }
        }
    }

    async bestsellers(){
        return dao.userEvent.getPurchasesForUser(undefined,100)
    }
}

const userEventService = new UserEventService()
export default userEventService;