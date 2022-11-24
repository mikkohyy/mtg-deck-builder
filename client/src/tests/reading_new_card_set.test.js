import { testCards } from './test_data'
import { checkIfCardsHaveSameKeys, checkIfDataInCardsIsValid } from '../utils/reading_new_card_set'

describe('checkIfCardsHaveSameKeys(cards)', () => {
  describe('returns true', () => {
    test('when cards have the same keys', () => {
      const haveTheSameKeys = checkIfCardsHaveSameKeys(testCards)
      expect(haveTheSameKeys).toBe(true)
    })
  })

  describe('returns false', () => {
    test('when difference in the names of the keys', () => {
      const invalidCards = testCards.map(card => ({ ...card }))
      delete invalidCards[0].card_number
      invalidCards[0].number_of_the_card = 123

      const haveTheSameKeys = checkIfCardsHaveSameKeys(invalidCards)
      expect(haveTheSameKeys).toBe(false)
    })
    test('when difference in the number of the keys', () => {
      const invalidCards = testCards.map(card => ({ ...card }))
      delete invalidCards[0].card_number

      const haveTheSameKeys = checkIfCardsHaveSameKeys(invalidCards)
      expect(haveTheSameKeys).toBe(false)
    })
  })
})

describe('checkIfDataInCardsIsValid(fieldNames, cards)', () => {
  const fieldNames = {
    name: 'full_name',
    price: 'average_price_30_days',
    rarity: 'rarity',
    cardNumber: 'card_number',
    manaCost: 'mana_cost',
    rulesText: 'rules_text'
  }

  describe('returns true', () => {
    test('when data is valid', () => {
      const dataIsValid = checkIfDataInCardsIsValid(fieldNames, testCards)
      expect(dataIsValid).toBe(true)
    })
  })

  describe('returns false', () => {
    test('when there is invalid data', () => {
      const cardsWithInvalidData = testCards.map(card => ({ ...card }))
      cardsWithInvalidData[2].card_number = 256.4

      const dataIsValid = checkIfDataInCardsIsValid(fieldNames, cardsWithInvalidData)
      expect(dataIsValid).toBe(false)
    })
  })
})