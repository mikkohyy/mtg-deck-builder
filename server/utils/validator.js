class Validator {
  static #cardPropertyChecks = {
    id: (data) => this.checkIfInteger(data),
    cardSetId: (data) => this.checkIfInteger(data),
    name: (data) => this.checkIfString(data),
    cardNumber: (data) => this.checkIfInteger(data),
    manaCost: (data) => this.checkIfString(data),
    price: (data) => this.checkIfFloat(data),
    rulesText: (data) => this.checkIfString(data),
    rarity: (data) => this.checkIfString(data),
    nInDeck: (data) => this.checkIfInteger(data),
    sideboard: (data) => this.checkIfBoolean(data)
  }

  static #userPropertyChecks = {
    id: (data) => this.checkIfInteger(data),
    username: (data) => this.checkIfString(data),
    password: (data) => this.checkIfString(data)
  }

  static #deckPropertyChecks = {
    id: (data) => this.checkIfInteger(data),
    userId: (data) => this.checkIfInteger(data),
    name: (data) => this.checkIfString(data),
    notes: (data) => this.checkIfString(data),
    cards: (data) => this.checkIfArray(data)
  }

  static #basicCardPropertyNames = [
    'name',
    'cardNumber',
    'manaCost',
    'rulesText',
    'price',
    'rarity'
  ]

  static #basicUserPropertyNames = [
    'username',
  ]

  static #basicDeckPropertyNames = [
    'userId',
    'name',
    'notes',
  ]

  static #updatedCardObjectsPropertyNames = [
    'added',
    'updated',
    'deleted'
  ]

  static #cardPropertyNames = {
    new: [ ...this.#basicCardPropertyNames ],
    addedToCardSet: [
      'cardSetId',
      ...this.#basicCardPropertyNames
    ],
    existing: [
      'id',
      'cardSetId',
      ...this.#basicCardPropertyNames
    ],
    partOfDeck: [
      'id',
      'nInDeck',
      'sideboard',
      ...this.#basicCardPropertyNames
    ],
  }

  static #userPropertyNames = {
    new: [ ...this.#basicUserPropertyNames, 'password' ],
    updated: [ ...this.#basicUserPropertyNames, 'password' ]
  }

  static #deckPropertyNames = {
    new: [ ...this.#basicDeckPropertyNames, 'cards' ],
    existing: ['id', ...this.#basicDeckPropertyNames ]
  }

  static checkIfString(data) {
    if (!data || !this.#isItString(data)) {
      return false
    } else {
      return true
    }
  }

  static checkIfArray(data) {
    if (!data || !Array.isArray(data)) {
      return false
    } else {
      return true
    }
  }

  static checkIfFloat(data) {
    if (!data || !this.#isItFloatOrInteger(data)) {
      return false
    } else {
      return true
    }
  }

  static checkIfInteger(data) {
    if (data === undefined || Array.isArray(data) || !this.#isItInteger(data)) {
      return false
    } else {
      return true
    }
  }

  static checkIfRarityClass(data) {
    if (!data || !this.#isItString(data) || !this.#isItRarityClass(data)) {
      return false
    } else {
      return true
    }
  }

  static checkIfBoolean(data) {
    if (data === undefined || !this.#isItBoolean(data)) {
      return false
    } else {
      return true
    }
  }

  static checkIfDate(data) {
    if (data === undefined || !this.#isItDate(data)) {
      return false
    } else {
      return true
    }
  }

  static checkIfCardIsValid(data, cardStatus) {
    let invalidParts = {}
    let {
      validPropertyNames,
      unexpectedPropertyNames
    } = this.#checkCardPropertyNames(data, cardStatus)

    invalidParts = this.#addUnexpectedPropertyNames(unexpectedPropertyNames, invalidParts)
    invalidParts = this.#checkIfCardHasMissingProperties(validPropertyNames, invalidParts, cardStatus)
    invalidParts = this.#checkIfCardHasInvalidTypes(validPropertyNames, invalidParts, data)

    return invalidParts
  }

  static checkIfModifiedCardsObjectIsValid(data) {
    let invalidParts = {}
    let {
      validPropertyNames,
      unexpectedPropertyNames
    } = this.#checkUpdatedCardsObjectPropertyNames(data)

    invalidParts = this.#addUnexpectedPropertyNames(unexpectedPropertyNames, invalidParts)
    invalidParts = this.#checkIfModifiedCardsObjectHasMissingProperties(validPropertyNames, invalidParts)
    invalidParts = this.#checkIfUpdatedCardsObjectHasInvalidTypes(validPropertyNames, invalidParts, data)

    return invalidParts
  }

  static checkIfUserIsValid(data, userStatus) {
    const invalidParts = userStatus === 'new'
      ? this.#checkIfNewUserIsValid(data, 'new')
      : this.#checkIfUpdatedUserIsValid(data, 'updated')

    return invalidParts
  }

  static checkIfDeckIsValid(data, deckStatus) {
    const invalidParts = deckStatus === 'new'
      ? this.#checkIfNewDeckIsValid(data)
      : this.#checkIfUpdatedDeckIsValid(data)

    return invalidParts
  }

  static #checkIfNewDeckIsValid(data) {
    let invalidParts = {}

    let {
      validPropertyNames,
      unexpectedPropertyNames
    } = this.#checkDeckPropertyNames(data, 'new')

    invalidParts = this.#addUnexpectedPropertyNames(unexpectedPropertyNames, invalidParts)
    invalidParts = this.#checkIfDeckHasMissingProperties(validPropertyNames, invalidParts, 'new')
    invalidParts = this.#checkIfDeckHasInvalidTypes(validPropertyNames, invalidParts, data)

    return invalidParts
  }

  static #checkIfUpdatedDeckIsValid(data) {
    let invalidParts = {}

    let {
      validPropertyNames,
      unexpectedPropertyNames
    } = this.#checkDeckPropertyNames(data, 'existing')

    invalidParts = this.#addUnexpectedPropertyNames(unexpectedPropertyNames, invalidParts)
    invalidParts = this.#checkIfDeckHasMissingProperties(validPropertyNames, invalidParts, 'existing')
    invalidParts = this.#checkIfDeckHasInvalidTypes(validPropertyNames, invalidParts, data)

    return invalidParts
  }

  static #checkIfNewUserIsValid(data) {
    let invalidParts = {}

    let {
      validPropertyNames,
      unexpectedPropertyNames
    } = this.#checkUserPropertyNames(data, 'new')

    invalidParts = this.#addUnexpectedPropertyNames(unexpectedPropertyNames, invalidParts)
    invalidParts = this.#checkIfUserHasMissingProperties(validPropertyNames, invalidParts, 'new')
    invalidParts = this.#checkIfUserHasInvalidTypes(validPropertyNames, invalidParts, data)

    return invalidParts
  }

  static #checkIfUpdatedUserIsValid(data) {
    let invalidParts = {}

    let {
      validPropertyNames,
      unexpectedPropertyNames
    } = this.#checkUserPropertyNames(data, 'updated')

    invalidParts = this.#addUnexpectedPropertyNames(unexpectedPropertyNames, invalidParts)
    invalidParts = this.#checkIfUserHasInvalidTypes(validPropertyNames, invalidParts, data)

    return invalidParts
  }

  static #checkCardPropertyNames(data, cardStatus) {
    const validNames = []
    const unexpectedNames = []
    const dataPropertyNames = Object.keys(data)

    for (const propertyName of dataPropertyNames) {
      this.#cardPropertyNames[cardStatus].includes(propertyName)
        ? validNames.push(propertyName)
        : unexpectedNames.push(propertyName)
    }

    const propertyNameInfo = {
      validPropertyNames: validNames,
      unexpectedPropertyNames: unexpectedNames
    }

    return propertyNameInfo
  }

  static #checkUserPropertyNames(data, userStatus) {
    const validNames = []
    const unexpectedNames = []
    const dataPropertyNames = Object.keys(data)

    for (const propertyName of dataPropertyNames) {
      this.#userPropertyNames[userStatus].includes(propertyName)
        ? validNames.push(propertyName)
        : unexpectedNames.push(propertyName)
    }

    const propertyNameInfo = {
      validPropertyNames: validNames,
      unexpectedPropertyNames: unexpectedNames
    }

    return propertyNameInfo
  }

  static #checkDeckPropertyNames(data, userStatus) {
    const validNames = []
    const unexpectedNames = []
    const dataPropertyNames = Object.keys(data)

    for (const propertyName of dataPropertyNames) {
      this.#deckPropertyNames[userStatus].includes(propertyName)
        ? validNames.push(propertyName)
        : unexpectedNames.push(propertyName)
    }

    const propertyNameInfo = {
      validPropertyNames: validNames,
      unexpectedPropertyNames: unexpectedNames
    }

    return propertyNameInfo
  }

  static #checkUpdatedCardsObjectPropertyNames(data) {
    const validNames = []
    const unexpectedNames = []
    const propertyNames = Object.keys(data)

    for (const propertyName of propertyNames) {
      this.#updatedCardObjectsPropertyNames.includes(propertyName)
        ? validNames.push(propertyName)
        : unexpectedNames.push(propertyName)
    }

    const propertyNameInfo = {
      validPropertyNames: validNames,
      unexpectedPropertyNames: unexpectedNames
    }

    return propertyNameInfo
  }

  static #addUnexpectedPropertyNames(propertyNames, invalidParts) {
    for (const propertyName of propertyNames) {
      invalidParts[propertyName] = 'UNEXPECTED'
    }

    return invalidParts
  }

  static #checkIfCardHasMissingProperties(propertyNames, invalidParts, cardStatus) {
    for (const property of this.#cardPropertyNames[cardStatus]) {
      !propertyNames.includes(property) && (invalidParts[property] = 'MISSING')
    }

    return invalidParts
  }

  static #checkIfModifiedCardsObjectHasMissingProperties(propertyNames, invalidParts) {
    for (const property of this.#updatedCardObjectsPropertyNames) {
      !propertyNames.includes(property) && (invalidParts[property] = 'MISSING')
    }

    return invalidParts
  }

  static #checkIfUserHasMissingProperties(propertyNames, invalidParts, userStatus) {
    for (const property of this.#userPropertyNames[userStatus]) {
      !propertyNames.includes(property) && (invalidParts[property] = 'MISSING')
    }

    return invalidParts
  }

  static #checkIfDeckHasMissingProperties(propertyNames, invalidParts, deckStatus) {
    for (const property of this.#deckPropertyNames[deckStatus]) {
      !propertyNames.includes(property) && (invalidParts[property] = 'MISSING')
    }

    return invalidParts
  }

  static #checkIfCardHasInvalidTypes(validPropertyNames, invalidParts, data) {
    for (const property of validPropertyNames) {
      const value = data[property]
      if (!this.#cardPropertyChecks[property](value)) {
        invalidParts[property] = 'INVALID'
      }
    }

    return invalidParts
  }

  static #checkIfUpdatedCardsObjectHasInvalidTypes(validPropertyNames, invalidParts, data) {
    for (const property of validPropertyNames) {
      const value = data[property]
      if (!this.checkIfArray(value)) {
        invalidParts[property] = 'INVALID'
      }
    }

    return invalidParts
  }

  static #checkIfUserHasInvalidTypes(validPropertyNames, invalidParts, data) {
    for (const property of validPropertyNames) {
      const value = data[property]
      !this.#userPropertyChecks[property](value) && (invalidParts[property] = 'INVALID')
    }

    return invalidParts
  }

  static #checkIfDeckHasInvalidTypes(validPropertyNames, invalidParts, data) {
    for (const property of validPropertyNames) {
      const value = data[property]
      !this.#deckPropertyChecks[property](value) && (invalidParts[property] = 'INVALID')
    }

    return invalidParts
  }

  static #isItString(data) {

    const dataIsString = typeof data === 'string' || data instanceof String
    return dataIsString
  }

  static #isItFloatOrInteger(data) {
    const dataAsNumber = Number(data)
    const dataIsFloat = !Number.isNaN(dataAsNumber) ? true : false

    return dataIsFloat
  }

  static #isItInteger(data) {
    let dataIsInteger = false

    const dataAsNumber = Number(data)
    const dataIsNumber = !Number.isNaN(dataAsNumber) ? true : false

    if (dataIsNumber) {
      dataIsInteger = dataAsNumber % 1 === 0 ? true : false
    }

    return dataIsInteger
  }

  static #isItRarityClass(data) {
    const rarityClasses = ['common', 'uncommon', 'rare', 'mythic rare']
    const isRarityClass = rarityClasses.includes(data)

    return isRarityClass
  }

  static #isItBoolean(data) {
    let dataIsBoolean = false

    if (data === false || data === true) {
      dataIsBoolean = true
    }

    return dataIsBoolean
  }

  static #isItDate(data) {
    let dataIsDate = false

    if (data instanceof Date && !isNaN(data)) {
      dataIsDate = true
    }

    return dataIsDate
  }
}

module.exports = Validator