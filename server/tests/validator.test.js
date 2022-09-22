const { testCards } = require('./test_data')
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
    describe('returns expected info on what is invalid about a card', () => {
      test('when one property is missing', () => {
        const data = { ...testCards[0] }
        delete data.name
        const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(data)

        expect(whatIsWrongAboutThisCard).toEqual({ name: 'MISSING' })
      })

      test('when one property is invalid', () => {
        const data = { ...testCards[0] }
        data.cardNumber = 0.3
        const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(data)

        expect(whatIsWrongAboutThisCard).toEqual({ cardNumber: 'INVALID' })
      })

      test('returns right number of invalid properties', () => {
        const data = { ...testCards[0] }
        data.rarity = 0.3
        data.price = 'this is a string'
        delete data.name
        delete data.manaCost
        const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(data)
        const properties = Object.keys(whatIsWrongAboutThisCard)

        expect(properties.length).toBe(4)
      })

      test('returns expected info of invalid properties', () => {
        const data = { ...testCards[0] }
        data.rarity = 0.3
        data.price = 'this is a string'
        delete data.name
        delete data.manaCost
        const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(data)

        expect(whatIsWrongAboutThisCard).toHaveProperty('rarity', 'INVALID')
        expect(whatIsWrongAboutThisCard).toHaveProperty('price', 'INVALID')
        expect(whatIsWrongAboutThisCard).toHaveProperty('name', 'MISSING')
        expect(whatIsWrongAboutThisCard).toHaveProperty('manaCost', 'MISSING')
      })

      test('does not throw an error if unexpected property', () => {
        const data = { ...testCards[0] }
        data.extra = 'this is extra'

        expect(() => Validator.checkIfCardIsValid(data)).not.toThrowError()
      })

      test('returns expected info if unexpected property', () => {
        const data = { ...testCards[0] }
        data.extra = 'this is extra'
        const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(data)

        expect(whatIsWrongAboutThisCard).toHaveProperty('extra', 'UNEXPECTED')
      })

      test('returns expected info if unexpected, missing and invalid properties', () => {
        const data = { ...testCards[0] }
        data.extra = 'this is extra'
        delete data.rulesText
        data.manaCost = 0.4
        const whatIsWrongAboutThisCard = Validator.checkIfCardIsValid(data)

        const numberOfProperties = Object.keys(whatIsWrongAboutThisCard)

        expect(numberOfProperties).toHaveLength(3)
        expect(whatIsWrongAboutThisCard).toHaveProperty('extra', 'UNEXPECTED')
        expect(whatIsWrongAboutThisCard).toHaveProperty('rulesText', 'MISSING')
        expect(whatIsWrongAboutThisCard).toHaveProperty('manaCost', 'INVALID')
      })
    })
  })
})