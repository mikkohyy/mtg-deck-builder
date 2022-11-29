import { useReducer } from 'react'
import createCardSetReducer from '../reducers/createCardSetReducer'

const useCreateCardSet = () => {
  const initialState = {
    name: '',
    description: '',
    cards: undefined,
    keyNames: undefined,
    fieldNames: {
      name: '',
      price: '',
      rarity: '',
      cardNumber: '',
      manaCost: '',
      rulesText: ''
    }
  }

  const [newCardSetState, newCardSetDispatch] = useReducer(createCardSetReducer, initialState)


  const getFieldNamesAsArray = () => {
    let fieldNamesArray = []

    for (const [key, value] of Object.entries(newCardSetState.fieldNames)) {
      fieldNamesArray.push(`${key}: ${value}`)
    }

    return fieldNamesArray
  }

  const getCardSetObject = () => {
    const cards = newCardSetState.cards.length > 0
      ? getCardsCombinedWithExpectedKeyNames()
      : []

    const cardSetObject = {
      name: newCardSetState.name,
      description: newCardSetState.description,
      cards: cards
    }

    return cardSetObject
  }

  const getCardsCombinedWithExpectedKeyNames = () => {
    const cards = []

    for (const card of newCardSetState.cards) {
      const createdCard = getCardDataCombinedWithExpectedKeyNames(card)
      cards.push({ ...createdCard })
    }

    return cards
  }

  const getCardDataCombinedWithExpectedKeyNames = (card) => {
    let createdCard = {}

    for (const [key, keyInData] of Object.entries(newCardSetState.fieldNames)) {
      createdCard[key] = card[keyInData]
    }

    return createdCard
  }

  return {
    getFieldNamesAsArray,
    getCardSetObject,
    newCardSetState,
    newCardSetDispatch
  }
}

export default useCreateCardSet