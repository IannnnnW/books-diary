import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
    children :ReactNode
}

type BooksContextType = {
    isSaved :(book :Book) => boolean
    toggleIsSaved :(book :Book) => void
    savedBooks :Book[]
}

const MyBooksContext = createContext<BooksContextType>({
    isSaved : () => false,
    toggleIsSaved : () => {},
    savedBooks : []
})

export default function BooksContext({children} :Props){
    const [savedBooks, setSavedBooks] = useState<Book[]>([])
    useEffect(()=>{
        loadData()
    }, [])
    useEffect(()=>{
        persistData()
    }, [savedBooks])

    function isSaved(book :Book) :boolean {
        return savedBooks.some((savedBook => JSON.stringify(savedBook) === JSON.stringify(book)))
    }

    function toggleIsSaved(book :Book) :void {
        if(isSaved(book)){
            // remove book
            setSavedBooks(savedBooks.filter(savedBook => JSON.stringify(savedBook) !== JSON.stringify(book)))
        } else{
            // add book 
            setSavedBooks([...savedBooks, book])
        }
    }
    async function persistData() :Promise<void>{
        await AsyncStorage.setItem("savedBooks", JSON.stringify(savedBooks))
    }
    async function loadData() :Promise<void>{
        const dataItems = await AsyncStorage.getItem("savedBooks")
        if(dataItems){
            setSavedBooks(JSON.parse(dataItems))
        }
    }
    return (
        <MyBooksContext.Provider value={{isSaved, toggleIsSaved, savedBooks}}>
            {children}
        </MyBooksContext.Provider>
    )
}

export function useBooksContext() :any {
    return useContext(MyBooksContext)
}