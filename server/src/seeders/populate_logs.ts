import {PrismaClient, TypeEvent} from "@prisma/client";
import ProgressBar from "progress";
import {createBasicLogger} from "../logger/basic_logger";
import random_gen from "random-seed"
const logger = createBasicLogger("logs")
const prisma = new PrismaClient()
const random = random_gen.create('0')
const films = {
    'comedy': [
        '0475290'
        , '1289401'
        , '1292566'
        , '1473832'
        , '1489889'
        , '1608290'
        , '1679335'
        , '1700841'
        , '1711525'
        , '1860213'
        , '1878870'
        , '1985949'
        , '2005151'
        , '2277860'
        , '2387499'
        , '2709768'
        , '2823054'
        , '2869728'
        , '2937696'
        , '3110958'
        , '3381008'
        , '3470600'
        , '3521164'
        , '3553442'
        , '3783958'
        , '3874544'
        , '4034354'
        , '4048272'
        , '4136084'
        , '4139124'
        , '4438848'
        , '4501244'
        , '4513674'
        , '4624424'
        , '4651520'
        , '4698684'
        , '4901306'
        , '5247022'
        , '5512872'],
    'drama': ['2119532'
        , '2543164'
        , '3783958'
        , '3315342'
        , '3263904'
        , '4034228'
        , '3040964'
        , '3741834'
        , '2140479'
        , '1179933'
        , '1355644'
        , '4550098'
        , '2582782'
        , '4975722'
        , '2674426'
        , '2005151'
        , '4846340'
        , '1860357'
        , '3640424'
        , '3553976'
        , '2241351'
        , '4052882'
        , '2671706'
        , '3774114'
        , '5512872'
        , '4172430'
        , '3544112'
        , '4513674'
        , '0490215'
        , '1619029'
        , '4572514'
        , '1878870'
        , '1083452'
        , '2025690'
        , '1219827'
        , '1972591'
        , '4276820'
        , '2381991'
        , '3416532'
        , '2547584'
    ],
    'action': [
        '1431045', '2975590'
        , '1386697'
        , '3498820'
        , '3315342'
        , '1211837'
        , '2948356'
        , '3748528'
        , '3385516'
        , '3110958'
        , '4196776'
        , '4425200'
        , '3896198'
        , '2404435'
        , '3731562'
        , '1860357'
        , '4630562'
        , '0803096'
        , '2660888'
        , '3640424'
        , '3300542'
        , '0918940'
        , '2094766'
        , '5700672'
        , '1289401'
        , '1628841'
        , '3393786'
        , '4172430'
        , '4094724'
        , '2025690'
        , '4116284'
        , '3381008'
        , '1219827'
        , '1972591'
        , '2381991'
        , '2034800'
        , '2267968'
        , '2869728'
        , '3949660'
        , '3410834'
        , '2250912']
}

async function checkAllFilmsExists(){
    for (const key of Object.keys(films)){
        const ids = films[key as keyof typeof films]
        const movies = await prisma.movie.findMany({
            where: { id: {in: ids}}
        })
        logger.log('info',[key, ids.length, movies.length])
        if (ids.length !== movies.length) throw Error("Film not found")
    }
}
async function addUsers(ids: number[]){
    for (let id of ids){
        await prisma.user.upsert({
            where: { id },
            create: { id },
            update: {},
        })
    }
}
class User {
    private sessionId: number;
    public userId: number;
    private readonly likes: { drama: number; comedy: number; action: number };
    // public events: { [p: number]: any[] };
    public purchasedFilms: any[];
    constructor(user_id:number, action:number, drama:number, comedy:number) {
        this.sessionId = random.range(1000000);
        this.userId = user_id;
        this.likes = { action: action, drama: drama, comedy: comedy };
        // this.events = { [this.sessionId]: [] };
        this.purchasedFilms = []

    }

    get_session_id() {
        // сессии имитирую различные устройства одного пользователя
        if (random.range(100) >= 90) {
            this.sessionId += 1;
            // this.events[this.sessionId] = [];
        }

        return this.sessionId;
    }

    select_genre() {
        return sample(this.likes)  as 'drama' | 'action' | 'comedy';
    }
}

function sample(dictionary: { [x:string]:number }) {
    const random_number = random.intBetween(1,100);
    let index = 0;
    for (const [key, value] of Object.entries(dictionary)) {
        index += value;

        if (random_number <= index) {
            return key;
        }
    }
    console.log('errro')
}

function select_film(user:User) {
    const genre = user.select_genre()
    const interested_films = films[genre];
    let film_id = '';
    while (film_id === '') {
        const film_candidate = interested_films[random.range(interested_films.length)];

        const hasSameElements = interested_films.every(element => user.purchasedFilms.includes(element));
        // console.log(hasSameElements)
        // if (!user.events[user.sessionId].includes(film_candidate)) {
        //     film_id = film_candidate;
        // }
        if (!user.purchasedFilms.includes(film_candidate)) {
            film_id = film_candidate;
        }
    }

    return film_id;
}

function select_action() {
    const actions = {
        [TypeEvent.GENRE_VIEW]: 15,
        [TypeEvent.DETAILS]: 50,
        [TypeEvent.MORE_DETAILS]: 24,
        [TypeEvent.ADD_TO_LIST]: 10,
        [TypeEvent.BUY]: 1
    };

    return sample(actions) as keyof typeof actions;
}

async function flushDB(){
    await prisma.userEvent.deleteMany()
}

async function populate(){
    const number_of_events = 20000
    console.log("Generating Data");
    const users = [
        new User(400001, 20, 30, 50),
        new User(400002, 50, 20, 40),
        new User(400003, 20, 30, 50),
        new User(400004, 100, 0, 0),
        new User(400005, 0, 100, 0),
        new User(400006, 0, 0, 100),
    ]
    console.log("Simulating " + users.length + " visitors");

    const progressBar = new ProgressBar(":bar :current/:total", { total: number_of_events });

    for (let i = 0; i < number_of_events; i++) {
        const randomUserId = random.range(users.length);
        const user = users[randomUserId];
        const selectedAction = select_action();
        const selectedFilm = select_film(user);

        if (selectedAction === "BUY") {
            // if (!user.events[user.sessionId]) {
            //     user.events[user.sessionId] = [];
            // }
            // user.events[user.sessionId].push(selectedFilm);
            user.purchasedFilms.push(selectedFilm)
        }
        logger.log('info',"user id " + user.userId + " selects film " + selectedFilm + " and " + selectedAction);


        const userEvent = await prisma.userEvent.create({
            data: {
                movieId: selectedFilm,
                event: selectedAction,
                sessionId: user.get_session_id(),
                userId: user.userId
            }
        })
        logger.log('info',userEvent);
        progressBar.tick()

        // logger.log('info',"users\n");
        // for (const u of users) {
        //     logger.log('info',"user with id " + u.userId);
        //     for (const [key, value] of Object.entries(u.events)) {
        //         if (value.length > 0) {
        //             logger.log('info',key + ": " + value.join(", "));
        //         }
        //     }
        // }
    }

}


checkAllFilmsExists().then(()=>addUsers([400001,400002,400003,400004,400005,400006])).then(flushDB).then(populate)