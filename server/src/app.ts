import express from "express";
import path from "path";
import { PrismaClient } from '@prisma/client'
import bodyParser from "body-parser";
import {createBasicLogger} from "./logger/basic_logger";


const prisma = new PrismaClient()
const logger = createBasicLogger("seeder")
const app = express()
const port = 3000


app.use(bodyParser.json())

app.use('/static', express.static(path.join(__dirname, 'src/public')));

app.get('/', (req, res) => {
    res.send('Hello World!')
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
        logger.log('info',user)
        res.json(user)
    }
    catch (err:any){
        logger.log('error',err.toString())
        res.json(err.toString())
    }


})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})