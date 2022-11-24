import {
  getCardColor,
  getManaSymbols,
  transformCardTextToArray
} from '../utils/card_property_utils'
import { cardsOfEachType } from './test_data'

describe('getCardColor(card)', () => {
  describe('returns', () => {
    describe('\'black\'', () => {
      test('when mana cost is \'black\'', () => {
        const cardColor = getCardColor(cardsOfEachType.onlyBlack)
        expect(cardColor).toBe('black')
      })
      test('when mana cost is \'x black black\'', () => {
        const cardColor = getCardColor(cardsOfEachType.blackWithColorless)
        expect(cardColor).toBe('black')
      })
    })
    describe('\'blue\'', () => {
      test('when mana cost is \'blue\'', () => {
        const cardColor = getCardColor(cardsOfEachType.onlyBlue)
        expect(cardColor).toBe('blue')
      })
      test('when mana cost is \'2 blue\'', () => {
        const cardColor = getCardColor(cardsOfEachType.blueWithColorless)
        expect(cardColor).toBe('blue')
      })
    })
    describe('\'green\'' , () => {
      test('when mana cost is \'green\'', () => {
        const cardColor = getCardColor(cardsOfEachType.onlyGreen)
        expect(cardColor).toBe('green')
      })
      test('when mana cost is \'3 green green\'', () => {
        const cardColor = getCardColor(cardsOfEachType.greenWithColorless)
        expect(cardColor).toBe('green')
      })
    })
    describe('\'red\'', () => {
      test('when mana cost is \'red\'', () => {
        const cardColor = getCardColor(cardsOfEachType.onlyRed)
        expect(cardColor).toBe('red')
      })
      test('when mana cost is \'2 red red\'', () => {
        const cardColor = getCardColor(cardsOfEachType.redWithColorless)
        expect(cardColor).toBe('red')
      })
    })
    describe('\'white\'', () => {
      test('when mana cost is \'white\'', () => {
        const cardColor = getCardColor(cardsOfEachType.onlyWhite)
        expect(cardColor).toBe('white')
      })
      test('when mana cost is \'2 white white white\'', () => {
        const cardColor = getCardColor(cardsOfEachType.whiteWithColorless)
        expect(cardColor).toBe('white')
      })
    })
    describe('\'multicolor\'', () => {
      test('when mana cost is \'white blue\'', () => {
        const cardColor = getCardColor(cardsOfEachType.whiteAndBlue)
        expect(cardColor).toBe('multicolor')
      })
      test('when mana cost is \'2 black green\'', () => {
        const cardColor = getCardColor(cardsOfEachType.blackAndGreenWithColorless)
        expect(cardColor).toBe('multicolor')
      })
    }),
    describe('\'colorless\'', () => {
      test('when mana cost is \'2\'', () => {
        const cardColor = getCardColor(cardsOfEachType.colorlessArtifact)
        expect(cardColor).toBe('colorless')
      })
    })
    describe('\'land\'', () => {
      test('when mana cost is \'\'', () => {
        const cardColor = getCardColor(cardsOfEachType.land)
        expect(cardColor).toBe('land')
      })
    })
  })
})

describe('getManaSymbols(card)', () => {
  describe('returns', () => {
    describe('[\'B\']', () => {
      test('when mana cost is \'black\'', () => {
        const cardColor = getManaSymbols(cardsOfEachType.onlyBlack)
        expect(cardColor).toEqual(['B'])
      })
    })
    describe('[\'X\', \'B\', \'B\']', () => {
      test('when mana cost is \'x black black\'', () => {
        const cardColor = getManaSymbols(cardsOfEachType.blackWithColorless)
        expect(cardColor).toEqual(['X', 'B', 'B'])
      })
    })
    describe('[\'U\']', () => {
      test('when mana cost is \'blue\'', () => {
        const cardColor = getManaSymbols(cardsOfEachType.onlyBlue)
        expect(cardColor).toEqual(['U'])
      })
    })
    describe('[\'2\', \'U\']', () => {
      test('when mana cost is \'2 blue\'', () => {
        const cardColor = getManaSymbols(cardsOfEachType.blueWithColorless)
        expect(cardColor).toEqual(['2', 'U'])
      })
    })
    describe('[\'G\']' , () => {
      test('when mana cost is \'green\'', () => {
        const cardColor = getManaSymbols(cardsOfEachType.onlyGreen)
        expect(cardColor).toEqual(['G'])
      })
    })
    describe('[\'3\', \'G\', \'G\']', () => {
      test('when mana cost is \'3 green green\'', () => {
        const cardColor = getManaSymbols(cardsOfEachType.greenWithColorless)
        expect(cardColor).toEqual(['3', 'G', 'G'])
      })
    })

    describe('[\'R\']', () => {
      test('when mana cost is \'red\'', () => {
        const cardColor = getManaSymbols(cardsOfEachType.onlyRed)
        expect(cardColor).toEqual(['R'])
      })
    })
    describe('[\'2\', \'R\', \'R\']', () => {
      test('when mana cost is \'2 red red\'', () => {
        const cardColor = getManaSymbols(cardsOfEachType.redWithColorless)
        expect(cardColor).toEqual(['2', 'R', 'R'])
      })
    })
    describe('[\'W\']', () => {
      test('when mana cost is \'white\'', () => {
        const cardColor = getManaSymbols(cardsOfEachType.onlyWhite)
        expect(cardColor).toEqual(['W'])
      })
    })
    describe('[\'2\', \'W\', \'W\', \'W\']', () => {
      test('when mana cost is \'2 white white white\'', () => {
        const cardColor = getManaSymbols(cardsOfEachType.whiteWithColorless)
        expect(cardColor).toEqual(['2', 'W', 'W', 'W'])
      })
    })
    describe('[\'W\', \'U\']', () => {
      test('when mana cost is \'white blue\'', () => {
        const cardColor = getManaSymbols(cardsOfEachType.whiteAndBlue)
        expect(cardColor).toEqual(['W', 'U'])
      })
    })
    describe('[\'2\', \'B\', \'G\']', () => {
      test('when mana cost is \'2 black green\'', () => {
        const cardColor = getManaSymbols(cardsOfEachType.blackAndGreenWithColorless)
        expect(cardColor).toEqual(['2', 'B', 'G'])
      })
    })
    describe('[\'2\']', () => {
      test('when mana cost is \'2\'', () => {
        const cardColor = getManaSymbols(cardsOfEachType.colorlessArtifact)
        expect(cardColor).toEqual(['2'])
      })
    })
    describe('[]', () => {
      test('when mana cost is \'\'', () => {
        const cardColor = getManaSymbols(cardsOfEachType.land)
        expect(cardColor).toEqual([])
      })
    })
  })
})
describe('transformCardTextToArray(description)', () => {
  test('transforms card that has single newlines to an array', () => {
    const card = {
      rulesText: 'This is a card. It has attributes.\nThis is a new line.\nThis is new line also.'
    }

    const transformation = transformCardTextToArray(card)

    const expectedArray = [
      'This is a card. It has attributes.',
      'This is a new line.',
      'This is new line also.'
    ]

    expect(transformation).toEqual(expectedArray)
  })
  test('transforms description that has double newlines to an expected array', () => {
    const card = {
      rulesText: 'This is a card. It has attributes.\n\n//\n\nThis is new line also.'
    }

    const transformation = transformCardTextToArray(card)

    const expectedArray = [
      'This is a card. It has attributes.',
      '//',
      'This is new line also.'
    ]

    expect(transformation).toEqual(expectedArray)
  })
})