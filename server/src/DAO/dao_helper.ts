import {PrismaClient} from "@prisma/client";

export class DAOMixinHelper{
    _testDb:boolean
    _client: PrismaClient;
    constructor(client:PrismaClient,testDb:boolean) {
        this._testDb = testDb
        this._client = client
    }
}