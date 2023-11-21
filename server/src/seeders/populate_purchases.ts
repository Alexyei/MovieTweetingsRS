import {PrismaClient, TypeEvent} from "@prisma/client";
import ProgressBar from "progress";
import {createPinoLogger} from "../logger/pino_basic_logger";
import { User, addUsers, checkAllFilmsExists, createSession, films, saveUserEvent } from "./populate_logs";


const prisma = new PrismaClient()



const minFilmsInCategory = Math.min(films.action.length,films.drama.length,films.comedy.length)



async function populate(users:User[]) {
    const logger = createPinoLogger("purchases")

    const progressBar = new ProgressBar(":bar :current/:total", {total: Math.floor(minFilmsInCategory/2)*users.length});
    
    for (const user of users){
        const avaibleMovies =  Object.keys(user.avaibleMovies).map(key=>user.avaibleMovies[key]).reduce((acc, el)=>[...acc,...el],[]).sort(() => .5 - Math.random()).slice(0,minFilmsInCategory/2)
        for (const movieId of avaibleMovies){
            await saveUserEvent(user.userId,user.sessionId,'BUY',movieId,null)
            logger.info( `userId: ${user.userId}; sessionId: ${user.sessionId};event: ${'BUY'}; movieId: ${movieId}; genre: ${null}`);
            progressBar.tick()
        }
    }


}

async function flushDB() {
    await prisma.userEvent.deleteMany({where: {userId: {in: users.map(u=>u.userId)}}})
}

const users = [
    new User(400501, createSession(), {action: 20, drama: 30, comedy: 50},minFilmsInCategory),
    new User(400502, createSession(), {action: 60, drama: 20, comedy: 20},minFilmsInCategory),
    new User(400503, createSession(), {action: 20, drama: 50, comedy: 30},minFilmsInCategory),
    new User(400504, createSession(), {action: 100, drama: 0, comedy: 0},minFilmsInCategory),
    new User(400505, createSession(), {action: 0, drama: 100, comedy: 0},minFilmsInCategory),
    new User(400506, createSession(), {action: 0, drama: 0, comedy: 100},minFilmsInCategory),
    new User(400507, createSession(), {action: 20, drama: 30, comedy: 50},minFilmsInCategory),
    new User(400508, createSession(), {action: 60, drama: 20, comedy: 20},minFilmsInCategory),
    new User(400509, createSession(), {action: 20, drama: 50, comedy: 30},minFilmsInCategory),
    new User(400510, createSession(), {action: 100, drama: 0, comedy: 0},minFilmsInCategory),
    new User(400511, createSession(), {action: 0, drama: 100, comedy: 0},minFilmsInCategory),
    new User(400512, createSession(), {action: 0, drama: 0, comedy: 100},minFilmsInCategory),
]

export function populatePurchases(){
    checkAllFilmsExists()
    .then(() => addUsers(users.map(u=>u.userId)))
    .then(flushDB).then(()=>populate(users))
}
