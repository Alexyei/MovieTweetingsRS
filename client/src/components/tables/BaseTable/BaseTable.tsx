"use client"

import {
    ColumnDef, ColumnFiltersState,
    flexRender,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import React, {ReactNode, useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    header:string,
    filterPlaceholder:string
    columnVisibility?: {[index: string]: boolean},
    input?:ReactNode
}

export function BaseTable<TData, TValue>({
                                             columns,
                                             data,
                                            header,
    filterPlaceholder,
    columnVisibility={},input,
                                         }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    // const [filtering, setFiltering] = React.useState("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        // onGlobalFilterChange: setFiltering,
        state: {
            columnFilters,
            sorting
        },
        initialState: {
            pagination: {
                pageSize: 5,
            },
            columnVisibility: {
                'filterField': false,
                ...columnVisibility
            }
        },
    })



    return (
        <Card className={"overflow-x-auto flex flex-col"}>
            <CardHeader>
                <CardTitle className={"px-1"}>{header}</CardTitle>
            </CardHeader>
            <CardContent className={"flex-grow flex flex-col px-2"}>
                <div className={"w-full  px-1  flex-grow flex flex-col"}>
                    <div className="flex items-center py-4 ">
                        {input ? input :
                        <Input
                            placeholder={filterPlaceholder}
                            value={(table.getColumn("filterField")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("filterField")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm "
                        />}
                    </div>
                    <div className="rounded-md border flex-grow">
                        <Table >
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead  key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell className={"p-1"} key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            Ничего не найдено
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                            {table.getFilteredRowModel().rows.length} строк
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}