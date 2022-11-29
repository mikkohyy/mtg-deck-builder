import { createContext, useState } from 'react'

const OpenedCardSetContext = createContext(undefined)

const OpenedCardSetProvider = ({ children }) => {
  const [openedCardSet, setOpenedCardSet] = useState(undefined)
  return(
    <OpenedCardSetContext.Provider value={{ openedCardSet, setOpenedCardSet }}>
      {children}
    </OpenedCardSetContext.Provider>
  )
}

export { OpenedCardSetProvider, OpenedCardSetContext }