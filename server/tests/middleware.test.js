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
  testDecksWithId,
  testUpdatedCards,
  testCardSetsWithId,
  newDeck,
  testCardUpdatesOnDeckWithIdOne
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

const invalidDataErrorInformationBase = {
  name: 'InvalidDataError',
  message: 'Invalid or missing data',
  invalidProperties: 'change this'
}

const invalidRequestParameterErrorInformationBase = {
  name: 'RequestParameterError',
  message: 'change this',
  invalidProperties: 'change this'
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

describe('Error handling responds', () => {
  describe('if SequelizeValidationError', () => {
    let receivedData
    let error

    beforeAll(() => {
      const mockResponse = new MockResponse()

      error = {
        name: 'SequelizeValidationError',
        message: 'validation failed'
      }

      receivedData = errorHandler(error, null, mockResponse)
    })

    test('with 400', () => {
      expect(receivedData.statusValue).toBe(400)
    })

    test('with expected error information', () => {
      const errorInformation = receivedData.jsonValue
      expect(errorInformation).toMatchObject({ error: error.message })
    })
  })

  describe('if SequelizeDatabaseError', () => {
    let receivedData
    let error

    beforeAll(() => {
      const mockResponse = new MockResponse()

      error = {
        name: 'SequelizeValidationError',
        message: 'validation failed'
      }

      receivedData = errorHandler(error, null, mockResponse)
    })

    test('with 400', () => {
      expect(receivedData.statusValue).toBe(400)
    })

    test('with expected error message', () => {
      const errorInformation = receivedData.jsonValue
      expect(errorInformation).toMatchObject({ error: error.message })
    })
  })

  describe('if SequelizeUniqueConstraintError', () => {
    let receivedData
    let error

    beforeAll(() => {
      const mockResponse = new MockResponse()

      error = {
        name: 'SequelizeUniqueConstraintError',
        message: 'Validation error',
        fields: { field: 'duplicate' }
      }

      receivedData = errorHandler(error, null, mockResponse)
    })

    test('with 400', () => {
      expect(receivedData.statusValue).toBe(400)
    })

    test('with expected error information', () => {
      const expectedObject = {
        error: 'Validation error',
        invalidProperties: {
          field: 'EXISTS'
        }
      }

      const errorInformation = receivedData.jsonValue
      expect(errorInformation).toEqual(expectedObject)
    })
  })

  describe('if RequestParameterError', () => {
    let receivedData
    let error

    beforeAll(() => {
      const mockResponse = new MockResponse()

      error = {
        name: 'RequestParameterError',
        message: 'Request parameter error',
        missingParameters: 'Should have parameters'
      }

      receivedData = errorHandler(error, null, mockResponse)
    })

    test('with 400', () => {
      expect(receivedData.statusValue).toBe(400)

    })

    test('with expected object', () => {
      const expectedObject = {
        error: 'Request parameter error',
        missingParameters: 'Should have parameters'
      }

      const receivedObject = receivedData.jsonValue

      expect(receivedObject).toEqual(expectedObject)
    })
  })

  describe('if InvalidDataError', () => {
    let receivedData
    let error

    beforeAll(() => {
      const mockResponse = new MockResponse()

      error = {
        name: 'InvalidDataError',
        message: 'Invalid or missing data',
        invalidProperties: {
          name: 'INVALID',
          id: 'MISSING'
        }
      }

      receivedData = errorHandler(error, null, mockResponse)
    })

    test('with 400', () => {
      expect(receivedData.statusValue).toBe(400)
    })

    test('with expected object', () => {
      const expectedObject = {
        error: 'Invalid or missing data',
        invalidProperties: {
          name: 'INVALID',
          id: 'MISSING'
        }
      }

      const receivedObject = receivedData.jsonValue

      expect(receivedObject).toEqual(expectedObject)
    })
  })

  describe('if InvalidResourceId', () => {
    let receivedData
    let error

    beforeAll(() => {
      const mockResponse = new MockResponse()

      error = {
        name: 'InvalidResourceId',
        message: 'Invalid id type',
        expectedType: 'INTEGER'
      }

      receivedData = errorHandler(error, null, mockResponse)
    })

    test('with 400', () => {
      expect(receivedData.statusValue).toBe(400)
    })

    test('with expected object', () => {
      const expectedObject = {
        error: 'Invalid id type',
        expectedType: 'INTEGER'
      }

      const receivedObject = receivedData.jsonValue

      expect(receivedObject).toEqual(expectedObject)
    })
  })
})

describe('Validating card set object', () => {
  describe('when new', () => {
    describe('if valid', () => {
      test('card set passes through', () => {
        const mockNext = jest.fn()
        const mockRequest = new MockRequest(validCardSetWithCards)

        validateNewCardSetObject(mockRequest, null, mockNext)

        expect(mockNext).toHaveBeenCalledTimes(1)
      })
    })

    describe('if invalid', () => {
      test('card set does not pass through', () => {
        const mockNext = jest.fn()
        const mockRequest = new MockRequest(cardSetWithoutCardsProperty)
        const mockResponse = new MockResponse()

        try {
          validateNewCardSetObject(mockRequest, mockResponse, mockNext)
        } catch(error) {
          // intentionally left empty
        }

        expect(mockNext).toHaveBeenCalledTimes(0)
      })

      describe('when object property \'cards\' is not valid', () => {
        describe('returns expected error information', () => {
          test('when not an array', () => {
            let thrownError

            const expectedObject = { ...invalidDataErrorInformationBase, invalidProperties: { cards: 'INVALID' } }
            const cardSet = { ...cardSetWithoutCardsProperty, cards: 'this is a string' }

            const mockNext = jest.fn()
            const mockRequest = new MockRequest(cardSet)
            const mockResponse = new MockResponse()

            try {
              validateNewCardSetObject(mockRequest, mockResponse, mockNext)
            } catch(error) {
              thrownError = error
            }

            expect(thrownError).toBeDefined()
            expect(thrownError.name).toEqual(expectedObject.name)
            expect(thrownError.message).toEqual(expectedObject.message)
            expect(thrownError.invalidProperties).toEqual(expectedObject.invalidProperties)
          })

          test('when missing', () => {
            let thrownError

            const expectedObject = { ...invalidDataErrorInformationBase, invalidProperties: { cards: 'MISSING' } }
            const cardSet = { ...cardSetWithoutCardsProperty }

            const mockNext = jest.fn()
            const mockRequest = new MockRequest(cardSet)
            const mockResponse = new MockResponse()

            try {
              validateNewCardSetObject(mockRequest, mockResponse, mockNext)
            } catch(error) {
              thrownError = error
            }

            expect(thrownError).toBeDefined()
            expect(thrownError.name).toEqual(expectedObject.name)
            expect(thrownError.message).toEqual(expectedObject.message)
            expect(thrownError.invalidProperties).toEqual(expectedObject.invalidProperties)
          })
        })
      })

      describe('when object property \'name\' is invalid', () => {
        describe('returns expected error information', () => {
          test('when not a string', () => {
            let thrownError

            const expectedObject = { ...invalidDataErrorInformationBase, invalidProperties: { name: 'INVALID' } }
            const cardSet = {
              ...validCardSetWithCards,
              cards: testCards.map(card => ({ ...card })),
              name: ['not valid name']
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
            expect(thrownError.name).toEqual(expectedObject.name)
            expect(thrownError.message).toEqual(expectedObject.message)
            expect(thrownError.invalidProperties).toEqual(expectedObject.invalidProperties)
          })

          test('when missing', () => {
            let thrownError

            const expectedObject = { ...invalidDataErrorInformationBase, invalidProperties: { name: 'MISSING' } }
            const cardSet = {
              ...validCardSetWithCards,
              cards: testCards.map(card => ({ ...card })),
            }

            delete cardSet.name
            const mockNext = jest.fn()
            const mockRequest = new MockRequest(cardSet)
            const mockResponse = new MockResponse()

            try {
              validateNewCardSetObject(mockRequest, mockResponse, mockNext)
            } catch(error) {
              thrownError = error
            }

            expect(thrownError).toBeDefined()
            expect(thrownError.name).toEqual(expectedObject.name)
            expect(thrownError.message).toEqual(expectedObject.message)
            expect(thrownError.invalidProperties).toEqual(expectedObject.invalidProperties)
          })
        })
      })

      describe('when object property \'description\' is invalid', () => {
        describe('returns expected error information', () => {
          test('when not a string', () => {
            let thrownError

            const expectedObject = { ...invalidDataErrorInformationBase, invalidProperties: { description: 'INVALID' } }
            const cardSet = {
              ...validCardSetWithCards,
              cards: testCards.map(card => ({ ...card })),
              description: { invalid: 'description' }
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
            expect(thrownError.name).toEqual(expectedObject.name)
            expect(thrownError.message).toEqual(expectedObject.message)
            expect(thrownError.invalidProperties).toEqual(expectedObject.invalidProperties)
          })

          test('when missing', () => {
            let thrownError

            const expectedObject = { ...invalidDataErrorInformationBase, invalidProperties: { description: 'MISSING' } }
            const cardSet = {
              ...validCardSetWithCards,
              cards: testCards.map(card => ({ ...card })),
            }

            delete cardSet.description

            const mockNext = jest.fn()
            const mockRequest = new MockRequest(cardSet)
            const mockResponse = new MockResponse()

            try {
              validateNewCardSetObject(mockRequest, mockResponse, mockNext)
            } catch(error) {
              thrownError = error
            }

            expect(thrownError).toBeDefined()
            expect(thrownError.name).toEqual(expectedObject.name)
            expect(thrownError.message).toEqual(expectedObject.message)
            expect(thrownError.invalidProperties).toEqual(expectedObject.invalidProperties)
          })
        })
      })

      describe('when multiple properties are invalid', () => {
        test('returns expected error information', () => {
          let thrownError

          const expectedObject = {
            ...invalidDataErrorInformationBase,
            invalidProperties: {
              name: 'INVALID',
              description: 'INVALID',
              cards: 'MISSING',
            }
          }

          const cardSet = {
            name: [1,2,3,4],
            description: { invalid: 'description' }
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
          expect(thrownError.name).toEqual(expectedObject.name)
          expect(thrownError.message).toEqual(expectedObject.message)
          expect(thrownError.invalidProperties).toEqual(expectedObject.invalidProperties)
        })
      })

      describe('when unexpected properties', () => {
        test('returns expected error information', () => {
          let thrownError

          const expectedObject = {
            ...invalidDataErrorInformationBase,
            invalidProperties: {
              extra: 'UNEXPECTED',
            }
          }

          const cardSet = {
            ...validCardSetWithCards,
            cards: testCards.map(card => ({ ...card })),
            extra: 'this should not exist'
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
          expect(thrownError.name).toEqual(expectedObject.name)
          expect(thrownError.message).toEqual(expectedObject.message)
          expect(thrownError.invalidProperties).toEqual(expectedObject.invalidProperties)
        })
      })

      describe('when invalid cards', () => {
        test('returns expected error information', () => {
          let thrownError

          const expectedObject = {
            ...invalidDataErrorInformationBase,
            invalidProperties: {
              cards: 'INVALID',
              cardObjects: [
                {
                  index: '0',
                  name: 'MISSING'
                },
                {
                  index: '2',
                  manaCost: 'INVALID'
                },
                {
                  index: '3',
                  extra: 'UNEXPECTED'
                }
              ]
            }
          }

          const cardSet = {
            ...validCardSetWithCards,
            cards: testCards.map(card => ({ ...card })),
          }

          delete cardSet.cards[0].name
          cardSet.cards[2].manaCost = ['not valid']
          cardSet.cards[3].extra = 'this is extra'

          const mockNext = jest.fn()
          const mockRequest = new MockRequest(cardSet)
          const mockResponse = new MockResponse()

          try {
            validateNewCardSetObject(mockRequest, mockResponse, mockNext)
          } catch(error) {
            thrownError = error
          }

          expect(thrownError).toBeDefined()
          expect(thrownError.name).toEqual(expectedObject.name)
          expect(thrownError.message).toEqual(expectedObject.message)
          expect(thrownError.invalidProperties).toEqual(expectedObject.invalidProperties)
        })
      })
    })
  })

  describe('when updated', () => {
    const existingCardSet = transformKeysFromSnakeCaseToCamelCase(testCardSetsWithId[0])
    const cardSetCardsInSnakeCase = testCardsWithId.filter(card => card.card_set_id === 1)
    const cardSetCards = cardSetCardsInSnakeCase
      .map(card => transformKeysFromSnakeCaseToCamelCase(card))

    describe('if valid', () => {
      test('passes through', () => {
        const newCard = { ...testCards[0] }
        newCard.cardSetId = 1
        const updatedCard = { ...cardSetCards[1] }
        updatedCard.name = 'Changed name'
        const deletedCard = { ...cardSetCards[2] }

        const updatedCardSet = {
          ...existingCardSet,
          cards: getDeckCardUpdateObject([newCard], [updatedCard], [deletedCard])
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
    })
    describe('if invalid', () => {
      test('returns expected error information', () => {
        let thrownError

        const expectedObject = {
          ...invalidDataErrorInformationBase,
          invalidProperties: {
            description: 'INVALID',
            cards: 'INVALID',
            cardObjects: {
              added: [
                {
                  index: '0',
                  name: 'INVALID'
                }
              ],
              deleted: [
                {
                  index: '0',
                  id: 'MISSING'
                }
              ],
              updated: [
                {
                  index: '0',
                  name: 'INVALID'
                }
              ]
            }
          }
        }

        const newCard = { ...testCards[0] }
        newCard.name = { this: 'is invalid' }
        newCard.cardSetId = 1
        const updatedCard = { ...cardSetCards[1] }
        updatedCard.name = ['Changed name']
        const deletedCard = { ...cardSetCards[2] }
        delete deletedCard.id

        const invalidCardSet = {
          ...existingCardSet,
          cards: getDeckCardUpdateObject([newCard], [updatedCard], [deletedCard])
        }

        invalidCardSet.description = ['invalid description']

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(invalidCardSet)


        try {
          validateUpdatedCardSetObject(mockRequest, null, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError).toBeDefined()
        expect(thrownError.name).toEqual(expectedObject.name)
        expect(thrownError.message).toEqual(expectedObject.message)
        expect(thrownError.invalidProperties).toEqual(expectedObject.invalidProperties)

      })
    })
  })
})

describe('Validating card object', () => {
  describe('when a card that is part of a card set', () => {
    describe('if valid', () => {
      test('passes through', () => {
        const validCard = transformKeysFromSnakeCaseToCamelCase(testCardsWithId[0])

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(validCard)

        try {
          validateExistingCardObject(mockRequest, null, mockNext)
        } catch(error) {
          // intentionally left empty
        }
        expect(mockNext).toBeCalledTimes(1)
      })
    })

    describe('if invalid', () => {
      test('raises expected error', () => {
        const expectedValues = {
          ...invalidDataErrorInformationBase,
          invalidProperties: {
            name: 'INVALID',
            rulesText: 'MISSING',
            extra: 'UNEXPECTED'
          }
        }
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

        expect(thrownError.name).toBe(expectedValues.name)
        expect(thrownError.message).toBe(expectedValues.message)
        expect(thrownError.invalidProperties).toEqual(expectedValues.invalidProperties)
      })
    })
  })

  describe('when new card', () => {
    describe('if valid', () => {
      test('passes through', () => {
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
    })
    describe('if invalid', () => {
      test('raises expected error', () => {
        let thrownError

        const expectedValues = {
          ...invalidDataErrorInformationBase,
          invalidProperties: {
            name: 'INVALID',
            extra: 'UNEXPECTED'
          }
        }

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

        expect(thrownError.name).toBe(expectedValues.name)
        expect(thrownError.message).toBe(expectedValues.message)
        expect(thrownError.invalidProperties).toEqual(expectedValues.invalidProperties)
      })
    })
  })
})

describe('User validator', () => {
  describe('when new user', () => {
    describe('if valid', () => {
      test('passes through', () => {
        const user = { ...testUsers[0] }

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(user)

        try {
          validateNewUserObject(mockRequest, null, mockNext)
        } catch(error) {
          // intentionally left empty
        }

        expect(mockNext).toBeCalledTimes(1)
      })
    })

    describe('if invalid', () => {
      test('raises expected error', () => {
        let thrownError

        const expectedValues = {
          ...invalidDataErrorInformationBase,
          invalidProperties: {
            username: 'INVALID',
            extra: 'UNEXPECTED'
          }
        }

        const user = { ...testUsers[0] }

        user.username = []
        user.extra = 'this is extra'

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(user)

        try {
          validateNewUserObject(mockRequest, null, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError.name).toBe(expectedValues.name)
        expect(thrownError.message).toBe(expectedValues.message)
        expect(thrownError.invalidProperties).toEqual(expectedValues.invalidProperties)
      })
    })
  })

  describe('when already existing user', () => {
    describe('if valid', () => {
      test('passes through', () => {
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
    })

    describe('if invalid', () => {
      test('raises expected error', () => {
        let thrownError

        const expectedValues = {
          ...invalidDataErrorInformationBase,
          invalidProperties: {
            username: 'INVALID',
            extra: 'UNEXPECTED'
          }
        }
        const user = { ...testUsers[0] }

        user.username = []
        user.extra = 'this is extra'

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(user)

        try {
          validateNewUserObject(mockRequest, null, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError.name).toBe(expectedValues.name)
        expect(thrownError.message).toBe(expectedValues.message)
        expect(thrownError.invalidProperties).toEqual(expectedValues.invalidProperties)
      })
    })
  })
})

describe('Validating deck object', () => {
  describe('when new deck', () => {
    describe('if valid', () => {
      test('passes through', () => {
        const validDeck = {
          ...newDeck,
          cards: newDeck.cards.map(card => ({ ...card }))
        }

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(validDeck)

        try {
          validateNewDeckObject(mockRequest, null, mockNext)
        } catch(error) {
          // intentionally left empty
        }

        expect(mockNext).toBeCalledTimes(1)
      })
    })

    describe('if invalid', () => {
      test('raises expected error', () => {
        let thrownError

        const expectedValues = {
          ...invalidDataErrorInformationBase,
          invalidProperties: {
            notes: 'INVALID',
            cards: 'INVALID',
            cardObject: [
              {
                index: '0',
                name: 'INVALID'
              },
              {
                index: '3',
                manaCost: 'MISSING'
              }
            ]
          }
        }

        const invalidDeck = {
          ...newDeck,
          cards: newDeck.cards.map(card => ({ ...card }))
        }

        invalidDeck.notes = ['this is']
        invalidDeck.cards[0].name = ['invalid name']
        delete invalidDeck.cards[3].manaCost

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(invalidDeck)

        try {
          validateNewDeckObject(mockRequest, null, mockNext)
        } catch(error) {
          thrownError = error
        }

        expect(thrownError.name).toBe(expectedValues.name)
        expect(thrownError.message).toBe(expectedValues.message)
        expect(thrownError.invalidProperties).toEqual(expectedValues.invalidProperties)
      })
    })
  })

  describe('when updated deck', () => {
    describe('request parameter', () => {
      describe('if \'information\'', () => {
        test('passes through', () => {
          const deckInfo = { ...testDecksWithId[0] }
          const validDeckInfo = transformKeysFromSnakeCaseToCamelCase(deckInfo)

          const mockNext = jest.fn()
          const mockRequest = new MockRequest(validDeckInfo)

          mockRequest.query = { update: 'information' }

          try {
            validateUpdatedDeckObject(mockRequest, null, mockNext)
          } catch(error) {
            // intentionally left empty
          }

          expect(mockNext).toBeCalledTimes(1)
        })
      })

      describe('if \'cards\'', () => {
        test('passes through', () => {
          const cardObject = {
            'added': [],
            'updated': [],
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
      })

      describe('if missing', () => {
        test('raises expected error', () => {
          let thrownError

          const expectedError = {
            ...invalidRequestParameterErrorInformationBase,
            message: 'A request parameter is required',
            missingParameters: { update: 'information or cards' }
          }

          const deckInfo = { ...testDecksWithId[0] }
          const validDeckInfo = transformKeysFromSnakeCaseToCamelCase(deckInfo)

          const mockNext = jest.fn()
          const mockRequest = new MockRequest(validDeckInfo)

          try {
            validateUpdatedDeckObject(mockRequest, null, mockNext)
          } catch(error) {
            thrownError = error
          }

          expect(thrownError.name).toBe(expectedError.name)
          expect(thrownError.message).toBe(expectedError.message)
          expect(thrownError.missingParameters).toEqual(expectedError.missingParameters)
        })
      })

      describe('if invalid', () => {
        test('raises expected error', () => {
          let thrownError

          const expectedError = {
            ...invalidRequestParameterErrorInformationBase,
            message: 'Invalid request parameter',
            missingParameters: { update: 'information or cards' }
          }

          const deckInfo = { ...testDecksWithId[0] }
          const validDeckInfo = transformKeysFromSnakeCaseToCamelCase(deckInfo)

          const mockNext = jest.fn()
          const mockRequest = new MockRequest(validDeckInfo)

          mockRequest.query = { update: 'invalid' }

          try {
            validateUpdatedDeckObject(mockRequest, null, mockNext)
          } catch(error) {
            thrownError = error
          }

          expect(thrownError.name).toBe(expectedError.name)
          expect(thrownError.message).toBe(expectedError.message)
          expect(thrownError.missingParameters).toEqual(expectedError.missingParameters)
        })
      })
    })
    describe('when deck information is updated', () => {
      describe('if valid', () => {
        test('passes through', () => {
          const deckInformation = { ...testDecksWithId[0] }
          const validDeckinformation = transformKeysFromSnakeCaseToCamelCase(deckInformation)

          const mockNext = jest.fn()
          const mockRequest = new MockRequest(validDeckinformation)

          mockRequest.query = { update: 'information' }

          try {
            validateUpdatedDeckObject(mockRequest, null, mockNext)
          } catch(error) {
            // intentionally left empty
          }

          expect(mockNext).toBeCalledTimes(1)
        })
      })

      describe('if invalid', () => {
        test('raises expected error', () => {
          let thrownError

          const expectedError = {
            ...invalidDataErrorInformationBase,
            invalidProperties: {
              notes: 'INVALID',
              extra: 'UNEXPECTED'
            }

          }

          const deckInformation = { ...testDecksWithId[0] }
          const invalidDeckInformation = transformKeysFromSnakeCaseToCamelCase(deckInformation)

          invalidDeckInformation.notes = []
          invalidDeckInformation.extra = 'this is extra'

          const mockNext = jest.fn()
          const mockRequest = new MockRequest(invalidDeckInformation)

          mockRequest.query = { update: 'information' }

          try {
            validateUpdatedDeckObject(mockRequest, null, mockNext)
          } catch(error) {
            thrownError = error
          }

          expect(thrownError.name).toBe(expectedError.name)
          expect(thrownError.message).toBe(expectedError.message)
          expect(thrownError.invalidProperties).toEqual(expectedError.invalidProperties)
        })
      })
    })
    describe('when cards are modified', () => {
      describe('if valid', () => {
        test('passes through', () => {
          const { added, deleted, updated } = testCardUpdatesOnDeckWithIdOne

          const validCardObject = {
            'added': added.map(card => ({ ...card })),
            'deleted': deleted.map(card => ({ ...card })),
            'updated': updated.map(card => ({ ...card })),
          }

          const mockNext = jest.fn()
          const mockRequest = new MockRequest(validCardObject)

          mockRequest.query = { update: 'cards' }

          try {
            validateUpdatedDeckObject(mockRequest, null, mockNext)
          } catch(error) {
            // intentionally left empty
          }

          expect(mockNext).toBeCalledTimes(1)
        })
      })
      describe('if invalid', () => {
        test('raises expected error', () => {
          let thrownError

          const expectedError = {
            ...invalidDataErrorInformationBase,
            invalidProperties: {
              added: [
                {
                  index: '0',
                  name: 'INVALID'
                }
              ],
              deleted: [
                {
                  index: '1',
                  name: 'MISSING'
                }
              ],
              updated: [
                {
                  index: '0',
                  nInDeck: 'MISSING'
                },
                {
                  index: '1',
                  extra: 'UNEXPECTED',
                  sideboard: 'INVALID'
                }
              ]
            }

          }

          const { added, deleted, updated } = testCardUpdatesOnDeckWithIdOne

          const invalidCardObject = {
            'added': added.map(card => ({ ...card })),
            'deleted': deleted.map(card => ({ ...card })),
            'updated': updated.map(card => ({ ...card })),
          }

          invalidCardObject.added[0].name = ['not valid']
          delete invalidCardObject.deleted[1].name
          delete invalidCardObject.updated[0].nInDeck
          invalidCardObject.updated[1].extra = 'this is extra'
          invalidCardObject.updated[1].sideboard = 2

          const mockNext = jest.fn()
          const mockRequest = new MockRequest(invalidCardObject)

          mockRequest.query = { update: 'cards' }

          try {
            validateUpdatedDeckObject(mockRequest, null, mockNext)
          } catch(error) {
            thrownError = error
          }

          expect(thrownError.name).toBe(expectedError.name)
          expect(thrownError.message).toBe(expectedError.message)
          expect(thrownError.invalidProperties).toEqual(expectedError.invalidProperties)
        })
      })
    })
  })
})