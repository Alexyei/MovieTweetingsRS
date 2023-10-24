import {useState} from "react";
import {ArrowDown, ArrowUp, ChevronsUpDown} from "lucide-react";
import {cn} from "@/lib/utils";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";

const SortSelector = ({onChangeSort,value}:{value:string,onChangeSort:(sort:string)=>any})=>{
    const sorts = [
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

    const [open, setOpen] = useState(false)
    // const [value, setValue] = useState(initialValue || "desc rating")



    function getElementByValue(){
        if (!value) return "Сортировать по..."
        const item = sorts.find((sort) => sort.value === value)!

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
                                    onChangeSort(currentValue)
                                }}
                            >
                                {sort.value.startsWith("desc") ?
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