const {
  errorHandler,
  validateNewCardSetObject,
  validateUpdatedCardSetObject,
  validateExistingCardObject,
  validateCardObjectAddedToCardSet,
  validateNewUserObject,
  validateUpdatedUserObject,
  validateNewDeckObject,
  validateUpdatedDeckObject
} = require('../utils/middleware')

const {
  testCardSets,
  testCards,
  testCardsWithId,
  testUsers,
  testDecks,
  testDecksWithId,
  testUpdatedCards,
  testCardSetsWithId,
  newDeck
} = require('./test_data')

const {
  transformKeysFromSnakeCaseToCamelCase,
  getAllInvalidCardsFromUpdatedCards,
  getDeckCardUpdateObject
} = require('./test_helpers')

const validCardSetWithCards = {
  ...testCardSets[0],
  cards: testCards.map(card => ({ ...card }) )
}

const cardSetWithoutName = {
  description: testCardSets[0].description,
  cards: testCards.map(card => ({ ...card }) )
}

const cardSetWithoutDescription = {
  name: testCardSets[0].name,
  cards: testCards.map(card => ({ ...card }) )
}

const cardSetWithoutCardsProperty = {
  ...testCardSets[0]
}

class MockResponse {
  constructor() {
    this.statusValue = null
    this.jsonValue = null
  }

  status(statusCode) {
    this.statusValue = statusCode
    return this
  }

  json(object) {
    this.jsonValue = object
    return this
  }
}

class MockRequest {
  constructor(data) {
    this.body = data
  }
}

describe('Error handler responds', () => {
  describe('when SequelizeValidationError', () => {
    test('with status code 400', () => {
      const mockResponse = new MockResponse()

      const error = {
        name: 'SequelizeValidationError',
        message: 'validation failed'
      }

      const response = errorHandler(error, null, mockResponse)

      expect(response.statusValue).toBe(400)
    })

    test('with expected error message', () => {
      const mockResponse = new MockResponse()

      const error = {
        name: 'SequelizeValidationError',
        message: 'validation failed'
      }

      const response = errorHandler(error, null, mockResponse)

      expect(response.jsonValue).toMatchObject({ error: error.message })
    })
  })

  describe('when SequelizeDatabaseError', () => {
    test('with status code 400', () => {
      const mockResponse = new MockResponse()

      const error = {
        name: 'SequelizeValidationError',
        message: 'validation failed'
      }

      const response = errorHandler(error, null, mockResponse)

      expect(response.statusValue).toBe(400)
    })

    test('with expected error message', () => {
      const mockResponse = new MockResponse()

      const error = {
        name: 'SequelizeValidationError',
        message: 'validation failed'
      }

      const response = errorHandler(error, null, mockResponse)

      expect(response.jsonValue).toMatchObject({ error: error.message })
    })
  })
})

describe('Set cards validator', () => {
  describe('when new set cards', () => {
    test('when set cards is valid does not raise an error and next is called once', () => {
      const mockNext = jest.fn()
      const mockRequest = new MockRequest(validCardSetWithCards)

      validateNewCardSetObject(mockRequest, null, mockNext)

      expect(mockNext).toHaveBeenCalledTimes(1)
    })

    describe('when set cards is invalid', () => {
      test('next function is not called', () => {
        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSetWithoutCardsProperty)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          // not doing anything because we testing if next is called
        }

        expect(mockNext).toHaveBeenCalledTimes(0)
      })
    })

    describe('when property "cards" is invalid', () => {
      test('raises InvalidDataError when a string', () => {
        let thrownError

        const cardSet = { cardSetWithoutCardsProperty, cards: 'this is a string' }

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSet)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError).toBeDefined()
        expect(thrownError.name).toBe('InvalidDataError')
      })

      test('raises InvalidDataError when missing', () => {
        let thrownError

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSetWithoutCardsProperty)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError).toBeDefined()
        expect(thrownError.name).toBe('InvalidDataError')
      })

      test('error object has invalidProperties property with array of length 1', () => {
        let thrownError

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSetWithoutCardsProperty)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        const properties = Object.keys(thrownError.invalidProperties)

        expect(thrownError).toBeDefined()
        expect(properties).toHaveLength(1)
      })

      test('error object has invalidProperties property with the item "cards" in it', () => {
        let thrownError

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSetWithoutCardsProperty)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError).toBeDefined()
        expect(thrownError.invalidProperties).toHaveProperty('cards')
      })
    })

    describe('when property "name" is invalid', () => {
      test('raises InvalidDataError when not a string', () => {
        let thrownError

        const cardSet = { ...validCardSetWithCards, name: [] }

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSet)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError).toBeDefined()
        expect(thrownError.name).toBe('InvalidDataError')
      })

      it('raises InvalidDataError when missing', () => {
        let thrownError

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSetWithoutName)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError).toBeDefined()
        expect(thrownError.name).toBe('InvalidDataError')
      })

      test('error object has invalidProperties property with array of length 1', () => {
        let thrownError

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSetWithoutName)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        const properties = Object.keys(thrownError.invalidProperties)

        expect(thrownError).toBeDefined()
        expect(properties).toHaveLength(1)
      })

      test('error object has invalidProperties property with the item "cards" in it', () => {
        let thrownError

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSetWithoutName)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError).toBeDefined()
        expect(thrownError.invalidProperties).toHaveProperty('name')
      })
    })

    describe('when property "description" is invalid', () => {
      test('raises InvalidDataError when not a string', () => {
        let thrownError

        const cardSet = { ...validCardSetWithCards, description: {} }

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSet)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError).toBeDefined()
        expect(thrownError.name).toBe('InvalidDataError')
      })

      test('raises InvalidDataError when missing', () => {
        let thrownError

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSetWithoutDescription)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError).toBeDefined()
        expect(thrownError.name).toBe('InvalidDataError')
      })

      test('error object has invalidProperties property with array of length 1', () => {
        let thrownError

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSetWithoutDescription)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        const properties = Object.keys(thrownError.invalidProperties)

        expect(thrownError).toBeDefined()
        expect(properties).toHaveLength(1)
      })

      test('error object has invalidProperties property with the item "description" in it', () => {
        let thrownError

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSetWithoutDescription)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError).toBeDefined()
        expect(thrownError.invalidProperties).toHaveProperty('description')
      })
    })

    describe('when multiple properties are invalid', () => {
      test('raises InvalidDataError when the wrong type', () => {
        let thrownError

        const cardSet = {
          name: 'this is a string',
          description: {},
          cards: 'this is a string'
        }

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSet)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError).toBeDefined()
        expect(thrownError.name).toBe('InvalidDataError')
      })

      test('raises InvalidDataError when missing', () => {
        let thrownError

        const cardSet = { name: 'this is a string' }

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSet)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError).toBeDefined()
        expect(thrownError.name).toBe('InvalidDataError')
      })

      test('error object has invalidProperties property with array of length 2', () => {
        let thrownError

        const cardSet = {
          name: 'this is a string',
          cards: 'this is a string'
        }

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSet)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        const properties = Object.keys(thrownError.invalidProperties)

        expect(thrownError).toBeDefined()
        expect(properties).toHaveLength(2)
      })

      test('error object has expected invalid properties', () => {
        let thrownError

        const cardSet = {
          name: 'this is a string',
          cards: 'this is a string'
        }

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSet)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError).toBeDefined()
        expect(thrownError.invalidProperties).toHaveProperty('description', 'MISSING')
        expect(thrownError.invalidProperties).toHaveProperty('cards', 'INVALID')
      })
    })

    describe('when unnecessary properties', () => {
      test('throws InvalidDataError when object has unnecessary property', () => {
        let thrownError

        const cardSet = { ...validCardSetWithCards }
        cardSet.extra = 'this is extra'

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSet)

        try {
          validateNewCardSetObject(mockRequest, null, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError).toBeDefined()
        expect(thrownError.name).toBe('InvalidDataError')
      })

      test('error object has the right information', () => {
        let thrownError

        const cardSet = { ...validCardSetWithCards }
        cardSet.extra = 'this is extra'

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSet)

        try {
          validateNewCardSetObject(mockRequest, null, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError.invalidProperties).toHaveProperty('extra', 'UNEXPECTED')
      })

      test('error object has the right information when invalid in all categories', () => {
        let thrownError

        const cardSet = { ...validCardSetWithCards, cards: [ ... validCardSetWithCards.cards ] }
        cardSet.extra = 'this is extra'
        cardSet.description = ['this is an array']
        delete cardSet.name

        delete cardSet.cards[3].rulesText
        cardSet.cards[3].cardNumber = 'this is a string'
        cardSet.cards[4].extra = 'this is extra'

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSet)

        try {
          validateNewCardSetObject(mockRequest, null, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError.invalidProperties).toHaveProperty('extra', 'UNEXPECTED')
        expect(thrownError.invalidProperties).toHaveProperty('description', 'INVALID')
        expect(thrownError.invalidProperties).toHaveProperty('name', 'MISSING')
        expect(thrownError.invalidProperties).toHaveProperty('cardObjects')

        const cardObjects = thrownError.invalidProperties.cardObjects

        expect(cardObjects[0]).toHaveProperty('index', '3')
        expect(cardObjects[0]).toHaveProperty('rulesText', 'MISSING')
        expect(cardObjects[0]).toHaveProperty('cardNumber', 'INVALID')

        expect(cardObjects[1]).toHaveProperty('index', '4')
        expect(cardObjects[1]).toHaveProperty('extra', 'UNEXPECTED')
      })
    })

    describe('when cards in the card property are invalid', () => {
      test('throws InvalidDataError when one card is missing a property', () => {
        let thrownError

        const cardSet = { ...validCardSetWithCards, cards: [ ...validCardSetWithCards.cards ] }

        delete cardSet.cards[0].name

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSet)

        try {
          validateNewCardSetObject(mockRequest, null, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError).toBeDefined()
        expect(thrownError.name).toBe('InvalidDataError')
      })

      test('returns expected info about what is invalid when one card is missing a property', () => {
        let thrownError

        const cardSet = { ...validCardSetWithCards, cards: [ ...validCardSetWithCards.cards ] }
        delete cardSet.cards[0].name

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSet)

        try {
          validateNewCardSetObject(mockRequest, null, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError.invalidProperties).toHaveProperty('cardObjects')

        const invalidCards = thrownError.invalidProperties.cardObjects
        const invalidCardInfo = invalidCards[0]

        expect(invalidCardInfo).toHaveProperty('index', '0')
        expect(invalidCardInfo).toHaveProperty('name', 'MISSING')
      })
    })
  })
  describe('when card set is updated', () => {
    const existingCardSet = transformKeysFromSnakeCaseToCamelCase(testCardSetsWithId[0])
    const cardSetCardsInSnakeCase = testCardsWithId.filter(card => card.card_set_id === 1)
    const cardSetCards = cardSetCardsInSnakeCase
      .map(card => transformKeysFromSnakeCaseToCamelCase(card))

    describe('when valid card set', () => {
      describe('passes through', () => {
        test('when only set card info has been change', async() => {
          const updatedCardSet = {
            ...existingCardSet,
            cards: getDeckCardUpdateObject([], [], [])
          }

          updatedCardSet.name = 'Updated name'

          const mockNext = jest.fn()
          const mockRequest = new MockRequest(updatedCardSet)

          try {
            validateUpdatedCardSetObject(mockRequest, null, mockNext)
          } catch(error) {
            // intentionally left empty
          }

          expect(mockNext).toHaveBeenCalledTimes(1)
        })

        test('when cards have been changed', async() => {
          const newCard = { ...testCards[0] }
          newCard.cardSetId = 1
          const updatedCard = { ...cardSetCards[1] }
          updatedCard.name = 'Changed name'
          const deletedCard = { ...cardSetCards[2] }

          const updatedCardSet = {
            ...existingCardSet,
            cards: getDeckCardUpdateObject([newCard], [updatedCard], [deletedCard])
          }


          const mockNext = jest.fn()
          const mockRequest = new MockRequest(updatedCardSet)

          try {
            validateUpdatedCardSetObject(mockRequest, null, mockNext)
          } catch(error) {
            // intentionally left empty
          }

          expect(mockNext).toHaveBeenCalledTimes(1)
        })
      })
    })
    describe('when invalid card set', () => {
      describe('returns expected error information', () => {
        test('when invalid card set info', () => {
          let thrownError

          const invalidProperties = {
            description: 'INVALID',
            extra: 'UNEXPECTED'
          }

          const invalidCardSet = {
            ...existingCardSet,
            description: ['this is invalid description'],
            extra: 'this is extra',
            cards: getDeckCardUpdateObject([], [], [])
          }

          const mockNext = jest.fn()
          const mockRequest = new MockRequest(invalidCardSet)
          const mockResponse = new MockResponse()

          try {
            validateUpdatedCardSetObject(mockRequest, mockResponse, mockNext)
          } catch(error) {
            thrownError = error
          }

          expect(thrownError.name).toBe('InvalidDataError')
          expect(thrownError.invalidProperties).toEqual(invalidProperties)
        })

        test('when invalid cards', () => {
          let thrownError

          const invalidProperties = {
            cards: 'INVALID',
            cardObjects: {
              added: [
                {
                  cardNumber: 'INVALID',
                  index: '0'
                },
                {
                  rulesText: 'INVALID',
                  index: '2'
                }
              ],
              updated: [
                {
                  name: 'INVALID',
                  index: '0'
                }
              ],
              deleted: [
                {
                  id: 'MISSING',
                  index: '0'
                }
              ]
            }
          }

          const firstNewCard = { ...testCards[0] }
          firstNewCard.cardNumber = 0.4
          firstNewCard.cardSetId = 1
          const secondNewCard = { ...testCards[1] }
          secondNewCard.cardSetId = 1
          const thirdNewCard = { ...testCards[2] }
          thirdNewCard.cardSetId = 1
          thirdNewCard.rulesText = 0.4
          const updatedCard = { ...cardSetCards[2] }
          updatedCard.name =  ['not valid']
          const deletedCard = { ...cardSetCards[3] }
          delete deletedCard.id

          const addedCards = [firstNewCard, secondNewCard, thirdNewCard]

          const invalidCardSet = {
            ...existingCardSet,
            cards: getDeckCardUpdateObject(addedCards, [updatedCard], [deletedCard])
          }

          const mockNext = jest.fn()
          const mockRequest = new MockRequest(invalidCardSet)
          const mockResponse = new MockResponse()

          try {
            validateUpdatedCardSetObject(mockRequest, mockResponse, mockNext)
          } catch(error) {
            thrownError = error
          }

          expect(thrownError.name).toBe('InvalidDataError')
          expect(thrownError.invalidProperties).toEqual(invalidProperties)
        })
      })
    })
  })
})

describe('Received card validator', () => {
  describe('when existing card', () => {
    test('does not raise an error when card is valid', () => {
      const existingCard = transformKeysFromSnakeCaseToCamelCase(testCardsWithId[0])

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(existingCard)

      try {
        validateExistingCardObject(mockRequest, null, mockNext)
      } catch(error) {
        // intentionally left empty
      }
      expect(mockNext).toBeCalledTimes(1)
    })

    test('raises expected error when card is invalid', () => {
      let thrownError
      const existingCard = transformKeysFromSnakeCaseToCamelCase(testCardsWithId[0])
      existingCard.name = []
      delete existingCard.rulesText
      existingCard.extra = 'this is extra'

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(existingCard)

      try {
        validateExistingCardObject(mockRequest, null, mockNext)
      } catch(error) {
        thrownError = error
      }

      const invalidPropertyNames = Object.keys(thrownError.invalidProperties)

      expect(thrownError.name).toBe('InvalidDataError')
      expect(invalidPropertyNames).toHaveLength(3)
      expect(thrownError.invalidProperties).toHaveProperty('name', 'INVALID')
      expect(thrownError.invalidProperties).toHaveProperty('rulesText', 'MISSING')
      expect(thrownError.invalidProperties).toHaveProperty('extra', 'UNEXPECTED')
    })
  })

  describe('when new card is added to existing a card set', () => {
    test('does not raise an error when card is valid', () => {
      const card = transformKeysFromSnakeCaseToCamelCase(testCardsWithId[0])
      delete card.id

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(card)

      try {
        validateCardObjectAddedToCardSet(mockRequest, null, mockNext)
      } catch(error) {
        // intentionally left empty
      }

      expect(mockNext).toBeCalledTimes(1)
    })

    test('raises expected error when card is invalid', () => {
      let thrownError
      const card = transformKeysFromSnakeCaseToCamelCase(testCardsWithId[0])
      delete card.id

      card.name = []
      card.extra = 'this is extra'

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(card)

      try {
        validateCardObjectAddedToCardSet(mockRequest, null, mockNext)
      } catch(error) {
        thrownError = error
      }

      const invalidPropertyNames = Object.keys(thrownError.invalidProperties)

      expect(thrownError.name).toBe('InvalidDataError')
      expect(invalidPropertyNames).toHaveLength(2)
      expect(thrownError.invalidProperties).toHaveProperty('name', 'INVALID')
      expect(thrownError.invalidProperties).toHaveProperty('extra', 'UNEXPECTED')
    })
  })
})

describe('Received user validator', () => {
  describe('when new user is added', () => {
    test('does not raise an error when user is valid', () => {
      const user = testUsers[0]

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(user)

      try {
        validateNewUserObject(mockRequest, null, mockNext)
      } catch(error) {
        // intentionally left empty
      }

      expect(mockNext).toBeCalledTimes(1)
    })

    test('raises expected error when user is invalid', () => {
      let thrownError
      const user = testUsers[0]

      user.username = []
      user.extra = 'this is extra'

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(user)

      try {
        validateNewUserObject(mockRequest, null, mockNext)
      } catch(error) {
        thrownError = error
      }

      const invalidPropertyNames = Object.keys(thrownError.invalidProperties)

      expect(thrownError.name).toBe('InvalidDataError')
      expect(invalidPropertyNames).toHaveLength(2)
      expect(thrownError.invalidProperties).toHaveProperty('username', 'INVALID')
      expect(thrownError.invalidProperties).toHaveProperty('extra', 'UNEXPECTED')
    })
  })

  describe('when user is updated', () => {
    test('does not raise an error when user is valid', () => {
      const user = { username: 'zerocool' }

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(user)

      try {
        validateUpdatedUserObject(mockRequest, null, mockNext)
      } catch(error) {
        // intentionally left empty
      }

      expect(mockNext).toBeCalledTimes(1)
    })

    test('raises expected error when user is invalid', () => {
      let thrownError
      const user = (testUsers[0])

      user.username = []
      user.extra = 'this is extra'

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(user)

      try {
        validateNewUserObject(mockRequest, null, mockNext)
      } catch(error) {
        thrownError = error
      }

      const invalidPropertyNames = Object.keys(thrownError.invalidProperties)

      expect(thrownError.name).toBe('InvalidDataError')
      expect(invalidPropertyNames).toHaveLength(2)
      expect(thrownError.invalidProperties).toHaveProperty('username', 'INVALID')
      expect(thrownError.invalidProperties).toHaveProperty('extra', 'UNEXPECTED')
    })
  })
})

describe('Received deck validator', () => {
  describe('when new deck is added', () => {
    test('does not raise an error when valid', () => {
      const data = {
        ...newDeck,
        cards: newDeck.cards.map(card => ({ ...card }))
      }

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(data)

      try {
        validateNewDeckObject(mockRequest, null, mockNext)
      } catch(error) {
        // intentionally left empty
      }

      expect(mockNext).toBeCalledTimes(1)
    })

    test('raise an error when invalid', () => {
      let thrownError
      const data = {
        ...newDeck,
        cards: newDeck.cards.map(card => ({ ...card }))
      }

      data.notes = []
      data.cards[0].cardSetId = 1

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(data)

      try {
        validateNewDeckObject(mockRequest, null, mockNext)
      } catch(error) {
        thrownError = error
      }

      const invalidPropertyNames = Object.keys(thrownError.invalidProperties)

      expect(thrownError.name).toBe('InvalidDataError')
      expect(invalidPropertyNames).toHaveLength(3)
      expect(thrownError.invalidProperties).toHaveProperty('notes', 'INVALID')
    })

  })

  describe('when deck is updated', () => {
    describe('raises an error when what to updated is not defined in parameters', () => {
      let thrownError
      const expectedObject = { update: 'information or cards' }

      const data = { ...testDecksWithId[0] }
      const deckInfo = transformKeysFromSnakeCaseToCamelCase(data)

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(deckInfo)

      try {
        validateUpdatedDeckObject(mockRequest, null, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError.name).toBe('RequestParameterError')
      expect(thrownError.message).toBe('A request parameter is needed')
      expect(thrownError.missingParameters).toEqual(expectedObject)
    })

    describe.only('raises an error when update parameter is invalid', () => {
      let thrownError
      const expectedObject = { update: 'should be information or cards' }

      const data = { ...testDecksWithId[0] }
      const deckInfo = transformKeysFromSnakeCaseToCamelCase(data)

      const mockNext = jest.fn()
      const mockRequest = new MockRequest(deckInfo)

      mockRequest.query = { update: 'invalid_parameter' }

      try {
        validateUpdatedDeckObject(mockRequest, null, mockNext)
      } catch(error) {
        thrownError = error
      }

      expect(thrownError.name).toBe('RequestParameterError')
      expect(thrownError.message).toBe('Invalid parameter')
      expect(thrownError.missingParameters).toEqual(expectedObject)
    })

    describe('deck information',() => {
      test('does not raise an error when valid', () => {
        const data = { ...testDecksWithId[0] }
        const deckInfo = transformKeysFromSnakeCaseToCamelCase(data)

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(deckInfo)

        mockRequest.query = { update: 'information' }

        try {
          validateUpdatedDeckObject(mockRequest, null, mockNext)
        } catch(error) {
          // intentionally left empty
        }

        expect(mockNext).toBeCalledTimes(1)
      })

      test('raises expected error when invalid', () => {
        let thrownError

        const data = { ...testDecksWithId[0] }
        const deckInfo = transformKeysFromSnakeCaseToCamelCase(data)

        deckInfo.notes = []
        deckInfo.extra = 'this is extra'

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(deckInfo)

        mockRequest.query = { update: 'information' }

        try {
          validateUpdatedDeckObject(mockRequest, null, mockNext)
        } catch(error) {
          thrownError = error
        }

        const invalidPropertyNames = Object.keys(thrownError.invalidProperties)

        expect(thrownError.name).toBe('InvalidDataError')
        expect(invalidPropertyNames).toHaveLength(2)
        expect(thrownError.invalidProperties).toHaveProperty('notes', 'INVALID')
        expect(thrownError.invalidProperties).toHaveProperty('extra', 'UNEXPECTED')
      })
    })

    describe('when cards are updated', () => {
      describe('when existing cards are updated', () => {
        test('does not raise an error when cards are valid', () => {
          const updatedCards = [
            { ...testUpdatedCards[0] },
            { ...testUpdatedCards[1] }
          ]

          const cardObject = {
            'added': [],
            'updated': updatedCards,
            'deleted': []
          }

          const mockNext = jest.fn()
          const mockRequest = new MockRequest(cardObject)

          mockRequest.query = { update: 'cards' }

          try {
            validateUpdatedDeckObject(mockRequest, null, mockNext)
          } catch(error) {
            // intentionally left empty
          }

          expect(mockNext).toBeCalledTimes(1)
        })

        test('raises expected errors when cards are valid', () => {
          let thrownError

          const updatedCards = [
            { ...testUpdatedCards[0] },
            { ...testUpdatedCards[1] }
          ]

          updatedCards[0].sideboard = 4
          delete updatedCards[1].nInDeck

          const cardObject = {
            'added': [],
            'updated': updatedCards,
            'deleted': []
          }

          const mockNext = jest.fn()
          const mockRequest = new MockRequest(cardObject)

          mockRequest.query = { update: 'cards' }

          try {
            validateUpdatedDeckObject(mockRequest, null, mockNext)
          } catch(error) {
            thrownError = error
          }

          const invalidCards = getAllInvalidCardsFromUpdatedCards(thrownError.invalidProperties)

          const firstInvalidCard = thrownError.invalidProperties.updated[0]
          const secondInvalidCard = thrownError.invalidProperties.updated[1]

          const keysOfFirstErrorInfo = Object.keys(firstInvalidCard)
          const keysOfSecondErrorInfo = Object.keys(firstInvalidCard)

          expect(thrownError.name).toBe('InvalidDataError')
          expect(invalidCards).toHaveLength(2)

          expect(firstInvalidCard).toHaveProperty('index', '0')
          expect(firstInvalidCard).toHaveProperty('sideboard', 'INVALID')
          expect(keysOfFirstErrorInfo).toHaveLength(2)

          expect(secondInvalidCard).toHaveProperty('index', '1')
          expect(secondInvalidCard).toHaveProperty('nInDeck', 'MISSING')
          expect(keysOfSecondErrorInfo).toHaveLength(2)
        })
      })
    })
  })
})