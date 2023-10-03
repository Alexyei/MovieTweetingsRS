import {RatingType as PrismaRatingType} from "@prisma/client";
import fs from "fs";
import csv from "csv-parser";
import {RatingWithTypeT} from "../types/rating.types";


export async function readML100K(filename: string) {
    const ratingsData: (RatingWithTypeT)[] = [];

    await readCSV(filename, row => {
        const {userId, movieId, rating} = row;
        ratingsData.push({
            authorId: parseInt(userId),
            movieId,
            rating: parseFloat(rating),
            type: PrismaRatingType.EXPLICIT
        });
    })

    return ratingsData
}

export async function readCSV(filename: string, onReadRow: (row: any) => void) {
    return new Promise<void>((resolve, reject) => {

        fs.createReadStream(filename, 'utf-8')
            .pipe(csv({strict: true}))
            .on('data', (row: any) => {
                onReadRow(row)
            })
            .on('end', async () => {
                resolve()
            }).on("error", (error: any) => {
            reject(error);
        });
    });
}