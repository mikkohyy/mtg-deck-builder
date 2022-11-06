const {
  cardObjectPropertyChecks,
  deckObjectPropertyChecks,
  userObjectPropertyChecks,
  cardSetObjectPropertyChecks
} = require('./object_property_validation_lists')

const {
  cardObjectPropertyNames,
  deckObjectPropertyNames,
  userObjectPropertyNames,
  cardSetObjectPropertyNames
} = require('./object_property_name_lists')

class ObjectValidator {
  static #cardsObjectCheckFunctions = {
    deck: (cards, cardStatus) => this.#getInvalidCardsObject(cards, cardStatus),
    setCard: (cards, cardStatus) =>  this.#getInvalidCards(cards, cardStatus)
  }

  static #checkMissingPropertiesWhenThisStatus = [
    'newUser',
    'newCard',
    'newCardInCardSet',
    'updatedCard',
    'partOfDeckCard',
    'newDeck',
    'updatedDeck',
    'newCardSet',
    'updatedCardSet'
  ]
  static #checkRequiredPropertiesWhenThisStatus = ['updatedUser']

  static checkIfUserObjectIsValid(data, userStatus) {
    let invalidParts

    invalidParts = this.#checkIfObjectIsValid(data, userStatus, userObjectPropertyNames, userObjectPropertyChecks)

    return invalidParts
  }

  static checkIfCardObjectIsValid(data, cardStatus) {
    let invalidParts

    invalidParts = this.#checkIfObjectIsValid(data, cardStatus, cardObjectPropertyNames, cardObjectPropertyChecks)

    return invalidParts
  }

  static checkIfDeckObjectIsValid(data, deckStatus) {
    let invalidParts

    invalidParts = this.#checkIfObjectIsValid(data, deckStatus, deckObjectPropertyNames, deckObjectPropertyChecks)

    if (this.#wasCardsPropertyValid(invalidParts) === true) {
      invalidParts = this.#addInformationAboutInvalidCards(data.cards, 'deck', 'modifiedCards', 'partOfDeckCard', invalidParts)
    }

    return invalidParts
  }

  static checkIfCardSetObjectIsValid(data, cardSetStatus) {
    let invalidParts

    invalidParts = this.#checkIfObjectIsValid(data, cardSetStatus, cardSetObjectPropertyNames, cardSetObjectPropertyChecks)

    if (cardSetStatus === 'newCardSet' && this.#wasCardsPropertyValid(invalidParts) === true) {
      invalidParts = this.#addInformationAboutInvalidCards(data.cards, 'setCard', 'array', 'newCard', invalidParts)
    }

    return invalidParts
  }

  static #checkIfObjectIsValid(data, objectStatus, propertyNames, validationFunctions) {
    let invalidParts = {}

    const validPropertyNames = this.#getValidPropertyNames(data, objectStatus, propertyNames)
    const unexpectedPropertyNames = this.#getInvalidPropertyNames(data, objectStatus, propertyNames)

    invalidParts = this.#addUnexpectedPropertyNamesInformation(invalidParts, unexpectedPropertyNames)
    invalidParts = this.#addInvalidPropertyValuesInformation(validPropertyNames, invalidParts, data, validationFunctions)

    if (this.#checkMissingPropertiesWhenThisStatus.includes(objectStatus)) {
      invalidParts = this.#addMissingPropertiesInformation(invalidParts, validPropertyNames, propertyNames, objectStatus)
    } else if (this.#checkRequiredPropertiesWhenThisStatus.includes(objectStatus)) {
      invalidParts = this.#addMissingRequiredPropertiesInUpdateInformation(
        invalidParts,
        validPropertyNames,
        propertyNames,
        objectStatus)
    }

    return invalidParts
  }

  static #getValidPropertyNames(data, dataStatus, propertyNames) {
    const validNames = []
    const propertyNamesInData = Object.keys(data)

    for (const propertyName of propertyNamesInData) {
      if (propertyNames[dataStatus].includes(propertyName)) {
        validNames.push(propertyName)
      }
    }

    return validNames
  }

  static #getInvalidPropertyNames(data, dataStatus, propertyNames) {
    const invalidNames = []
    const propertyNamesInData = Object.keys(data)

    for (const propertyName of propertyNamesInData) {
      if (!propertyNames[dataStatus].includes(propertyName)) {
        invalidNames.push(propertyName)
      }
    }

    return invalidNames
  }

  static #addMissingPropertiesInformation(
    invalidParts,
    namesOfObjectProperties,
    expectedPropertyNames,
    dataStatus) {
    for (const propertyName of expectedPropertyNames[dataStatus]) {
      if (!namesOfObjectProperties.includes(propertyName)) {
        invalidParts[propertyName] = 'MISSING'
      }
    }

    return invalidParts
  }

  static #addMissingRequiredPropertiesInUpdateInformation(invalidParts, validPropertyNames, propertyNames) {
    if (propertyNames['requiredInUpdate'].length > 0) {
      for (const requiredPropertyName of propertyNames['requiredInUpdate']) {
        if (!validPropertyNames.includes(requiredPropertyName)) {
          invalidParts[requiredPropertyName] = 'REQUIRED'
        }
      }
    }

    return invalidParts
  }

  static #addUnexpectedPropertyNamesInformation(invalidParts, propertyNames) {
    for (const propertyName of propertyNames) {
      invalidParts[propertyName] = 'UNEXPECTED'
    }

    return invalidParts
  }

  static #addInvalidPropertyValuesInformation(validPropertyNames, invalidParts, data, validationFunctions) {
    for (const property of validPropertyNames) {
      const value = data[property]
      if (validationFunctions[property](value) === false) {
        invalidParts[property] = 'INVALID'
      }
    }

    return invalidParts
  }

  static #addInformationAboutInvalidCards(cards, objectContext, objectType, cardStatus, invalidParts) {
    const invalidCards = this.#cardsObjectCheckFunctions[objectContext](cards, cardStatus)

    if (this.#wasThereInvalidCards(invalidCards, objectType) === true) {
      invalidParts.cardObjects = invalidCards
      invalidParts.cards = 'INVALID'
    }

    return invalidParts
  }

  static #getInvalidCardsObject = (cards, cardStatus) => {
    const { added, deleted, updated } = cards

    const invalidCards = {
      added: this.#getInvalidCards(added, cardStatus),
      deleted: this.#getInvalidCards(deleted, cardStatus),
      updated: this.#getInvalidCards(updated, cardStatus)
    }

    return invalidCards
  }

  static #getInvalidCards(cards, cardStatus) {
    const invalidCards = []

    for (const [i, card] of Object.entries(cards)) {
      const invalidProperties = this.checkIfCardObjectIsValid(card, cardStatus)

      if (Object.keys(invalidProperties).length !== 0) {
        invalidCards.push({ ...invalidProperties, index: i })
      }
    }

    return invalidCards
  }

  static #wasCardsPropertyValid(invalidParts) {
    let wasValid = true

    if (Object.keys(invalidParts).includes('cards')) {
      wasValid = false
    }

    return wasValid
  }

  static #wasThereInvalidCards(invalidCards, objectType) {
    let thereWasInvalidCards

    if (objectType === 'array') {
      thereWasInvalidCards = this.#checkArrayCardObject(invalidCards)
    } else if (objectType === 'modifiedCards') {
      thereWasInvalidCards = this.#checkModifiedCardsObject(invalidCards)
    }

    return thereWasInvalidCards
  }

  static #checkModifiedCardsObject(invalidCards) {
    let thereWasInvalidCards = false

    for (const invalidCardInfo of Object.values(invalidCards)) {
      if (invalidCardInfo.length > 0) {
        thereWasInvalidCards = true
        break
      }
    }

    return thereWasInvalidCards
  }

  static #checkArrayCardObject(invalidCards) {
    let thereWasInvalidCards = false

    if (invalidCards.length > 0) {
      thereWasInvalidCards = true
    }

    return thereWasInvalidCards
  }
}
module.exports = ObjectValidator