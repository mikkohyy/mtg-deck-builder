import { createContext, useReducer, useCallback } from 'react'
import openedDeckReducer from '../reducers/openedDeckReducer'

const OpenedDeckContext = createContext(undefined)

const OpenedDeckProvider = ({ children }) => {
  const [openedDeck, openedDeckDispatch] = useReducer(openedDeckReducer, undefined)

  const setOpenedDeck = useCallback((deck) => {
    openedDeckDispatch({
      type: 'SET_DECK',
      payload: deck
    })
  }, [openedDeckDispatch])

  const addCardToDeck = useCallback((card, nOfCards) => {
    openedDeckDispatch({
      type: 'ADD_CARD',
      payload: {
        card,
        nOfCards
      }
    })
  }, [openedDeckDispatch])

  const removeCardFromDeck = useCallback((card, nOfCards) => {
    openedDeckDispatch({
      type: 'REMOVE_CARD',
      payload: {
        card,
        nOfCards
      }
    })
  })

  return(
    <OpenedDeckContext.Provider
      value={{ openedDeck, setOpenedDeck, addCardToDeck, removeCardFromDeck }}
    >
      {children}
    </OpenedDeckContext.Provider>
  )
}

export { OpenedDeckContext, OpenedDeckProvider }