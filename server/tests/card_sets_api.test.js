const {
  testCardSetsWithId,
  invalidCardSet,
  testCardsWithId,
  testCards,
  addExpectedIdsAndAddProperties,
  newCard
} = require('./test_data')

const {
  queryTableContent,
  queryTableContentWithId,
  queryTableContentWithFieldValue,
  transformKeysFromCamelCaseToSnakeCase,
  transformKeysFromSnakeCaseToCamelCase
} = require('./test_helpers')

const lastIdOfTestCards = () => {
  return testCardsWithId.length
}

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { sequelize } = require('../utils/db')
const queryInterface = sequelize.getQueryInterface()

// Logging SQL commands is set off, to enable set this too true
sequelize.options.logging = false

const prepareDatabase = async () => {
  await queryInterface.bulkDelete('cards')
  await queryInterface.bulkDelete('card_sets')
  await sequelize.query('ALTER SEQUENCE "card_sets_id_seq" RESTART WITH 4')
  await sequelize.query(`ALTER SEQUENCE "cards_id_seq" RESTART WITH ${lastIdOfTestCards() + 1}`)
  await queryInterface.bulkInsert('card_sets', testCardSetsWithId)
  await queryInterface.bulkInsert('cards', testCardsWithId)
}

beforeAll(async () => {
  await queryInterface.bulkDelete('deck_cards')
  await queryInterface.bulkDelete('card_sets')
})

afterAll(async () => {
  sequelize.close()
})

describe('/api/card_sets', () => {
  describe('When user asks for all card sets', () => {
    let receivedData
    beforeAll(async () => {
      await queryInterface.bulkDelete('card_sets')
      await sequelize.query('ALTER SEQUENCE "card_sets_id_seq" RESTART WITH 4')
      await queryInterface.bulkInsert('card_sets', testCardSetsWithId)
      receivedData = await api
        .get('/api/card_sets')
    })

    test('responds with 200', () => {
      expect(receivedData.statusCode).toBe(200)
    })

    test('returns a json', () => {
      expect(receivedData.type).toBe('application/json')
    })

    test('all card sets are returned', async () => {
      const expectedCardSets = testCardSetsWithId
        .map(cardSet => ({ ...cardSet, date: cardSet.date.toISOString() }))
      const receivedObject = receivedData.body

      expect(receivedObject).toEqual(expectedCardSets)
    })
  })

  describe('When user adds a new card set', () => {
    const newCardSet = {
      name: 'Crimson Vow',
      description: 'A set of cards from Crimson Vow',
      cards: testCards
    }

    describe('if successful', () => {
      let receivedData
      let cardSetsInDatabaseBefore
      let cardSetsInDatabaseAfter
      let cardsInDatabaseBefore
      let cardsInDatabaseAfter
      beforeAll(async () => {
        await prepareDatabase()

        cardSetsInDatabaseBefore = await queryTableContent('card_sets')
        cardsInDatabaseBefore = await queryTableContent('cards')

        receivedData = await api
          .post('/api/card_sets')
          .send(newCardSet)

        cardSetsInDatabaseAfter = await queryTableContent('card_sets')
        cardsInDatabaseAfter = await queryTableContent('cards')
      })

      test('responds with 201', () => {
        expect(receivedData.statusCode).toBe
      })

      test('responds with json', () => {
        expect(receivedData.type).toBe('application/json')
      })

      test('returns expected object', () => {
        const propertiesToBeAdded = { cardSetId: 4 }
        const expectedCards = addExpectedIdsAndAddProperties(testCards, lastIdOfTestCards() + 1, propertiesToBeAdded)

        const expectedObject = {
          id: 4,
          ...newCardSet,
          date: 'difficult to test',
          cards: expectedCards
        }

        const receivedObject = receivedData.body

        receivedObject.date = 'difficult to test'

        expect(receivedObject).toEqual(expectedObject)
      })

      test('number of card sets increases in the database', () => {
        expect(cardSetsInDatabaseAfter).toHaveLength(cardSetsInDatabaseBefore.length + 1)
      })

      test('the card set is added to the database', () => {
        const cardSetsAfterWithDateAsString = cardSetsInDatabaseAfter
          .map(cardSet => ({ ...cardSet, date: 'difficult to test' }))

        const expectedObject = {
          id: 4,
          name: newCardSet.name,
          description: newCardSet.description,
          date: 'difficult to test'
        }

        expect(cardSetsAfterWithDateAsString).toContainEqual(expectedObject)
      })

      test('number of cards increases in the database', () => {
        const nOfAddedCards = testCards.length
        const nOfExistingCards = testCardsWithId.length

        expect(cardsInDatabaseAfter).not.toHaveLength(cardsInDatabaseBefore.length)
        expect(cardsInDatabaseAfter).toHaveLength(nOfAddedCards + nOfExistingCards)
      })

      test('expected cards were added to the database', () => {
        const propertiesToBeAdded = { cardSetId: 4 }
        const expectedCardsInCamelCase = addExpectedIdsAndAddProperties(testCards, lastIdOfTestCards() + 1, propertiesToBeAdded)
        const expectedCardsInSnakeCase = expectedCardsInCamelCase
          .map(card => transformKeysFromCamelCaseToSnakeCase(card))

        for (const expectedCard of expectedCardsInSnakeCase) {
          expect(cardsInDatabaseAfter).toContainEqual(expectedCard)
        }
      })
    })

    describe('if unsuccessful', () => {
      let receivedData
      let cardSetsInDatabaseBefore
      let cardSetsInDatabaseAfter
      let cardsInDatabaseBefore
      let cardsInDatabaseAfter
      let invalidCardSet
      beforeAll(async () => {
        await prepareDatabase()
        const testCardsWithInvalidCards = [ ...testCards ]
        delete testCardsWithInvalidCards[2].price
        testCardsWithInvalidCards[3].manaCost = ['invalid']

        cardSetsInDatabaseBefore = await queryTableContent('card_sets')
        cardsInDatabaseBefore = await queryTableContent('cards')

        invalidCardSet = {
          name: 'Crimson Vow',
          cards: testCardsWithInvalidCards
        }

        cardSetsInDatabaseAfter = await queryTableContent('card_sets')
        cardsInDatabaseAfter = await queryTableContent('cards')

        receivedData = await api
          .post('/api/card_sets')
          .send(invalidCardSet)
      })

      test('returns 400', () => {
        expect(receivedData.statusCode).toBe(400)
      })

      test('returns expected error message', () => {
        const expectedObject = {
          error: 'Invalid or missing data',
          invalidProperties: {
            cardObjects: [
              { index: '2', price: 'MISSING' },
              { index: '3', manaCost: 'INVALID' }
            ],
            description: 'MISSING'
          }
        }

        const receivedObject = receivedData.body

        expect(receivedObject).toEqual(expectedObject)
      })

      test('card set is not added to the database', () => {
        expect(cardSetsInDatabaseAfter).toEqual(cardSetsInDatabaseBefore)
      })

      test('cards are not addded to the database', () => {
        expect(cardsInDatabaseAfter).toEqual(cardsInDatabaseBefore)
      })
    })
  })

  describe('When user deletes a card set', () => {
    const cardSetId = 2
    describe('if successfull', () => {
      let receivedData
      let cardSetsInDatabaseBefore
      let cardSetsInDatabaseAfter
      let cardsInDatabaseBefore
      let cardsInDatabaseAfter
      let deletedCardSetInDatabase
      let cardsOfTheCardSetInDatabase
      beforeAll(async () => {
        await prepareDatabase()
        cardSetsInDatabaseBefore = await queryTableContent('card_sets')
        cardsInDatabaseBefore = await queryTableContent('cards')

        const queryResults = await queryTableContentWithId('card_sets', cardSetId)
        deletedCardSetInDatabase = queryResults[0]

        cardsOfTheCardSetInDatabase = await queryTableContentWithFieldValue(
          'cards', 'card_set_id', cardSetId
        )

        receivedData = await api
          .delete(`/api/card_sets/${cardSetId}`)

        cardSetsInDatabaseAfter = await queryTableContent('card_sets')
        cardsInDatabaseAfter = await queryTableContent('cards')
      })

      test('responds with 204', () => {
        expect(receivedData.statusCode).toBe(204)
      })

      test('card set is deleted', () => {
        const nOfCardSetsBefore = cardSetsInDatabaseBefore.length
        expect(cardSetsInDatabaseAfter).toHaveLength(nOfCardSetsBefore - 1)
        expect(cardSetsInDatabaseAfter).not.toContainEqual(deletedCardSetInDatabase)
      })

      test('cards associated with the card set are deleted', () => {
        const nOfCardsBefore = cardsInDatabaseBefore.length
        expect(cardsInDatabaseAfter).not.toHaveLength(nOfCardsBefore)

        for (const card of cardsOfTheCardSetInDatabase) {
          expect(cardsInDatabaseAfter).not.toContainEqual(card)
        }
      })
    })

    describe('if unsuccessful', () => {
      beforeAll(async () => {
        await prepareDatabase()
      })

      describe('when invalid id', () => {
        let receivedData
        beforeAll(async () => {
          receivedData = await api
            .delete('/api/card_sets/2_invalid_id')
        })

        test('returns 400', () => {
          expect(receivedData.statusCode).toBe(400)
        })

        test('returns expected error message', () => {
          const expectedObject = {
            error: 'Invalid id type',
            expectedType: 'INTEGER'
          }

          const receivedObject = receivedData.body

          expect(receivedObject).toEqual(expectedObject)
        })
      })

      describe('when non-existing id', () => {
        let receivedData
        let cardSetsInDatabaseBefore
        let cardSetsInDatabaseAfter
        let cardsInDatabaseBefore
        let cardsInDatabaseAfter
        beforeAll(async () => {
          cardSetsInDatabaseBefore = await queryTableContent('card_sets')
          cardsInDatabaseBefore = await queryTableContent('cards')

          receivedData = await api
            .delete('/api/card_sets/1234')

          cardSetsInDatabaseAfter = await queryTableContent('card_sets')
          cardsInDatabaseAfter = await queryTableContent('cards')
        })

        test('returns 404', () => {
          expect(receivedData.statusCode).toBe(404)
        })

        test('card set and cards associated with it are not deleted', () => {
          expect(cardSetsInDatabaseAfter).toEqual(cardSetsInDatabaseBefore)
          expect(cardsInDatabaseAfter).toEqual(cardsInDatabaseBefore)
        })
      })
    })
  })

  describe('When user updates a card set', () => {
    describe('if successful', () => {
      const cardSetId = 1
      let receivedData
      let updatedCardSet
      let modifiedCardSet
      let cardSetsInDatabaseBefore
      let cardSetsInDatabaseAfter
      let setsCardsInDatabaseBefore
      let setsCardsInDatabaseAfter
      let originalCardSet

      beforeAll(async () => {
        await prepareDatabase()
        const updatedCard = transformKeysFromSnakeCaseToCamelCase(testCardsWithId[4])
        const firstDeletedCard = transformKeysFromSnakeCaseToCamelCase(testCardsWithId[5])
        const secondDeletedCard = transformKeysFromSnakeCaseToCamelCase(testCardsWithId[6])
        const addedCard = { ...newCard, cardSetId: cardSetId }
        originalCardSet = { ...testCardSetsWithId[0] }
        modifiedCardSet = { ...originalCardSet, name: 'Updated name' }

        updatedCardSet = {
          ...modifiedCardSet,
          cards: {
            added: [ addedCard ],
            deleted: [ firstDeletedCard, secondDeletedCard ],
            updated: [ updatedCard ]
          }
        }

        cardSetsInDatabaseBefore = await queryTableContent('card_sets')
        setsCardsInDatabaseBefore = await queryTableContentWithFieldValue('cards', 'card_set_id', cardSetId)

        receivedData = await api
          .put(`/api/card_sets/${cardSetId}`)
          .send(updatedCardSet)

        cardSetsInDatabaseAfter = await queryTableContent('card_sets')
        setsCardsInDatabaseAfter = await queryTableContentWithFieldValue('cards', 'card_set_id', cardSetId)
      })

      test('responds with json', () => {
        expect(receivedData.type).toBe('application/json')
      })

      test('responds with 200', () => {
        expect(receivedData.statusCode).toBe(200)
      })

      test('returns expected object', () => {
        const expectedObject = { ...updatedCardSet, cards: { ...updatedCardSet.cards } }
        expectedObject.cards.added[0].id = lastIdOfTestCards() + 1
        expectedObject.date = expectedObject.date.toISOString()
        expectedObject.cards.deleted = 2
        const receivedObject = receivedData.body

        expect(receivedObject).toEqual(expectedObject)
      })

      describe('database changes', () => {
        test('card set information is modified', () => {
          const updatedCardSetInSnakeCase = transformKeysFromCamelCaseToSnakeCase(modifiedCardSet)
          const originalCardSetInSnakeCase = transformKeysFromCamelCaseToSnakeCase(originalCardSet)

          expect(cardSetsInDatabaseAfter).toContainEqual(updatedCardSetInSnakeCase)
          expect(cardSetsInDatabaseAfter).not.toContainEqual(originalCardSetInSnakeCase)
        })

        test('expected card is added', () => {
          const addedCards = updatedCardSet.cards.added
          const addedCardsInSnakeCase = addedCards.map(card => transformKeysFromCamelCaseToSnakeCase(card))

          for (const card of addedCardsInSnakeCase) {
            expect(setsCardsInDatabaseAfter).toContainEqual(card)
          }
        })

        test('expected card is updated', () => {
          const updatedCards = updatedCardSet.cards.updated
          const updatedCardsInSnakeCase = updatedCards.map(card => transformKeysFromCamelCaseToSnakeCase(card))

          for (const card of updatedCardsInSnakeCase) {
            expect(setsCardsInDatabaseAfter).toContainEqual(card)
          }
        })

        test('expected cards are deleted', () => {
          const deletedCards = updatedCardSet.cards.deleted
          const deletedCardsInSnakeCase = deletedCards.map(card => transformKeysFromCamelCaseToSnakeCase(card))

          for (const card of deletedCardsInSnakeCase) {
            expect(setsCardsInDatabaseAfter).not.toContainEqual(card)
          }
        })

        test('number of card sets in the database does not change', () => {
          const nOfCardSets = cardSetsInDatabaseBefore.length
          expect(cardSetsInDatabaseAfter).toHaveLength(nOfCardSets)
        })

        test('number of cards associated with the card set changes', () => {
          const nOfAssociatedCardsAfter = setsCardsInDatabaseAfter.length
          expect(nOfAssociatedCardsAfter).toBe(setsCardsInDatabaseBefore.length - 1)
        })
      })
    })

    describe('if unsuccessful', () => {
      const cardSetId = 1
      let updatedCardSet
      let modifiedCardSet
      let originalCardSet

      beforeAll(async () => {
        await prepareDatabase()
        const updatedCard = transformKeysFromSnakeCaseToCamelCase(testCardsWithId[4])
        const firstDeletedCard = transformKeysFromSnakeCaseToCamelCase(testCardsWithId[5])
        const secondDeletedCard = transformKeysFromSnakeCaseToCamelCase(testCardsWithId[6])
        const addedCard = { ...newCard, cardSetId: cardSetId }
        originalCardSet = { ...testCardSetsWithId[0] }
        modifiedCardSet = { ...originalCardSet, name: 'Updated name' }

        updatedCardSet = {
          ...modifiedCardSet,
          cards: {
            added: [ addedCard ],
            deleted: [ firstDeletedCard, secondDeletedCard ],
            updated: [ updatedCard ]
          }
        }
      })

      describe('when card set id is invalid', () => {
        let receivedData
        beforeAll(async () => {
          receivedData = await api
            .put('/api/card_sets/1_invald')
            .send(updatedCardSet)
        })

        test('responds with 400', () => {
          expect(receivedData.statusCode).toBe(400)
        })

        test('responds with expected error object', () => {
          const expectedObject = {
            error: 'Invalid id type',
            expectedType: 'INTEGER'
          }

          const receivedObject = receivedData.body

          expect(receivedObject).toEqual(expectedObject)
        })
      })

      describe('when id does not exist', () => {
        let receivedData
        beforeAll(async () => {
          receivedData = await api
            .put('/api/card_sets/1234')
            .send(updatedCardSet)
        })
        test('returns 404', () => {
          expect(receivedData.statusCode).toBe(404)
        })
      })

      describe('when updated card set object is invalid', () => {
        describe('when information about the card set is invalid', () => {
          let receivedData
          let invalidCardSet
          let cardSetsInDatabaseBefore
          let cardSetsInDatabaseAfter
          beforeAll(async () => {
            invalidCardSet = { ...updatedCardSet, cards: { ...updatedCardSet.cards } }

            delete invalidCardSet.date
            invalidCardSet.description = ['this is invalid']

            cardSetsInDatabaseBefore = await queryTableContent('card_sets')

            receivedData = await api
              .put(`/api/card_sets/${cardSetId}`)
              .send(invalidCardSet)

            cardSetsInDatabaseAfter = await queryTableContent('card_sets')
          })

          test('responds with 400', () => {
            expect(receivedData.statusCode).toBe(400)
          })

          test('responds with expected error information', () => {
            const expectedObject = {
              error: 'Invalid or missing data',
              invalidProperties: {
                date: 'MISSING',
                description: 'INVALID'
              }
            }
            const receivedObject = receivedData.body

            expect(receivedObject).toEqual(expectedObject)
          })

          test('database is not modified', () => {
            expect(cardSetsInDatabaseAfter).toEqual(cardSetsInDatabaseBefore)
          })
        })

        describe('when cards are invalid', () => {
          let invalidCards
          let cardSetUpdateWithInvalidCards
          let receivedData
          let setsCardsInDatabaseBefore
          let setsCardsInDatabaseAfter

          beforeAll(async () => {
            invalidCards = { ...updatedCardSet.cards }
            invalidCards.added[0].cardNumber = 'invalid'
            invalidCards.deleted[1].rulesText = 1234
            delete invalidCards.deleted[1].cardNumber

            cardSetUpdateWithInvalidCards = {
              ...updatedCardSet,
              cards: invalidCards
            }

            setsCardsInDatabaseBefore = queryTableContent('card_sets')

            receivedData = await api
              .put(`/api/card_sets/${cardSetId}`)
              .send(cardSetUpdateWithInvalidCards)

            setsCardsInDatabaseAfter = queryTableContent('card_sets')
          })

          test('responds with 400', () => {
            expect(receivedData.statusCode).toBe(400)
          })

          test('responds with expected error information', () => {
            const expectedObject = {
              error: 'Invalid or missing data',
              invalidProperties: {
                cards: 'INVALID',
                cardObjects: {
                  added: [
                    {
                      index: '0',
                      cardNumber: 'INVALID'
                    }
                  ],
                  deleted: [
                    {
                      index: '1',
                      rulesText: 'INVALID',
                      cardNumber: 'MISSING'
                    }
                  ],
                  updated: []
                }
              }
            }

            const receivedObject = receivedData.body

            expect(receivedObject).toEqual(expectedObject)
          })

          test('cards in the database are not modified', () => {
            expect(setsCardsInDatabaseAfter).toEqual(setsCardsInDatabaseBefore)
          })
        })
      })
    })
  })

  describe('When user asks for a specific card set', () => {
    const cardSetId = 1
    beforeAll(async () => {
      await prepareDatabase()
    })

    describe('if successful', () => {
      let responseData
      beforeAll(async () => {
        responseData = await api
          .get(`/api/card_sets/${cardSetId}`)
      })

      test('responds with 200', () => {
        expect(responseData.statusCode).toBe(200)
      })

      test('responds with json', () => {
        expect(responseData.type).toEqual('application/json')
      })

      test('responds with expected object', () => {
        const cardSetInfo = transformKeysFromCamelCaseToSnakeCase(testCardSetsWithId[0])
        cardSetInfo.date = cardSetInfo.date.toISOString()

        const cardSetCardsInSnakeCase = testCardsWithId.filter(card => card.card_set_id === cardSetId)
        const cardSetCards = cardSetCardsInSnakeCase.map(card => transformKeysFromSnakeCaseToCamelCase(card))

        const expectedObject = {
          ...cardSetInfo,
          cards: [
            ...cardSetCards
          ]
        }

        const responseObject = responseData.body

        expect(responseObject).toEqual(expectedObject)
      })
    })

    describe('if unsuccessful', () => {
      describe('when invalid id', () => {
        let responseData
        beforeAll(async () => {
          responseData = await api
            .get('/api/card_sets/1_invalid')
        })

        test('responds with 400', () => {
          expect(responseData.statusCode).toBe(400)
        })

        test('responds with expected error information', () => {
          const expectedError = {
            error: 'Invalid id type',
            expectedType: 'INTEGER'
          }

          const responseObject = responseData.body

          expect(responseObject).toEqual(expectedError)
        })
      })

      describe('when non-existing id', () => {
        let responseData
        beforeAll(async () => {
          responseData = await api
            .get('/api/card_sets/1234')
        })

        test('responds with 404', () => {
          expect(responseData.statusCode).toBe(404)
        })
      })
    })
  })
})