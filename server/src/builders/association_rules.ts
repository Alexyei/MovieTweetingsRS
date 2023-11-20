import { getDAO } from "../DAO/DAO";
import { combinations } from "../utils/array";


type TransactionT = {sessionId: string;movieIds: string[]}

type OneItemSetT = {movieId: string;count: number;}[]

type OneItemSetWithSupportT = (OneItemSetT[0] & {support:number})[]

type GroupItemSetT = {movieIDs: string[];count: number;}[]

type GroupItemSetWithSupportT = (GroupItemSetT[0] & {support:number})[]

const dao = getDAO(false)

async function flushDB(){

}

export async function saveRules(rules: any[]) {
    
    console.log(rules)
    console.log(rules.length)
    // return prisma.rating.createMany(
    //     {
    //         data: ratings
    //     })
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

function calculateConfidence(elementCount:number, groupCount:number){
    return groupCount/elementCount
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
    const twoItemSet = []as {movieIDs:string[],count:number}[]

    for (const transaction of transactions){
        //удаляем дубликаты, хотя у нас их не может быть, потму что фильм можно купить только 1 раз
        const ids =  Array.from(new Set(transaction.movieIds))

        //првоеряем, что оба элемента пары присутствуют в множестве из одного элемента, то есть имеют необходимую поддержку
        const combs = combinations(ids,2).filter(comb=>comb.every(c=>oneItemSet.find(m=>m.movieId == c)))

        for (const comb of combs){
            const element = twoItemSet.find(s=>comb.every(c=>s.movieIDs.includes(c)))
            if (element != null){
                element.count += 1
            }
            else{
                twoItemSet.push({movieIDs: comb, count:1})
            }
        }
    }

    return twoItemSet
}

function calculateAssociationRules(groupItemSet:GroupItemSetWithSupportT,oneItemSet:OneItemSetT){
    const rules = [] as {source:string,target:string,confidence:number,support:number}[]

    for (const  item of groupItemSet){
        for (let i =0;i<item.movieIDs.length;i++){
            for (let j =0;j<item.movieIDs.length;j++){
                if (i==j) continue;

                const source = item.movieIDs[i]
                const target = item.movieIDs[j]
                const support = item.support
                const confidence = calculateConfidence(item.count,oneItemSet.find(s=>s.movieId == source)!.count)

                rules.push({source,target,support,confidence})
            }
        }
    }

    return rules
}


//            def calculate_association_rules(one_itemsets, two_itemsets, N):
//     timestamp = datetime.now()

//     rules = []
//     for source, source_freq in one_itemsets.items():
//         for key, group_freq in two_itemsets.items():
//             if source.issubset(key):
//                 target = key.difference(source)
//                 support = group_freq / N
//                 confidence = group_freq / source_freq
//                 rules.append((timestamp, next(iter(source)), next(iter(target)),
//                               confidence, support))
//     return rules
async function build(min_support:number,min_confidence:number){
    const events = await getBuyEvents()
    const transactions = await getTransactions(events)

    const n = transactions.length
    // отсеиваиваем редкие элементы
    const oneItemSet = getOneItemSet(transactions)
    const oneItemSetWithSupport = oneItemSet.map(s=>({...s,support:calculateSupport(s.count,n)})).filter(s=>s.support > min_support)

    const twoItemSet = getTwoItemSet(transactions,oneItemSetWithSupport)
    const twoItemSetWithSupport = twoItemSet.map(s=>({...s,support:calculateSupport(s.count,n)}))

    return calculateAssociationRules(twoItemSetWithSupport,oneItemSet).filter(r=>r.confidence >= min_confidence)
}



export  function buildAssociationRules(min_support:number = 0.01,min_confidence:number=0){
    flushDB().then(()=>build(min_support,min_confidence)).then(saveRules)
}