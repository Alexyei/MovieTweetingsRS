import {useEffect, useRef, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Check, ChevronsUpDown} from "lucide-react";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";
import {GenreT} from "@/types/genre.types";
import {ScrollArea} from "@/components/ui/scroll-area";

const GenreSelector = ({genres,onGenresChanged}:{genres:GenreT[],onGenresChanged:(genreIds:number[])=>any})=>{
    const isMounted = useRef(false)
    const [open, setOpen] = useState(false)
    const [values, setValues] = useState<number[]>([])


    function onSelectHandler(value:string){
        const cur = Number(value)
        setValues(prev=>{
            if (prev.includes(cur)){
                return prev.filter(el=>el!=cur)
            }
            else {
                return [...prev,cur]
            }
        })

            // setOpen(false)
    }

    useEffect(()=>{
        if (isMounted.current){
            onGenresChanged(values)
        }
        else {
            isMounted.current = true
        }
    },[values])


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className=" justify-between"
                >
                    {values.length
                        ?
                        `${values.length}`
                        : "Все"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Найти жанр..." />
                    <CommandEmpty>Ничего не найдено</CommandEmpty>
                    <CommandGroup>
                        <ScrollArea className="h-48 ">
                        {genres.map((genre) => (
                            <CommandItem
                                key={genre.id}
                                value={genre.id.toString()}
                                onSelect={onSelectHandler}
                                
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        values.includes(genre.id) ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <div className={"flex items-center justify-between w-full mr-1"}>
                                    <p>{genre.name}</p>
                                    <Badge variant="destructive">{genre.moviesCount}</Badge>
                                </div>
                            </CommandItem>
                        ))}
                        </ScrollArea>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default GenreSelector