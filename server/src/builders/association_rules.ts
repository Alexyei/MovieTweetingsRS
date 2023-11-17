import { getDAO } from "../DAO/DAO";


type TransactionT = {sessionId: string;movieIds: string[]}

type OneItemSetT = {movieId: string;count: number;}[]

const dao = getDAO(false)

async function flushDB(){

}

async function getBuyEvents(){
    return dao.userEvent.getBuyEvents()
}

async function getTransactions(data:{movieId:string | null,sessionId: string | null}[]){
    const transactions = {} as {[key:string]:string[]}

    for (const event of data){
        if (transactions[event.sessionId!] == null) transactions[event.sessionId!] = []
        
        transactions[event.sessionId!].push(event.movieId!)
    }

    return Object.keys(transactions).map((key)=>({sessionId:key,movieIds:transactions[key]}))
}

function calculateSupport(elementCount:number,all:number){
    return elementCount/all
}

function getOneItemSet(transactions: TransactionT[]){
    const oneItemSet = {} as {[key:string]:number}

    for (const transaction of transactions){
        for (const movieId of transaction.movieIds){
            if (oneItemSet[movieId] != null){
                oneItemSet[movieId]++
            }
            else{
                oneItemSet[movieId] = 1
            }
        }
    }

    return Object.keys(oneItemSet).map(key=>({movieId:key,count:oneItemSet[key]}))
}

function getTwoItemSet(transactions: TransactionT[], oneItemSet: OneItemSetT){

}

export async function build(min_support:number = 0.01,min_confidence:number=0){
    const events = await getBuyEvents()
    const transactions = await getTransactions(events)

    const n = transactions.length
    // отсеиваиваем редкие элементы
    const oneItemSet = getOneItemSet(transactions).filter(set=>calculateSupport(set.count,n) > min_support)
}