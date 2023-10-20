'use client'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowDown, ArrowUp, Check, ChevronsUpDown, Plus, SlidersHorizontal} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {PopoverTrigger,Popover,PopoverContent} from "@/components/ui/popover";
import {Label} from "@/components/ui/label";

const MovieSearchPanel = ({title}:{title:string}) =>{
    const sorted = [
        {
            value: "asc title",
            label: "Title",
        },
        {
            value: "desc title",
            label: "Title",
        },
        {
            value: "asc rating",
            label: "Rating",
        },
        {
            value: "desc rating",
            label: "Rating",
        },
        {
            value: "asc year",
            label: "Year",
        },
        {
            value: "desc year",
            label: "Year",
        },
    ]

    const [openSorted, setOpenSorted] = useState(false)
    const [valueSorted, setValueSorted] = useState("desc rating")

    const frameworks = [
        {
            value: "all",
            label: "All",
        },
        {
            value: "sveltekit",
            label: "SvelteKit",
        },
        {
            value: "nuxt.js",
            label: "Nuxt.js",
        },
        {
            value: "remix",
            label: "Remix",
        },
        {
            value: "astro",
            label: "Astro",
        },
    ]

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(frameworks[0].value)

    function getElementByValue(){
        if (!valueSorted) return "Сортировать по..."
        const item = sorted.find((sort) => sort.value === valueSorted)!

        if (item.value.startsWith("desc"))
        return (
            <>
                <ArrowDown className={cn(
                    "mr-2 h-4 w-4 ",

                )}/>
                {item.label}
            </>
            )
        return (
            <>
                <ArrowUp className={cn(
                    "mr-2 h-4 w-4 ",

                )}/>
                {item.label}
            </>
        )





    }

    return (
        <Card >
            <CardHeader>
                <CardTitle>
                    {/*Поиск по каталогу*/}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="w-full">
                    <div className="flex items-center py-4 justify-between">
                        <Input
                            placeholder="Найдётся всё..."
                            // value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                            // onChange={(event) =>
                            //     table.getColumn("email")?.setFilterValue(event.target.value)
                            // }
                            className="w-full mr-2"
                        />
                        <div className={"flex space-x-2"}>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-[120px] justify-between"
                                    >
                                        {value
                                            ?
                                            frameworks.find((framework) => framework.value === value)?.label
                                            : "Выберите жанры..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput placeholder="Выберите жанры..." />
                                        <CommandEmpty>Ничего не найдено</CommandEmpty>
                                        <CommandGroup>
                                            {frameworks.map((framework) => (
                                                <CommandItem
                                                    key={framework.value}

                                                    onSelect={(currentValue) => {
                                                        setValue(currentValue === value ? "" : currentValue)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            value === framework.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {framework.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger asChild>
                            <Button variant="outline" size="icon">
                                <SlidersHorizontal className="h-4 w-4"/>
                            </Button>
                                </PopoverTrigger>
                                <PopoverContent className="m-w-auto">
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium leading-none">Параметры</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Настроите дополнительыне параметры поиска
                                            </p>
                                        </div>
                                        <div className="grid gap-2">
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="from">Год от:</Label>
                                                <Input
                                                    id="from"
                                                    type="number"
                                                    defaultValue="1890"
                                                    className="col-span-2 h-8"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="to">Год до:</Label>
                                                <Input
                                                    id="to"
                                                    defaultValue="2020"
                                                    className="col-span-2 h-8"
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="sort">Сортировка</Label>
                                                <Popover  open={openSorted} onOpenChange={setOpenSorted}>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            id={"sort"}
                                                            variant="outline"
                                                            role="combobox"
                                                            aria-expanded={openSorted}
                                                            className="w-[150px] justify-between"
                                                        >
                                                            {getElementByValue()}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-full p-0">
                                                        <Command>
                                                            <CommandInput placeholder="Сортировать по..." />
                                                            <CommandEmpty>Ничего не найдено</CommandEmpty>
                                                            <CommandGroup>
                                                                {sorted.map((sorted) => (
                                                                    <CommandItem
                                                                        key={sorted.value}
                                                                        value={sorted.value}
                                                                        onSelect={(currentValue) => {
                                                                            console.log(currentValue, valueSorted)
                                                                            setValueSorted(currentValue)
                                                                            setOpenSorted(false)
                                                                        }}
                                                                    >
                                                                        {sorted.value.startsWith("desc") ?
                                                                            <ArrowDown className={cn(
                                                                                "mr-2 h-4 w-4 ",

                                                                            )}/>
                                                                            :
                                                                            <ArrowUp className={cn(
                                                                                "mr-2 h-4 w-4",

                                                                            )}/>
                                                                        }

                                                                        {sorted.label}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                    </div>

                </div>
                <ScrollArea className="h-96 w-full rounded-md border">
                    <div className={"min-h-screen bg-yellow-300"}></div>
                </ScrollArea>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground">
                        Показано 100 элементов из 10000.
                    </div>

                        <Button
                            variant="outline"
                            size="sm"
                            // onClick={() => table.previousPage()}
                            // disabled={!table.getCanPreviousPage()}
                        >
                            <Plus className="mr-2 h-4 w-4 " />
                            Показать ещё
                        </Button>

                </div>
            </CardContent>
        </Card>
    )
}

export default MovieSearchPanel