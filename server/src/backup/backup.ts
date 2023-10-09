import path from "path";
import fs from "fs";
import {readJson, writeJson} from "../utils/json";
import {getDAO} from "../DAO/DAO";

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



