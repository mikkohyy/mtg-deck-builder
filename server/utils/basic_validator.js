class BasicValidator {
  static #basicCardPropertyNames = [
    'name',
    'cardNumber',
    'manaCost',
    'rulesText',
    'price',
    'rarity'
  ]

  static #basicDeckPropertyNames = [
    'userId',
    'name',
    'notes',
  ]

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

  static checkIfModifiedCardsObject(data) {
    if (data === undefined || !this.#isItObject(data) || !this.#isItModifiedCardsObject(data)) {
      return false
    } else {
      return true
    }
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

    const dateData = new Date(data)

    if (dateData instanceof Date && !isNaN(dateData)) {
      dataIsDate = true
    }

    return dataIsDate
  }

  static #isItObject(data) {
    let dataIsObject = false

    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      dataIsObject = true
    }

    return dataIsObject
  }

  static #isItModifiedCardsObject(data) {
    let dataIsModifiedCardsObject = false
    const keysInData = Object.keys(data)
    const expectedCardObjectKeys = ['added', 'deleted', 'updated']

    if (keysInData.length === 3 && this.#hasExpectedKeys(keysInData, expectedCardObjectKeys)) {
      dataIsModifiedCardsObject = true
    }

    return dataIsModifiedCardsObject
  }

  static #hasExpectedKeys(keysInData, expectedKeys) {
    let hasExpectedKeys = true

    for (const key of keysInData) {
      if (!expectedKeys.includes(key)) {
        hasExpectedKeys = false
        break
      }
    }

    return hasExpectedKeys
  }
}

module.exports = BasicValidator