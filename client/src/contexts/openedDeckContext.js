import { createContext, useReducer, useCallback } from 'react'
import openedDeckReducer from '../reducers/openedDeckReducer'

const OpenedDeckContext = createContext(undefined)

const OpenedDeckProvider = ({ children }) => {
  const [openedDeck, openedDeckDispatch] = useReducer(openedDeckReducer, undefined)

  const addCardToDeck = useCallback((card, nOfCards) => {
    openedDeckDispatch({
      type: 'ADD_CARD',
      payload: {
        card,
        nOfCards
      }
    })
  }, [openedDeckDispatch])

  const setOpenedDeck = useCallback((deck) => {
    openedDeckDispatch({
      type: 'SET_DECK',
      payload: deck
    })
  }, [openedDeckDispatch])

  return(
    <OpenedDeckContext.Provider value={{ openedDeck, setOpenedDeck, addCardToDeck }}>
      {children}
    </OpenedDeckContext.Provider>
  )
}

export { OpenedDeckContext, OpenedDeckProvider }