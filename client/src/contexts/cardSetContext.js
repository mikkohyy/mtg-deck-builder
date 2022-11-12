import { createContext, useState } from 'react'

const CardSetContext = createContext(undefined)

const CardSetProvider = ({ children }) => {
  const [openedCardSet, setOpenedCardSet] = useState(undefined)
  return(
    <CardSetContext.Provider value={{ openedCardSet, setOpenedCardSet }}>
      {children}
    </CardSetContext.Provider>
  )
}

export { CardSetProvider, CardSetContext }