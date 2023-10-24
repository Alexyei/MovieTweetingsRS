import {useDeferredValue, useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";

const Search = ({onInputChanged}:{onInputChanged:(input:string)=>any})=>{
    const isMounted = useRef(false)
    const [searchInput, setSearchInput] = useState("")
    const deferredInput = useDeferredValue(searchInput)

    useEffect(()=>{
        if (isMounted.current){
            onInputChanged(deferredInput)
        }
        else {
            isMounted.current = true
        }
    },[deferredInput])


    return (
        <Input
            placeholder="Найдётся всё..."
            value={searchInput}
            onChange={(e)=>setSearchInput(e.target.value)}
            className="w-full"
        />
    )
}

export default Search;