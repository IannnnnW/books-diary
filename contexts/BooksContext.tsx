import { createContext, useContext, ReactNode, useState } from "react";

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

    return (
        <MyBooksContext.Provider value={{isSaved, toggleIsSaved, savedBooks}}>
            {children}
        </MyBooksContext.Provider>
    )
}

export function useBooksContext() :any {
    return useContext(MyBooksContext)
}