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
  }, [openedDeckDispatch])

  const setDeckName = useCallback((name) => {
    openedDeckDispatch({
      type: 'SET_NAME',
      payload: {
        name
      }
    })
  }, [openedDeckDispatch])

  const setDeckNotes = useCallback((notes) => {
    openedDeckDispatch({
      type: 'SET_NOTES',
      payload: {
        notes
      }
    })
  }, [openedDeckDispatch])

  const setDeckId = useCallback((id) => {
    openedDeckDispatch({
      type: 'SET_DECK_ID',
      payload: {
        id
      }
    })
  }, [openedDeckDispatch])

  const setOwnerId = useCallback((userId) => {
    openedDeckDispatch({
      type: 'SET_OWNER_ID',
      payload: {
        userId
      }
    })
  }, [openedDeckDispatch])

  const getDeckForSavingAsNew = (userId, name, notes) => {
    const deckForSaving = {
      userId: userId,
      name: name,
      notes: notes.trim(),
      cards: {
        added: openedDeck.cards,
        updated: [],
        deleted: []
      }
    }

    return deckForSaving
  }

  return(
    <OpenedDeckContext.Provider
      value={{
        openedDeck,
        setOpenedDeck,
        addCardToDeck,
        removeCardFromDeck,
        setDeckName,
        setDeckNotes,
        setDeckId,
        setOwnerId,
        getDeckForSavingAsNew
      }}
    >
      {children}
    </OpenedDeckContext.Provider>
  )
}

export { OpenedDeckContext, OpenedDeckProvider }