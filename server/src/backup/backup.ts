import {deleteAllMoviesSimilarity, getAllMoviesSimilarity, saveMoviesSimilarity} from "../DAO/movie_similarity";
import {deleteAllUsersSimilarity, getAllUsersSimilarity, saveUsersSimilarity} from "../DAO/user_similarity";
import path from "path";
import fs from "fs";
import {readJson, writeJson} from "../utils/json";

export async function backupMoviesSimilarity(){
    const sims =  await getAllMoviesSimilarity()
    const filename = path.join(__dirname,'./output/movies_similarity.json')
    writeJson(filename,sims)
    console.log(`success saved in ${filename}`)
}

export async function backupUsersSimilarity(){
    const sims =  await getAllUsersSimilarity()
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
    await deleteAllMoviesSimilarity()
    await saveMoviesSimilarity(sims)
    console.log(`success load from ${filename}`)
}

export async function loadUsersSimilarity(){
    const filename = path.join(__dirname,'./output/users_similarity.json')
    if (!fs.existsSync(filename)) {
        console.log(`not found ${filename}`)
        return;
    }
    const sims = readJson(filename)
    await deleteAllUsersSimilarity()
    await saveUsersSimilarity(sims)
    console.log(`success load from ${filename}`)
}



