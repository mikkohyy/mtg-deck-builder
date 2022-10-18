const {
  testCards,
  testUsers,
  testDecksWithId,
  testDecks,
  testUpdatedCards
} = require('./test_data')
const { transformKeysFromSnakeCaseToCamelCase } = require('./test_helpers')
const Validator = require('../utils/validator')

describe('Data validations', () => {
  describe('String', () => {
    test('returns true when a string', () => {
      const data = 'this is a string'
      const validationResult = Validator.checkIfString(data)

      expect(validationResult).toBe(true)
    })

    test('returns false when undefined', () => {
      const data = undefined
      const validationResult = Validator.checkIfString(data)

      expect(validationResult).toBe(false)
    })

    test('returns false when not a string', () => {
      const data = {}
      const validationResult = Validator.checkIfString(data)

      expect(validationResult).toBe(false)
    })
  })

  describe('Array', () => {
    test('returns false when undefined', () => {
      const data = undefined
      const validationResult = Validator.checkIfArray(data)

      expect(validationResult).toBe(false)
    })

    test('returns false when not an array', () => {
      const data = { data: 'this is a string' }
      const validationResult = Validator.checkIfArray(data)

      expect(validationResult).toBe(false)
    })

    test('returns true when an array', () => {
      const data = [1, 2, 3]
      const validationResult = Validator.checkIfArray(data)

      expect(validationResult).toBe(true)
    })
  })

  describe('Float', () => {
    test('returns false when undefined', () => {
      const data = undefined
      const validationResult = Validator.checkIfFloat(data)

      expect(validationResult).toBe(false)
    })

    test('returns false when not a number', () => {
      const data = 'this is not a number'
      const validationResult = Validator.checkIfFloat(data)

      expect(validationResult).toBe(false)
    })

    test('returns false when mix of numbers and characters', () => {
      const data = '2 things'
      const validationResult = Validator.checkIfFloat(data)

      expect(validationResult).toBe(false)
    })

    test('returns true when literal float', () => {
      const data = '3.18'
      const validationResult = Validator.checkIfFloat(data)

      expect(validationResult).toBe(true)
    })

    test('returns true when implicit float', () => {
      const data = '4'
      const validationResult = Validator.checkIfFloat(data)

      expect(validationResult).toBe(true)
    })
  })

  describe('Integer', () => {
    test('returns false when undefined', () => {
      const data = undefined
      const validationResult = Validator.checkIfInteger(data)

      expect(validationResult).toBe(false)
    })

    test('returns false when a string', () => {
      const data = 'this is a string'
      const validationResult = Validator.checkIfInteger(data)

      expect(validationResult).toBe(false)
    })

    test('returns false when mix of numbers and characters', () => {
      const data = '2 things'
      const validationResult = Validator.checkIfInteger(data)

      expect(validationResult).toBe(false)
    })

    test('returns false when a float', () => {
      const data = '3.45'
      const validationResult = Validator.checkIfInteger(data)

      expect(validationResult).toBe(false)
    })

    test('returns true when integer', () => {
      const data = '4'
      const validationResult = Validator.checkIfInteger(data)

      expect(validationResult).toBe(true)
    })
  })

  describe('Rarity class', () => {
    test('returns false when undefined', () => {
      const data = undefined
      const validationResult = Validator.checkIfRarityClass(data)

      expect(validationResult).toBe(false)
    })

    test('returns false when not a string', () => {
      const data = []
      const validationResult = Validator.checkIfRarityClass(data)

      expect(validationResult).toBe(false)
    })

    test('returns false when not a rarity class', () => {
      const data = 'very uncommon'
      const validationResult = Validator.checkIfRarityClass(data)

      expect(validationResult).toBe(false)
    })

    test('returns true when "common"', () => {
      const data = 'common'
      const validationResult = Validator.checkIfRarityClass(data)

      expect(validationResult).toBe(true)
    })

    test('returns true when "uncommon"', () => {
      const data = 'uncommon'
      const validationResult = Validator.checkIfRarityClass(data)

      expect(validationResult).toBe(true)
    })

    test('returns true when "rare"', () => {
      const data = 'rare'
      const validationResult = Validator.checkIfRarityClass(data)

      expect(validationResult).toBe(true)
    })

    test('returns true when "mythic rare"', () => {
      const data = 'mythic rare'
      const validationResult = Validator.checkIfRarityClass(data)

      expect(validationResult).toBe(true)
    })
  })
})

describe('Object validations', () => {
  describe('Card', () => {
    describe('returns expected info on what is invalid about a new card', () => {
      test('when one property is missing', () => {
        const data = { ...testCards[0] }
        delete data.name
        const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(data, 'new')

        expect(whatIsWrongAboutThisCard).toEqual({ name: 'MISSING' })
      })

      test('when one property is invalid', () => {
        const data = { ...testCards[0] }
        data.cardNumber = 0.3
        const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(data, 'new')

        expect(whatIsWrongAboutThisCard).toEqual({ cardNumber: 'INVALID' })
      })

      test('returns right number of invalid properties', () => {
        const data = { ...testCards[0] }
        data.rarity = 0.3
        data.price = 'this is a string'
        delete data.name
        delete data.manaCost
        const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(data, 'new')
        const properties = Object.keys(whatIsWrongAboutThisCard)

        expect(properties.length).toBe(4)
      })

      test('returns expected info of invalid properties', () => {
        const data = { ...testCards[0] }
        data.rarity = 0.3
        data.price = 'this is a string'
        delete data.name
        delete data.manaCost
        const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(data, 'new')

        expect(whatIsWrongAboutThisCard).toHaveProperty('rarity', 'INVALID')
        expect(whatIsWrongAboutThisCard).toHaveProperty('price', 'INVALID')
        expect(whatIsWrongAboutThisCard).toHaveProperty('name', 'MISSING')
        expect(whatIsWrongAboutThisCard).toHaveProperty('manaCost', 'MISSING')
      })

      test('does not throw an error if unexpected property', () => {
        const data = { ...testCards[0] }
        data.extra = 'this is extra'

        expect(() => Validator.checkIfCardIsValid(data, 'new')).not.toThrowError()
      })

      test('returns expected info if unexpected property', () => {
        const data = { ...testCards[0] }
        data.extra = 'this is extra'
        const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(data, 'new')

        expect(whatIsWrongAboutThisCard).toHaveProperty('extra', 'UNEXPECTED')
      })

      test('returns expected info if unexpected, missing and invalid properties', () => {
        const data = { ...testCards[0] }
        data.extra = 'this is extra'
        delete data.rulesText
        data.manaCost = 0.4
        const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(data, 'new')

        const numberOfProperties = Object.keys(whatIsWrongAboutThisCard)

        expect(numberOfProperties).toHaveLength(3)
        expect(whatIsWrongAboutThisCard).toHaveProperty('extra', 'UNEXPECTED')
        expect(whatIsWrongAboutThisCard).toHaveProperty('rulesText', 'MISSING')
        expect(whatIsWrongAboutThisCard).toHaveProperty('manaCost', 'INVALID')
      })
    })
  })

  describe('New user', () => {
    test('accepts data when valid properties', () => {
      const data = { ...testUsers[0] }
      const whatIsWrongAboutThisUser = Validator.checkIfUserIsValid(data, 'new')

      const numberOfProperties = Object.keys(whatIsWrongAboutThisUser)

      expect(numberOfProperties).toHaveLength(0)
    })

    test('rejects data with correct information when missing property', () => {
      const data = { ...testUsers[0] }
      delete data.password

      const whatIsWrongAboutThisUser = Validator.checkIfUserIsValid(data, 'new')
      const numberOfProperties = Object.keys(whatIsWrongAboutThisUser)

      expect(numberOfProperties).toHaveLength(1)
      expect(whatIsWrongAboutThisUser).toHaveProperty('password', 'MISSING')
    })

    test('rejects data with correct information when invalid property', () => {
      const data = { ...testUsers[0] }
      data.username = []

      const whatIsWrongAboutThisUser = Validator.checkIfUserIsValid(data, 'new')
      const numberOfProperties = Object.keys(whatIsWrongAboutThisUser)

      expect(numberOfProperties).toHaveLength(1)
      expect(whatIsWrongAboutThisUser).toHaveProperty('username', 'INVALID')
    })

    test('rejects data with correct information when unexpected property', () => {
      const data = { ...testUsers[0] }
      data.extra = ['this is extra']

      const whatIsWrongAboutThisUser = Validator.checkIfUserIsValid(data, 'new')
      const numberOfProperties = Object.keys(whatIsWrongAboutThisUser)

      expect(numberOfProperties).toHaveLength(1)
      expect(whatIsWrongAboutThisUser).toHaveProperty('extra', 'UNEXPECTED')
    })

    test('rejects data with correct information when invalid and missing properties', () => {
      const data = { ...testUsers[0] }
      delete data.username
      data.password = { valid: 'not' }

      const whatIsWrongAboutThisUser = Validator.checkIfUserIsValid(data, 'new')
      const numberOfProperties = Object.keys(whatIsWrongAboutThisUser)

      expect(numberOfProperties).toHaveLength(2)
      expect(whatIsWrongAboutThisUser).toHaveProperty('username', 'MISSING')
      expect(whatIsWrongAboutThisUser).toHaveProperty('password', 'INVALID')
    })
  })

  describe('Updated user', () => {
    test('accepts data when valid properties', () => {
      const data = { ...testUsers[0] }
      const whatIsWrongAboutThisUser = Validator.checkIfUserIsValid(data, 'updated')

      const numberOfProperties = Object.keys(whatIsWrongAboutThisUser)

      expect(numberOfProperties).toHaveLength(0)
    })

    test('accepts data when only one property', () => {
      const data = { username: testUsers[0].username }
      const whatIsWrongAboutThisUser = Validator.checkIfUserIsValid(data, 'updated')

      const numberOfProperties = Object.keys(whatIsWrongAboutThisUser)

      expect(numberOfProperties).toHaveLength(0)
    })

    test('rejects data with correct information when invalid property', () => {
      const data = { ...testUsers[0] }
      data.username = []

      const whatIsWrongAboutThisUser = Validator.checkIfUserIsValid(data, 'updated')
      const numberOfProperties = Object.keys(whatIsWrongAboutThisUser)

      expect(numberOfProperties).toHaveLength(1)
      expect(whatIsWrongAboutThisUser).toHaveProperty('username', 'INVALID')
    })

    test('rejects data with correct information when unexpected property', () => {
      const data = { ...testUsers[0] }
      data.extra = ['this is extra']

      const whatIsWrongAboutThisUser = Validator.checkIfUserIsValid(data, 'updated')
      const numberOfProperties = Object.keys(whatIsWrongAboutThisUser)

      expect(numberOfProperties).toHaveLength(1)
      expect(whatIsWrongAboutThisUser).toHaveProperty('extra', 'UNEXPECTED')
    })

    test('rejects data with correct information when two invalid properties', () => {
      const data = {
        username: [1, 2, 4],
        password: { thisIs: 'invalid' }
      }

      const whatIsWrongAboutThisUser = Validator.checkIfUserIsValid(data, 'updated')
      const numberOfProperties = Object.keys(whatIsWrongAboutThisUser)

      expect(numberOfProperties).toHaveLength(2)
      expect(whatIsWrongAboutThisUser).toHaveProperty('username', 'INVALID')
      expect(whatIsWrongAboutThisUser).toHaveProperty('password', 'INVALID')
    })
  })

  describe('New deck', () => {
    test('accepts data when valid properties', () => {
      const data = { ...testDecks[0] }
      const deckInfo = transformKeysFromSnakeCaseToCamelCase(data)

      const whatIsWrongAboutThisDeck = Validator.checkIfDeckIsValid(deckInfo, 'new')
      const numberOfProperties = Object.keys(whatIsWrongAboutThisDeck)

      expect(numberOfProperties).toHaveLength(0)
    })

    test('rejects data with correct information when invalid property', () => {
      const data = { ...testDecks[0] }
      const deckInfo = transformKeysFromSnakeCaseToCamelCase(data)

      deckInfo.notes = []

      const whatIsWrongAboutThisDeck = Validator.checkIfDeckIsValid(deckInfo, 'new')
      const numberOfProperties = Object.keys(whatIsWrongAboutThisDeck)

      expect(numberOfProperties).toHaveLength(1)
      expect(whatIsWrongAboutThisDeck).toHaveProperty('notes', 'INVALID')
    })

    test('rejects data with correct information when invalid, missing and unexpected properties', () => {
      const data = { ...testDecks[0] }
      const deckInfo = transformKeysFromSnakeCaseToCamelCase(data)

      deckInfo.notes = []
      delete deckInfo.userId
      deckInfo.extra = 'this is extra'

      const whatIsWrongAboutThisDeck = Validator.checkIfDeckIsValid(deckInfo, 'new')
      const numberOfProperties = Object.keys(whatIsWrongAboutThisDeck)

      expect(numberOfProperties).toHaveLength(3)
      expect(whatIsWrongAboutThisDeck).toHaveProperty('notes', 'INVALID')
      expect(whatIsWrongAboutThisDeck).toHaveProperty('userId', 'MISSING')
      expect(whatIsWrongAboutThisDeck).toHaveProperty('extra', 'UNEXPECTED')
    })
  })

  describe('Updated deck', () => {
    test('accepts data when valid properties', () => {
      const data = { ...testDecksWithId[0] }
      const deckInfo = transformKeysFromSnakeCaseToCamelCase(data)

      const whatIsWrongAboutThisDeck = Validator.checkIfDeckIsValid(deckInfo, 'update')
      const numberOfProperties = Object.keys(whatIsWrongAboutThisDeck)

      expect(numberOfProperties).toHaveLength(0)
    })

    test('rejects data with correct information when invalid property', () => {
      const data = { ...testDecksWithId[0] }
      const deckInfo = transformKeysFromSnakeCaseToCamelCase(data)

      deckInfo.notes = []

      const whatIsWrongAboutThisDeck = Validator.checkIfDeckIsValid(deckInfo, 'updated')

      expect(whatIsWrongAboutThisDeck).toHaveProperty('notes', 'INVALID')
    })

    test('rejects data with correct information when invalid, missing and unexpected properties', () => {
      const data = { ...testDecksWithId[0] }
      const deckInfo = transformKeysFromSnakeCaseToCamelCase(data)

      deckInfo.notes = []
      delete deckInfo.id
      deckInfo.extra = 'this is extra'

      const whatIsWrongAboutThisDeck = Validator.checkIfDeckIsValid(deckInfo, 'updated')

      expect(whatIsWrongAboutThisDeck).toHaveProperty('notes', 'INVALID')
      expect(whatIsWrongAboutThisDeck).toHaveProperty('id', 'MISSING')
      expect(whatIsWrongAboutThisDeck).toHaveProperty('extra', 'UNEXPECTED')
    })
  })

  describe('updated card in deck', () => {
    test('accepts data when valid properties', () => {
      const cardData = { ...testUpdatedCards[0] }
      const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(cardData, 'partOfDeck')

      const numberOfProperties = Object.keys(whatIsWrongAboutThisCard)
      expect(numberOfProperties).toHaveLength(0)
    })

    test('rejects data when ivalid properties', () => {
      const cardData = { ...testUpdatedCards[0] }
      cardData.sideboard = []

      const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(cardData, 'partOfDeck')

      const numberOfProperties = Object.keys(whatIsWrongAboutThisCard)
      expect(numberOfProperties).toHaveLength(1)
    })

    test('returns information on which properties are invalid', () => {
      const cardData = { ...testUpdatedCards[0] }
      cardData.sideboard = []

      const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(cardData, 'partOfDeck')

      expect(whatIsWrongAboutThisCard).toHaveProperty('sideboard', 'INVALID')
    })

    test('returns information on which properties are invalid, missing or unexpected', () => {
      const cardData = { ...testUpdatedCards[0] }
      cardData.sideboard = []
      cardData.extra = 'extra'
      delete cardData.nInDeck

      const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(cardData, 'partOfDeck')

      expect(whatIsWrongAboutThisCard).toHaveProperty('sideboard', 'INVALID')
      expect(whatIsWrongAboutThisCard).toHaveProperty('extra', 'UNEXPECTED')
      expect(whatIsWrongAboutThisCard).toHaveProperty('nInDeck', 'MISSING')
    })

  })
})