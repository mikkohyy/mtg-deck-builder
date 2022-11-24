import { useState } from 'react'
import { checkIfCardsHaveSameKeys, checkIfDataInCardsIsValid } from '../utils/reading_new_card_set'
import { hasCharacters } from '../utils/general_utils'

const useAddCardSet = (pageNumber) => {
  const [cardSetName, setCardSetName] = useState('')
  const [cardSetDescription, setCardSetDescription] = useState('')
  const [cardSetCards, setCardSetCards] = useState(undefined)
  const [cardKeyNames, setCardKeyNames] = useState(undefined)
  const [fieldNames, setFieldNames] = useState({
    name: '',
    price: '',
    rarity: '',
    cardNumber: '',
    manaCost: '',
    rulesText: ''
  })

  const setFieldName = (name, value) => {
    const fieldNamesCopy = { ...fieldNames }
    fieldNamesCopy[name] = value

    setFieldNames(fieldNamesCopy)
  }

  const getFieldName = (name) => {
    return fieldNames[name]
  }

  const getFieldNamesAsArray = () => {
    let fieldNamesArray = []

    for (const [key, value] of Object.entries(fieldNames)) {
      fieldNamesArray.push(`${key}: ${value}`)
    }

    return fieldNamesArray
  }

  const addCardsToCardSet = (newCardSet) => {
    if (newCardSet.length > 0) {
      setCardSetCards(newCardSet)
      const cardKeys = Object.keys(newCardSet[0])
      setCardKeyNames(cardKeys)
    } else if (newCardSet.length === 0) {
      setCardSetCards([])
      setCardKeyNames([])
    }
  }

  const canMoveToNextPage = () => {
    let freeToMove = true

    if (pageNumber === 1) {
      freeToMove = userHasDefinedNameAndDescription()
    } else if (pageNumber === 2) {
      freeToMove = addedCardsAreValid()
    } else if (pageNumber === 3) {
      freeToMove = canMoveToSummaryPage()
    }

    return freeToMove
  }

  const userHasDefinedNameAndDescription = () => {
    let isSet = true

    if (hasCharacters(cardSetName) === false) {
      isSet = false
    } else if (hasCharacters(cardSetDescription) === false) {
      isSet = false
    }

    return isSet
  }

  const addedCardsAreValid = () => {
    let cardsAreValid = true

    if (userHasDefinedCardsOrNoCards() === false) {
      cardsAreValid = false
    } else if (checkIfCardsHaveSameKeys(cardSetCards) === false) {
      cardsAreValid = false
    }

    return cardsAreValid
  }

  const userHasDefinedCardsOrNoCards = () => {
    let hasDefined = true

    if (cardSetCards === undefined) {
      hasDefined = false
    }

    return hasDefined
  }

  const canMoveToSummaryPage = () => {
    let canMove = true

    if (userHasDefinedAllCardKeys() === false) {
      canMove = false
    } else if (checkIfDataInCardsIsValid(fieldNames, cardSetCards) === false) {
      canMove = false
    }

    return canMove
  }

  const userHasDefinedAllCardKeys = () => {
    let hasDefined = true

    for (const fieldName of Object.values(fieldNames)) {
      if (hasCharacters(fieldName) === false) {
        hasDefined = false
        break
      }
    }

    return  hasDefined
  }

  const getCardSetObject = () => {
    const cards = getCardsCombinedWithExpectedKeyNames()

    const cardSetObject = {
      name: cardSetName,
      description: cardSetDescription,
      cards: cards
    }

    return cardSetObject
  }

  const getCardsCombinedWithExpectedKeyNames = () => {
    const cards = []

    for (const card of cardSetCards) {
      const createdCard = getCardDataCombinedWithExpectedKeyNames(card)
      cards.push({ ...createdCard })
    }

    return cards
  }

  const getCardDataCombinedWithExpectedKeyNames = (card) => {
    let createdCard = {}

    for (const [key, keyInData] of Object.entries(fieldNames)) {
      createdCard[key] = card[keyInData]
    }

    return createdCard
  }

  return {
    cardSetName,
    setCardSetName,
    cardSetDescription,
    setCardSetDescription,
    cardSetCards,
    setCardSetCards,
    addCardsToCardSet,
    cardKeyNames,
    canMoveToNextPage,
    getFieldName,
    setFieldName,
    fieldNames,
    getFieldNamesAsArray,
    getCardSetObject
  }
}

export default useAddCardSet