class Validator {
  static #cardPropertyChecks = {
    id: (data) => this.checkIfInteger(data),
    cardSetId: (data) => this.checkIfInteger(data),
    name: (data) => this.checkIfString(data),
    cardNumber: (data) => this.checkIfInteger(data),
    manaCost: (data) => this.checkIfString(data),
    price: (data) => this.checkIfFloat(data),
    rulesText: (data) => this.checkIfString(data),
    rarity: (data) => this.checkIfString(data)
  }

  static #basicPropertyNames = [
    'name',
    'cardNumber',
    'manaCost',
    'price',
    'rulesText',
    'rarity'
  ]

  static #cardPropertyNames = {
    new: [ ...this.#basicPropertyNames ],
    addedToCardSet: [
      'cardSetId',
      ...this.#basicPropertyNames
    ],
    existing: [
      'id',
      'cardSetId',
      ...this.#basicPropertyNames
    ]
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
    if (!data | !this.#isItInteger(data)) {
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

  static checkIfCardIsValid(data, cardStatus) {
    let invalidParts = {}
    let { validPropertyNames, unexpectedPropertyNames } = this.#checkPropertyNames(data, cardStatus)

    invalidParts = this.#addUnexpectedPropertyNames(unexpectedPropertyNames, invalidParts)
    invalidParts = this.#checkIfMissingProperties(validPropertyNames, invalidParts, cardStatus)
    invalidParts = this.#checkIfInvalidTypes(validPropertyNames, invalidParts, data)

    return invalidParts
  }

  static #checkPropertyNames(data, cardStatus) {
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

  static #addUnexpectedPropertyNames(propertyNames, invalidParts) {
    for (const propertyName of propertyNames) {
      invalidParts[propertyName] = 'UNEXPECTED'
    }

    return invalidParts
  }

  static #checkIfMissingProperties(propertyNames, invalidParts, cardStatus) {
    for (const property of this.#cardPropertyNames[cardStatus]) {
      !propertyNames.includes(property) && (invalidParts[property] = 'MISSING')
    }

    return invalidParts
  }

  static #checkIfInvalidTypes(validPropertyNames, invalidParts, data) {
    for (const property of validPropertyNames) {
      const value = data[property]
      !this.#cardPropertyChecks[property](value) && (invalidParts[property] = 'INVALID')
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
}

module.exports = Validator