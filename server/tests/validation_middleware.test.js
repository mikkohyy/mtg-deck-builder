const { MockResponse, MockRequest } = require('./test_mocks')

const {
  validateNewCardSetObject,
  validateUpdatedCardSetObject,
  validateUpdatedCardObject,
  validateNewCardObject,
  validateNewUserObject,
  validateUpdatedUserObject,
  validateNewDeckObject,
  validateUpdatedDeckObject
} = require('../utils/validation_middleware')

const {
  testCardSets,
  testCards,
  testCardsWithId,
  testUsers,
  testDecksWithId,
  testCardSetsWithId,
  newDeck,
  testCardUpdatesOnDeckWithIdOne
} = require('./test_data')

const {
  transformKeysFromSnakeCaseToCamelCase
} = require('./test_helpers')

const validCardSetWithCards = {
  ...testCardSets[0],
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

describe('\'Card Set\' object validation', () => {
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
        const updatedCardSet = {
          ...existingCardSet
        }

        updatedCardSet.name = 'Updated name'

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(updatedCardSet)

        try {
          validateUpdatedCardSetObject(mockRequest, null, mockNext)
        } catch(error) {
          console.log(error)
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

describe('\'Card\' object validation', () => {
  describe('when updated', () => {
    describe('if valid', () => {
      test('passes through', () => {
        const validCard = transformKeysFromSnakeCaseToCamelCase(testCardsWithId[0])

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(validCard)

        try {
          validateUpdatedCardObject(mockRequest, null, mockNext)
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
          validateUpdatedCardObject(mockRequest, null, mockNext)
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
          validateNewCardObject(mockRequest, null, mockNext)
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
            extra: 'UNEXPECTED',
          }
        }

        const card = transformKeysFromSnakeCaseToCamelCase(testCardsWithId[0])
        delete card.id

        card.name = []
        card.extra = 'this is extra'

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(card)

        try {
          validateNewCardObject(mockRequest, null, mockNext)
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

describe('\'User\' object validations', () => {
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

describe('\'Deck\' object validation', () => {
  describe('when new deck', () => {
    describe('if valid', () => {
      test('passes through', () => {
        const validDeck = {
          ...newDeck,
          cards: {
            added: newDeck.cards.map(card => ({ ...card })),
            deleted: [],
            updated: []
          }
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
            cardObjects: {
              added: [
                {
                  index: '0',
                  name: 'INVALID'
                },
                {
                  index: '3',
                  manaCost: 'MISSING'
                }
              ],
              deleted: [],
              updated: []
            }
          }
        }

        const invalidDeck = {
          ...newDeck,
          cards: {
            added: newDeck.cards.map(card => ({ ...card })),
            deleted: [],
            updated: []
          }
        }

        invalidDeck.notes = ['this is']
        invalidDeck.cards.added[0].name = ['invalid name']
        delete invalidDeck.cards.added[3].manaCost

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

  describe('when deck is updated', () => {
    describe('if valid', () => {
      test('passes through', () => {
        const { added, deleted, updated } = testCardUpdatesOnDeckWithIdOne

        const deckInformation = { ...testDecksWithId[0] }
        const validDeckInformation = transformKeysFromSnakeCaseToCamelCase(deckInformation)

        const data = {
          ...validDeckInformation,
          cards: {
            added: added.map(card => ({ ...card })),
            deleted: deleted.map(card => ({ ...card })),
            updated: updated.map(card => ({ ...card }))
          }
        }

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(data)

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
        const { added, deleted, updated } = testCardUpdatesOnDeckWithIdOne

        let thrownError

        const expectedError = {
          ...invalidDataErrorInformationBase,
          invalidProperties: {
            notes: 'INVALID',
            extra: 'UNEXPECTED',
            cards: 'INVALID',
            cardObjects: {
              added: [
                {
                  index: '0',
                  nInDeck: 'MISSING'
                },
                {
                  index: '1',
                  cardNumber: 'INVALID'
                }
              ],
              deleted: [],
              updated: [
                {
                  index: '0',
                  sideboard: 'MISSING',
                  extra: 'UNEXPECTED'
                }
              ]
            }
          }

        }

        const deckInformation = { ...testDecksWithId[0] }
        const invalidDeckInformation = transformKeysFromSnakeCaseToCamelCase(deckInformation)

        const data = {
          ...invalidDeckInformation,
          cards: {
            added: added.map(card => ({ ...card })),
            deleted: deleted.map(card => ({ ...card })),
            updated: updated.map(card => ({ ...card }))
          }
        }

        delete data.cards.added[0].nInDeck
        data.cards.added[1].cardNumber = [123]
        delete data.cards.updated[0].sideboard
        data.cards.updated[0].extra = 'this is not expected'

        data.notes = []
        data.extra = 'this is extra'

        const mockNext = jest.fn()
        const mockRequest = new MockRequest(data)

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
})