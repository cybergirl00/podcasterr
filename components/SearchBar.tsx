'use client'
import Image from "next/image"
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useDebounce } from "@/lib/useDebounce"

const SearchBar = () => {
    const [search, setSearch] = useState('')
    const router = useRouter();
    const pathname = usePathname();

    const debounce = useDebounce(search, 500)

    useEffect(() => {

        if(debounce) {
            router.push(`/discover?search=${debounce}`)
        } else if(!debounce && pathname === '/discover') {
            router.push('/discover')
        }
    }, [router, pathname, debounce])
    
  return (
    <div className='relative mt-8 block'>
        <Input placeholder='Search...'
        className="input-class py-6 pl-12 focus-visible:ring-offset-orange-1"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onLoad={() => setSearch('')}
         />
        <Image
        src='/icons/search.svg'
        alt="search"
        width={20}
        height={20}
        className="absolute left-4 top-3.5"
         />
    </div>
  )
}

export default SearchBar