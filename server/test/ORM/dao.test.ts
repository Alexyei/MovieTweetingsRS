import {getDAO} from "../../src/DAO/DAO";

test("singleton test", async () => {
    const testDao1 = getDAO(true)
    const testDao2 = getDAO(true)
    const dao1 = getDAO(false)
    const dao2 = getDAO(false)
    console.log(await testDao1.movieSimilarity.count())
    console.log(await testDao2.movieSimilarity.count())
    console.log(await dao1.movieSimilarity.count())
    console.log(await dao2.movieSimilarity.count())
})