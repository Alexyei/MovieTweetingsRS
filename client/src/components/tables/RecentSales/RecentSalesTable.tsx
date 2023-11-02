import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
    // Fetch data from your API here.
    return [
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
            tags: [{id:1,"name":"Comedy"},{id:2,"name":"Action"}],
            filterField: "Comedy Action"
        },
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
            tags: [{id:1,"name":"Comedy"},{id:2,"name":"Action"}],
            filterField: "Comedy Action"
        },
        {
            id: "489e1d42",
            amount: 125,
            status: "processing",
            email: "example@gmail.com",
            tags: [{id:1,"name":"Comedy"},{id:2,"name":"Action"}],
            filterField: "Comedy Action"
        },
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
            tags: [{id:1,"name":"Comedy"},{id:2,"name":"Action"}],
            filterField: "Comedy Action"
        },
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
            tags: [{id:1,"name":"Comedy"},{id:2,"name":"Action"}],
            filterField: "Comedy Action"
        },
        {
            id: "489e1d42",
            amount: 125,
            status: "processing",
            email: "example@gmail.com",
            tags: [{id:3,"name":"Drama"},{id:2,"name":"Action"}],
            filterField: "Comedy Action"
        },
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m1000@example.com",
            tags: [{id:1,"name":"Comedy"},{id:3,"name":"Drama"}],
            filterField: "Drama Action"
        },
        {
            id: "728ed52f",
            amount: 100,
            status: "pending",
            email: "m@example.com",
            tags: [{id:1,"name":"Comedy"},{id:2,"name":"Action"}],
            filterField: "Comedy Action"
        },
        {
            id: "489e1d42",
            amount: 125,
            status: "processing",
            email: "example@gmail.com",
            tags: [{id:1,"name":"Comedy"},{id:2,"name":"Action"}],
            filterField: "Comedy Action"
        },
        // ...
    ]
}

export default async function RecentSalesTable() {
    const data = await getData()

    return (
        // <div className="container mx-auto py-10">
            <DataTable columns={columns} data={[]} />
        // </div>
    )
}