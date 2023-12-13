'use client'
import {useDeferredValue, useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";

const Search = ({onInputChanged,placeholder="",className=""}:{onInputChanged:(input:string)=>any,className?:string,placeholder?:string})=>{
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
            placeholder={placeholder ? placeholder:"Найдётся всё..."}
            value={searchInput}
            maxLength={100}
            onChange={(e)=>setSearchInput(e.target.value)}
            className={"w-full"+className}
        />
    )
}

export default Search;