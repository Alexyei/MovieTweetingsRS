import fs from "fs";

export function writeJson(filename: string,data:any){
    const jsonData = JSON.stringify(data);
    fs.writeFileSync(filename, jsonData, 'utf8')
}

export function readJson(filename: string){
    return JSON.parse(fs.readFileSync(filename, 'utf8'))
}