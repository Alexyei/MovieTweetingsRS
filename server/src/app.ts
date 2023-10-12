import express from "express";
import path from "path";
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import {PopularityRecommender} from "./recommenders/popularity_recommender";
import {config} from "dotenv";
import {createServer} from "http";
import sessionMiddleware from "./middlewares/session_middleware";
import errorMiddleware from "./middlewares/error_middleware";
import router from "./routes/router";
config()



const PORT = Number(process.env['BACKEND_PORT']) || 3001
const HOST = process.env['BACKEND_HOST']!

const prisma = new PrismaClient()

const app = express()
app.use(express.json())

app.use(sessionMiddleware)
app.use(cors({
    credentials: true,
    origin: process.env['FRONTEND_URL']!
}));
app.use('/static', express.static(path.join(__dirname, 'src/public')));
app.use('/api/v1.0.0', router);
app.use(errorMiddleware);
// app.get('/rec/pop/score/:userId/:movieId', async (req, res) => {
//     const score = await new PopularityRecommender().predictScore( Number(req.params.userId), req.params.movieId)
//     res.send(score)
// })
// app.get('/rec/pop/nrating/:userId', async (req, res) => {
//     const movies = await new PopularityRecommender().recommendItems( Number(req.params.userId), 20)
//     res.send(movies)
// })
// app.get('/rec/pop/npurchases/:userId', async (req, res) => {
//     const movies = await new PopularityRecommender().recommendBestSellers( Number(req.params.userId), 20)
//     res.send(movies)
// })
//
// app.post('/user', async (req, res) => {
//     const { name, email } = req.body
//
//     try{
//         const user = await prisma.user.create({
//             data: {
//                 name,
//                 email
//             },
//         })
//         res.json(user)
//     }
//     catch (err:any){
//         res.json(err.toString())
//     }
//
//
// })

if (process.env.PRODUCTION_MODE == "FALSE"){
    const httpServer = createServer(app);
    httpServer.listen(PORT, HOST, () => {
        console.log(`Server started at ${HOST}:${PORT}`);
    })
}
else{
    //https
}


