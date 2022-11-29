import {
  checkIfCardsHaveSameKeys,
  checkIfDataInCardsIsValid,
  isCardDataValid
} from '../../../utils/reading_new_card_set'
import { isEmptyString } from '../../../utils/validation_utils'

const invalidInputMessages = {
  invalidName: 'Name is not valid.',
  invalidDescription: 'Description is not valid.',
  noDefinitionOfCards: 'Select a file with cards data in it or define that no cards will be added.',
  invalidKeys: 'The keys of the cards with the following indexes do not match the keys of the first card:',
  allFieldsAreNotDefined: 'Define all correspondings fields in the data',
  invalidTypesOfData: 'The keys of the cards witth the following indexes have wrong type of data in them:'
}

const isPageInputValid = (pageNumber, cardSet) => {
  let invalidInputs = undefined

  if (pageNumber === 1) {
    invalidInputs = checkIfNameAndDescriptionInputsAreValid(cardSet)
  } else if (pageNumber === 2) {
    invalidInputs = checkIfCardsInputIsValid(cardSet)
  } else if (pageNumber === 3) {
    invalidInputs = checkIfCardFieldInputsAreValid(cardSet)
  }

  return invalidInputs
}

const checkIfNameAndDescriptionInputsAreValid = (cardSet) => {
  const { name, description } = cardSet
  const invalidInputs = []

  if (isEmptyString(name) === true) {
    invalidInputs.push(invalidInputMessages['invalidName'])
  }

  if (isEmptyString(description) === true) {
    invalidInputs.push(invalidInputMessages['invalidDescription'])
  }

  return invalidInputs
}

const checkIfCardsInputIsValid = (cardSet) => {
  const { cards } = cardSet
  let invalidInputs = []

  if (cards === undefined) {
    invalidInputs.push(invalidInputMessages['noDefinitionOfCards'])
  } else if (cards.length > 1) {
    invalidInputs = addInformationOnInvalidCardsIfAny(invalidInputs, cards)
  }

  return invalidInputs
}

const checkIfCardFieldInputsAreValid = (cardSet) => {
  const { fieldNames, cards } = cardSet
  let invalidInputs = []

  if (allCardFieldsAreDefined(fieldNames) === false) {
    invalidInputs.push(invalidInputMessages['allFieldsAreNotDefined'])
  } else {
    invalidInputs = addInformationOnCardsWithInvalidData(invalidInputs, fieldNames, cards)
  }

  return invalidInputs
}

const allCardFieldsAreDefined = (fieldNames) => {
  let hasDefined = true

  for (const fieldName of Object.values(fieldNames)) {
    if (isEmptyString(fieldName) === true) {
      hasDefined = false
      break
    }
  }

  return  hasDefined
}

const addInformationOnInvalidCardsIfAny = (invalidInputs, cards) => {
  const idsOfAbnormalCards = getCardsWithKeysThatDoNotMatchTheFirstCard(cards)

  if (idsOfAbnormalCards.length > 0) {
    const ids = getAsString(idsOfAbnormalCards)

    invalidInputs.push(invalidInputMessages['invalidKeys'])
    invalidInputs.push(ids)
  }

  return invalidInputs
}

const addInformationOnCardsWithInvalidData = (invalidInputs, fieldNames, cards) => {
  const idsOfAbnormalCards = getIdsOfCardsThatHaveInvalidTypeOfData(fieldNames, cards)

  if (idsOfAbnormalCards.length > 0) {
    const ids = getAsString(idsOfAbnormalCards)

    invalidInputs.push(invalidInputMessages['invalidTypesOfData'])
    invalidInputs.push(ids)
  }

  return invalidInputs
}

const getCardsWithKeysThatDoNotMatchTheFirstCard = (cards) => {
  const idsOfInvalidCards = []
  const keysOfFirstCard = Object.keys(cards[0])

  for (let i=1; i<cards.length; i++) {
    const cardKeys = Object.keys(cards[i])

    if (cardKeys.length !== keysOfFirstCard.length) {
      idsOfInvalidCards.push(i)
    } else if (haveSameKeys(cardKeys, keysOfFirstCard) === false) {
      idsOfInvalidCards.push(i)
    }
  }

  return idsOfInvalidCards
}

const haveSameKeys = (firstKeys, secondKeys) => {
  let sameKeys = true

  for (const key of firstKeys) {
    if (!secondKeys.includes(key)) {
      sameKeys = false
      break
    }
  }

  return sameKeys
}

const getIdsOfCardsThatHaveInvalidTypeOfData = (fieldNames, cards) => {
  const ids = []

  for (let i = 0; i < cards.length; i++) {
    if (isCardDataValid(fieldNames, cards[i]) === false) {
      ids.push(i)
    }
  }

  return ids
}

const getAsString = (idsOfAbnormalCards) => {
  let asString

  if (idsOfAbnormalCards.length > 1) {
    idsOfAbnormalCards.splice(idsOfAbnormalCards.length - 1, 0, 'and')
    const idsAsString = idsOfAbnormalCards.join(', ')
    asString = idsAsString.replace(', and,', ' and')
  } else {
    asString = idsOfAbnormalCards.toString()
  }

  return asString
}


const userCanMoveToNextPage = (pageNumber, cardSet) => {
  let userCanMove = true

  if (pageNumber === 1) {
    userCanMove = userHasDefinedNameAndDescription(cardSet)
  } else if (pageNumber === 2) {
    userCanMove = addedCardsAreValid()
  } else if (pageNumber === 3) {
    userCanMove = canMoveToSummaryPage()
  }

  return userCanMove
}

const userHasDefinedNameAndDescription = (cardSet) => {
  const { name, description } = cardSet

  let isSet = true

  if (isEmptyString(name) === true) {
    isSet = false
  } else if (isEmptyString(description) === true) {
    isSet = false
  }

  return isSet
}

const addedCardsAreValid = (cardSet) => {
  const { cards } = cardSet

  let cardsAreValid = true

  if (userHasDefinedCardsOrNoCards() === false) {
    cardsAreValid = false
  } else if (checkIfCardsHaveSameKeys(cards) === false) {
    cardsAreValid = false
  }

  return cardsAreValid
}


const userHasDefinedCardsOrNoCards = (cardSet) => {
  const { cards } = cardSet

  let hasDefined = true

  if (cards === undefined) {
    hasDefined = false
  }

  return hasDefined
}

const canMoveToSummaryPage = (cardSet) => {
  const { fieldNames, cards } = cardSet
  let canMove = true

  if (userHasDefinedAllCardKeys(fieldNames) === false) {
    canMove = false
  } else if (checkIfDataInCardsIsValid(fieldNames, cards) === false) {
    canMove = false
  }

  return canMove
}

const userHasDefinedAllCardKeys = (fieldNames) => {
  let hasDefined = true

  for (const fieldName of Object.values(fieldNames)) {
    if (isEmptyString(fieldName) === true) {
      hasDefined = false
      break
    }
  }

  return  hasDefined
}

export {
  userCanMoveToNextPage,
  isPageInputValid
}