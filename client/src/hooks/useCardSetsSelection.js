import { useState, useReducer } from 'react'


const useCardSetsSelection = () => {
  const cardSetListReducer = (state, action) => {
    switch (action.type) {
    case 'SET_CARD_SET_LIST':
      return action.payload
    case 'ADD_CARD_SET': {
      console.log(action)
      const newCardSet = action.payload
      return ([
        ...state,
        newCardSet
      ])
    }
    case 'DELETE_CARD_SET': {
      const deletedCardSetId = action.payload.id
      const filteredCardSets = state.filter((cardSet) => cardSet.id !== deletedCardSetId)
      return [...filteredCardSets]
    }
    default:
      return state
    }
  }

  const [ cardSetIsOpen, setCardSetIsOpen ] = useState(false)
  const [ cardSetsList, dispatchCardSetsList ] = useReducer(cardSetListReducer, [])

  const clickOpenCardSets = async () => {
    toggleOpenCardSetActivity()
  }

  const toggleOpenCardSetActivity = () => {
    setCardSetIsOpen(!cardSetIsOpen)
  }

  return {
    setCardSetIsOpen,
    cardSetIsOpen,
    cardSetsList,
    clickOpenCardSets,
    toggleOpenCardSetActivity,
    dispatchCardSetsList
  }
}

export default useCardSetsSelection