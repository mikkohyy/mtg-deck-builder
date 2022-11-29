import { createContext, useReducer } from 'react'
import cardSetsReducer from '../reducers/cardSetsReducer'

const CardSetsContext = createContext(undefined)

const CardSetsProvider = ({ children }) => {
  const [cardSetsState, cardSetsDispatch] = useReducer(cardSetsReducer, [])

  return(
    <CardSetsContext.Provider value={{ cardSetsState, cardSetsDispatch }}>
      {children}
    </CardSetsContext.Provider>
  )
}

export { CardSetsContext, CardSetsProvider }