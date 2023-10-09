let i = undefined as any
beforeAll(async () => {
    console.log("beforeAll")
    i = 0
})

afterAll(async () => {
    console.log("afterAll")
    i = null
})

test("q1",async ()=>{
    console.log(1,i++)
})

test("z2",async ()=>{
    console.log(2,i++)
})

test("zz3",async ()=>{
    console.log(3,i++)
})