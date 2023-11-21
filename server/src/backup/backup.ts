import path from "path";
import fs from "fs";
import {readJson, writeJson} from "../utils/json";
import {getDAO} from "../DAO/DAO";
import { RatingType } from "@prisma/client";

const dao = getDAO(false)
export async function backupMoviesSimilarity(){
    const sims =  await dao.movieSimilarity.all()
    const filename = path.join(__dirname,'./output/movies_similarity.json')
    writeJson(filename,sims)
    console.log(`success saved in ${filename}`)
}

export async function backupUsersSimilarity(){
    const sims =  await dao.userSimilarity.all()
    const filename = path.join(__dirname,'./output/users_similarity.json')
    writeJson(filename,sims)
    console.log(`success saved in ${filename}`)
}

export async function loadMoviesSimilarity(){
    const filename = path.join(__dirname,'./output/movies_similarity.json')
    if (!fs.existsSync(filename)) {
        console.log(`not found ${filename}`)
        return;
    }
    const sims = readJson(filename)
    await dao.movieSimilarity.deleteAll()
    await dao.movieSimilarity.saveMany(sims,false)
    console.log(`success load from ${filename}`)
}

export async function loadUsersSimilarity(){
    const filename = path.join(__dirname,'./output/users_similarity.json')
    if (!fs.existsSync(filename)) {
        console.log(`not found ${filename}`)
        return;
    }
    const sims = readJson(filename)
    await dao.userSimilarity.deleteAll()
    await dao.userSimilarity.saveMany(sims,false)
    console.log(`success load from ${filename}`)
}

export async function loadImplicitRatings(){
    const filename = path.join(__dirname,'./output/implicit_ratings.json')
    if (!fs.existsSync(filename)) {
        console.log(`not found ${filename}`)
        return;
    }
    const ratings = readJson(filename)
    await dao.rating.deleteByType()
    await dao.rating.saveMany(ratings.map((r:any)=>({type:RatingType.IMPLICIT,authorId:Number(r.user_id),movieId:r.movie_id,rating:r.rating})))
}


export async function backupUserEvents(){
    const events =  await dao.userEvent.all()
    const filename = path.join(__dirname,'./output/user_events.json')
    writeJson(filename,events)
    console.log(`success saved in ${filename}`)
}

export async function loadUserEvents(){
    const filename = path.join(__dirname,'./output/user_events.json')
    if (!fs.existsSync(filename)) {
        console.log(`not found ${filename}`)
        return;
    }
    const events = readJson(filename)
    await dao.userEvent.deleteAll()
    await dao.userEvent.saveMany(events,false)
    console.log(`success load from ${filename}`)
}

export async function loadExampleUserEvents(){
    const filename = path.join(__dirname,'./output/user_events_example.json')
    if (!fs.existsSync(filename)) {
        console.log(`not found ${filename}`)
        return;
    }
    const events = readJson(filename)
    await dao.userEvent.deleteAll()
    await dao.userEvent.saveMany(events.map((e:any)=>({userId:Number(e.user_id),movieId:e.content_id,genreId:null,event:'BUY',sessionId:e.session_id})),false)
    console.log(`success load from ${filename}`)
}