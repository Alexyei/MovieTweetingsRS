import express from "express";
import path from "path";
import { PrismaClient } from '@prisma/client'
import bodyParser from "body-parser";
import {PopularityRecommender} from "./recommenders/popularity_recommender";


const prisma = new PrismaClient()
const app = express()
const port = 3000


app.use(bodyParser.json())

app.use('/static', express.static(path.join(__dirname, 'src/public')));

app.get('/rec/pop/score/:userId/:movieId', async (req, res) => {
    const score = await new PopularityRecommender().predictScore( Number(req.params.userId), req.params.movieId)
    res.send(score)
})
app.get('/rec/pop/nrating/:userId', async (req, res) => {
    const movies = await new PopularityRecommender().recommendItems( Number(req.params.userId), 20)
    res.send(movies)
})
app.get('/rec/pop/npurchases/:userId', async (req, res) => {
    const movies = await new PopularityRecommender().recommendBestSellers( Number(req.params.userId), 20)
    res.send(movies)
})

app.post('/user', async (req, res) => {
    const { name, email } = req.body

    try{
        const user = await prisma.user.create({
            data: {
                name,
                email
            },
        })
        res.json(user)
    }
    catch (err:any){
        res.json(err.toString())
    }


})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})