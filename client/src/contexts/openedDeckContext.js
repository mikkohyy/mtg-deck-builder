import { createContext } from 'react'

const OpenedDeckContext = createContext(undefined)

const OpenedDeckProvider = ({ children }) => {
  return(
    <OpenedDeckContext.Provider>
      {children}
    </OpenedDeckContext.Provider>
  )
}

export { OpenedDeckContext, OpenedDeckProvider }