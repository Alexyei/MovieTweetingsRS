import {useState} from "react";
import {ArrowDown, ArrowUp, ChevronsUpDown} from "lucide-react";
import {cn} from "@/lib/utils";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {MovieFullDataT, MovieOrderingT} from "@/types/movie.types";
const sorts = [
    {
        value: "title asc",
        label: "Title",
    },
    {
        value: "title desc",
        label: "Title",
    },
    // {
    //     value: "rating asc ",
    //     label: "Rating",
    // },
    // {
    //     value: "rating desc",
    //     label: "Rating",
    // },
    {
        value: "year asc",
        label: "Year",
    },
    {
        value: "year desc",
        label: "Year",
    },
]
const SortSelector = ({onChangeSort,value}:{value:typeof sorts[number]['value'],onChangeSort:(sort:MovieOrderingT)=>any})=>{


    const [open, setOpen] = useState(false)
    // const [value, setValue] = useState(initialValue || "desc rating")



    function getElementByValue(){
        if (!value) return "Сортировать по..."
        const item = sorts.find((sort) => sort.value === value)!

        if (item.value.endsWith("desc"))
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
        <Popover  open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id={"sort"}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
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
                        {sorts.map((sort) => (
                            <CommandItem
                                key={sort.value}
                                value={sort.value}
                                onSelect={(currentValue) => {
                                    setOpen(false)
                                    onChangeSort(currentValue as MovieOrderingT)
                                }}
                            >
                                {sort.value.endsWith("desc") ?
                                    <ArrowDown className={cn(
                                        "mr-2 h-4 w-4 ",

                                    )}/>
                                    :
                                    <ArrowUp className={cn(
                                        "mr-2 h-4 w-4",

                                    )}/>
                                }

                                {sort.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}


export default SortSelector