const {
  fillDatabaseForDecksAPITests,
  transformSnakeCaseCardFieldsToCamelCase,
  addInfoRelatedToDeckToCard,
  transformPropertiesFromSnakecaseToCamelCase,
  queryTableContent,
  getFilteredTableContentWithSQLQuery,
  getDeckCardUpdateObject,
  removePropertiesFromObject
} = require('./test_helpers')

const {
  testDecksWithId,
  testCardDeckCombination,
  testCardsWithId
} = require('./test_data')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { QueryTypes } = require('sequelize')
const { sequelize } = require('../utils/db')
const queryInterface = sequelize.getQueryInterface()

sequelize.options.logging = false

let deckFromDb
let serverResponse
let expectedErrorsOnCards

const postDataToEndpoint = async(endPoint, data) => {
  const responseData = await api
    .post(endPoint)
    .send(data)

  return responseData
}

const putDataToEndPoint = async(endPoint, data) => {
  const responseData = await api
    .put(endPoint)
    .send(data)

  return responseData
}

const deleteDataToEndPoint = async(endPoint, data) => {
  const responseData = await api
    .put(endPoint)
    .send(data)

  return responseData
}

beforeAll(async () => {
  await fillDatabaseForDecksAPITests()
})

afterAll(async() => {
  sequelize.close()
})

describe('Decks endpoint', () => {
  beforeEach(async () => {
    await queryInterface.bulkDelete('deck_cards')
    await queryInterface.bulkDelete('decks')
    await sequelize.query('ALTER SEQUENCE "decks_id_seq" RESTART WITH 4')
    await queryInterface.bulkInsert('decks', testDecksWithId)
    await queryInterface.bulkInsert('deck_cards', testCardDeckCombination)
  })

  describe('when user asks for a deck', () => {
    describe('when successful', () => {
      test('responds with 200', async () => {
        await api
          .get('/api/decks/1')
          .expect(200)
      })

      test('responds with json', async () => {
        await api
          .get('/api/decks/1')
          .expect('Content-Type', /application\/json/)
      })

      test('returns expected deck', async () => {
        const expectedDeck = testDecksWithId[0]

        const receivedData = await api
          .get('/api/decks/1')

        const deckData = receivedData.body

        expect(deckData).toHaveProperty('id', expectedDeck.id)
        expect(deckData).toHaveProperty('userId', expectedDeck.user_id)
        expect(deckData).toHaveProperty('name', expectedDeck.name)
        expect(deckData).toHaveProperty('notes', expectedDeck.notes)
        expect(deckData).toHaveProperty('cards')
      })

      test('returns empty deck array when no cards', async () => {
        const receivedData = await api
          .get('/api/decks/2')

        const deckData = receivedData.body

        expect(deckData.cards).toHaveLength(0)
      })

      test('card in cards array has expected properties', async () => {
        const receivedData = await api
          .get('/api/decks/1')

        const cardsInDeck = receivedData.body.cards
        const firstCard = cardsInDeck[0]
        const cardProperties = Object.keys(firstCard)

        expect(cardProperties).toHaveLength(9)

        expect(firstCard).toHaveProperty('id')
        expect(firstCard).toHaveProperty('name')
        expect(firstCard).toHaveProperty('cardNumber')
        expect(firstCard).toHaveProperty('manaCost')
        expect(firstCard).toHaveProperty('price')
        expect(firstCard).toHaveProperty('rulesText')
        expect(firstCard).toHaveProperty('rarity')
        expect(firstCard).toHaveProperty('nInDeck')
        expect(firstCard).toHaveProperty('sideboard')
      })

      test('returns expected cards', async () => {
        const cardsInTestedDeck = testCardDeckCombination.filter(card => card.deck_id === 1)
        const cardsInDeckIds = cardsInTestedDeck.map(card => card.card_id)
        const testCardsInSnakeCase = testCardsWithId
          .filter(card => cardsInDeckIds.includes(card.id))
        const testCardsInCamelCase = testCardsInSnakeCase
          .map(card => transformSnakeCaseCardFieldsToCamelCase(card))

        const expectedCards = addInfoRelatedToDeckToCard(testCardsInCamelCase)

        const receivedData = await api
          .get('/api/decks/1')

        const cardsInDeck = receivedData.body.cards

        expect(cardsInDeck).toHaveLength(6)
        for (const card of expectedCards) {
          expect(cardsInDeck).toContainEqual(card)
        }
      })
    })

    describe('when unsuccessful', () => {
      describe('when invalid id', () => {
        test('responds with 400', async () => {
          await api
            .get('/api/decks/2_invalid_id')
            .expect(400)
        })

        test('responds with expected error information', async () => {
          const receivedData = await api
            .get('/api/decks/2_invalid_id')

          const errorInfo = receivedData.body

          expect(errorInfo.error).toMatch(/Invalid id type/)
          expect(errorInfo.expectedType).toBe('INTEGER')
        })
      })
      describe('when non-existing deck id', () => {
        test('responds with 404', async () => {
          await api
            .get('/api/decks/1234')
            .expect(404)
        })
      })
    })
  })

  describe('when users adds a deck', () => {
    describe('when successful', () => {
      const expectedPropertyNames = ['id', 'userId', 'name', 'notes', 'cards']
      let newDeck
      let sqlResult

      beforeAll(async() => {
        newDeck = {
          userId: 1,
          name: 'Green/black dinosaur deck',
          notes: 'Did this because dinosaurs are awesome'
        }
        serverResponse = await postDataToEndpoint('/api/decks', newDeck)

        const deckId = serverResponse.body.id

        sqlResult = await sequelize
          .query(
            `SELECT id, user_id AS "userId", name, notes 
             FROM decks
             WHERE id=${deckId}`,
            { type: QueryTypes.SELECT }
          )
      })

      test('returns 201', () => {
        expect(serverResponse.statusCode).toBe(201)
      })

      test('returns the created deck with right number of properties', () => {
        const returnedObject = serverResponse.body
        const propertyNames = Object.keys(returnedObject)

        expect(propertyNames).toHaveLength(expectedPropertyNames.length)
      })

      test('returns the created deck with right properties', () => {
        const returnedDeck = serverResponse.body
        const expectedDeck = {
          ...newDeck,
          id: 4,
          cards: []
        }

        expect(returnedDeck).toEqual(expectedDeck)
      })

      test('deck is added to the database', async () => {
        const addedDeck = sqlResult[0]

        const expectedDeck = {
          ...newDeck,
          id: 4
        }

        expect(addedDeck).toEqual(expectedDeck)
      })
    })
    describe('when unsuccessful', () => {
      beforeAll(async () => {
        const newDeck = {
          userId: 1,
          name: 'Green/black dinosaur deck',
          notes: ['Did this because dinosaurs are awesome'],
          extra: 'this is extra'
        }

        serverResponse = await postDataToEndpoint('/api/decks', newDeck)
      })
      test('responds with 400', () => {
        expect(serverResponse.statusCode).toBe(400)
      })

      test('responds with expected error message', () => {
        expect(serverResponse.body).toHaveProperty('error', 'Invalid or missing data')
        expect(serverResponse.body).toHaveProperty('invalidProperties')
      })

      test('responds with right number of invalid properties', () => {
        const errorInfo = serverResponse.body.invalidProperties
        const fieldsWithError = Object.keys(errorInfo)

        expect(fieldsWithError).toHaveLength(2)
      })

      test('responds with expected information about invalid properties', () => {
        const expectedObject = {
          notes: 'INVALID',
          extra: 'UNEXPECTED'
        }

        const errorInfo = serverResponse.body.invalidProperties

        expect(errorInfo).toEqual(expectedObject)
      })
    })
  })

  describe('when users deletes a deck', () => {
    describe('when successful', () => {
      test('returns 204', async () => {
        await api
          .delete('/api/decks/1')
          .expect(204)
      })

      test('deck is removed from the database', async () => {
        const decksBefore = await queryTableContent('decks')
        const deletedDeck = decksBefore[0]

        await api
          .delete('/api/decks/1')

        const decksAfter = await queryTableContent('decks')

        expect(decksAfter).toHaveLength(decksBefore.length - 1)
        expect(decksAfter).not.toContainEqual(deletedDeck)
      })

      test('connections are removed from the connection table', async () => {
        const connectionTableBefore = await queryTableContent('deck_cards')
        const firstCard = connectionTableBefore[0]

        await api
          .delete('/api/decks/1')

        const connectionTableAfter = await queryTableContent('deck_cards')
        const deckIdsAfter = connectionTableAfter.map(deckCard => deckCard.deck_id)

        expect(connectionTableAfter).not.toHaveLength(connectionTableBefore.length)
        expect(deckIdsAfter).not.toContain(1)
        expect(connectionTableAfter).not.toContainEqual(firstCard)
      })
    })

    describe('when unsuccesful', () => {
      describe('if invalid id', () => {
        test('responds with 400', async () => {
          await api
            .delete('/api/decks/not_valid_2')
            .expect(400)
        })
        test('responds with expected error message', async () => {
          const responseData = await api
            .delete('/api/decks/not_valid_2')

          const errorInfo = responseData.body

          expect(errorInfo.error).toMatch(/Invalid id type/)
          expect(errorInfo.expectedType).toBe('INTEGER')
        })
      })

      describe('if non-existing id', () => {
        test('responds with 404', async () => {
          await api
            .delete('/api/decks/1234')
            .expect(404)
        })
      })
    })
  })

  describe('when user updates deck', () => {
    beforeEach(async () => {
      const firstDeckInDb = await getFilteredTableContentWithSQLQuery('decks', 'id', 1)
      const deckCardsInDb = await sequelize
        .query(
          `SELECT 
             deck_cards.n_in_deck,
             deck_cards.sideboard,
             cards.id,
             cards.name,
             cards.card_number,
             cards.mana_cost,
             cards.price,
             cards.rules_text,
             cards.rarity
           FROM deck_cards
           JOIN cards
           ON deck_cards.card_id = cards.id
           WHERE deck_id = 1`
        )

      const deckInCamelCase = transformPropertiesFromSnakecaseToCamelCase(firstDeckInDb[0])
      const cardsInCamelCase = deckCardsInDb[0]
        .map(card => transformPropertiesFromSnakecaseToCamelCase(card))

      deckFromDb = {
        ...deckInCamelCase,
        cards: [
          ...cardsInCamelCase
        ]
      }
    })

    describe('if successful', () => {
      describe('when updates the deck information', () => {
        test('responds with 200', async () => {
          deckFromDb.name = 'Red draft deck'
          delete deckFromDb.cards

          await api
            .put('/api/decks/1?update=information')
            .send(deckFromDb)
            .expect(200)
        })

        test('returns updated deck information', async () => {
          const originalDeck = { ...deckFromDb }
          delete originalDeck.cards

          deckFromDb.name = 'Red draft deck'
          delete deckFromDb.cards

          const responseData = await api
            .put('/api/decks/1?update=information')
            .send(deckFromDb)

          const returnedData = responseData.body

          expect(returnedData).not.toEqual(originalDeck)
        })

        test('deck in the database is updated', async () => {
          const originalDeck = { ...deckFromDb }
          delete originalDeck.cards

          deckFromDb.name = 'Red draft deck'
          delete deckFromDb.cards

          const responseData = await api
            .put('/api/decks/1?update=information')
            .send(deckFromDb)

          const returnedData = responseData.body

          const deckQueryDataAfter = await sequelize
            .query(
              'SELECT * FROM decks WHERE id = 1',
              { type: QueryTypes.SELECT }
            )

          const deckInDbAfter = transformPropertiesFromSnakecaseToCamelCase(deckQueryDataAfter[0])

          expect(returnedData).not.toEqual(originalDeck)
          expect(returnedData).toEqual(deckInDbAfter)
        })
      })

      describe('when updates cards of a deck', () => {
        test('responds with 200', async () => {
          const cardNS = [0, 3]
          const updatedCards = cardNS.map(i => deckFromDb.cards[i])

          updatedCards[0].nInDeck = 3
          updatedCards[1].nInDeck = 0

          const changesInCards = getDeckCardUpdateObject([], updatedCards, [])

          await api
            .put('/api/decks/1?update=cards')
            .send(changesInCards)
            .expect(200)
        })

        test('respose body has properties added, updated and deleted', async () => {
          const cardNS = [0, 3]
          const updatedCards = cardNS.map(i => deckFromDb.cards[i])

          updatedCards[0].nInDeck = 3
          updatedCards[1].nInDeck = 0

          const changesInCards = getDeckCardUpdateObject([], updatedCards, [])

          const receivedData = await api
            .put('/api/decks/1?update=cards')
            .send(changesInCards)
            .expect(200)

          const updateInfo = receivedData.body

          expect(updateInfo).toHaveProperty('added')
          expect(updateInfo).toHaveProperty('updated')
          expect(updateInfo).toHaveProperty('deleted')
        })

        describe('when cards are updated', () => {
          test('returns card objects', async () => {
            const cardNS = [0, 3]
            const updatedCards = cardNS.map(i => deckFromDb.cards[i])

            updatedCards[0].nInDeck = 3
            updatedCards[1].nInDeck = 0

            const changesInCards = getDeckCardUpdateObject([], updatedCards, [])

            const receivedData = await api
              .put('/api/decks/1?update=cards')
              .send(changesInCards)

            const receivedUpdatedCards = receivedData.body.updated

            const firstCardAfter = receivedUpdatedCards[0]
            const propertyNames = Object.keys(firstCardAfter)

            expect(propertyNames).toHaveLength(9)

            expect(firstCardAfter).toHaveProperty('id')
            expect(firstCardAfter).toHaveProperty('name')
            expect(firstCardAfter).toHaveProperty('cardNumber')
            expect(firstCardAfter).toHaveProperty('manaCost')
            expect(firstCardAfter).toHaveProperty('price')
            expect(firstCardAfter).toHaveProperty('rulesText')
            expect(firstCardAfter).toHaveProperty('rarity')
            expect(firstCardAfter).toHaveProperty('nInDeck')
            expect(firstCardAfter).toHaveProperty('sideboard')
          })

          test('only updated cards are returned', async () => {
            const cardNS = [0, 3]
            const updatedCards = cardNS.map(i => deckFromDb.cards[i])

            updatedCards[0].nInDeck = 3
            updatedCards[1].nInDeck = 0

            const changesInCards = getDeckCardUpdateObject([], updatedCards, [])

            const receivedData = await api
              .put('/api/decks/1?update=cards')
              .send(changesInCards)

            const receivedUpdatedCards = receivedData.body.updated

            expect(receivedUpdatedCards).toHaveLength(2)
          })

          test('returned cards have updated values', async () => {
            const cardNS = [0, 3]
            const updatedCards = cardNS.map(i => deckFromDb.cards[i])

            updatedCards[0].nInDeck = 3
            updatedCards[1].nInDeck = 0

            const changesInCards = getDeckCardUpdateObject([], updatedCards, [])

            const receivedData = await api
              .put('/api/decks/1?update=cards')
              .send(changesInCards)

            const receivedUpdatedCards = receivedData.body.updated

            const firstCardAfter = receivedUpdatedCards[0]
            const secondCardAfter = receivedUpdatedCards[1]

            expect(firstCardAfter.nInDeck).toBe(3)
            expect(secondCardAfter.nInDeck).toBe(0)
          })

          test('returned card objects have expected properties', async () => {
            const unnecessaryProperties = ['cardSetId', 'cardId']
            const cardNS = [0, 3]
            const updatedCardsWithUnnecessaryProperties = cardNS.map(i => deckFromDb.cards[i])

            const updatedCards = updatedCardsWithUnnecessaryProperties
              .map(card => removePropertiesFromObject(card, unnecessaryProperties))

            updatedCards[0].nInDeck = 3
            updatedCards[1].nInDeck = 0

            const changesInCards = getDeckCardUpdateObject([], updatedCards, [])

            const receivedData = await api
              .put('/api/decks/1?update=cards')
              .send(changesInCards)

            const receivedUpdatedCards = receivedData.body.updated

            for (const card of receivedUpdatedCards) {
              expect(updatedCards).toContainEqual(card)
            }
          })

          test('cards in the database are updated', async () => {
            const unnecessaryProperties = ['cardSetId', 'cardId']
            const cardNS = [0, 3]
            const updatedCardsWithUnnecessaryProperties = cardNS.map(i => deckFromDb.cards[i])

            const updatedCards = updatedCardsWithUnnecessaryProperties
              .map(card => removePropertiesFromObject(card, unnecessaryProperties))

            updatedCards[0].nInDeck = 3
            updatedCards[1].nInDeck = 0

            const changesInCards = getDeckCardUpdateObject([], updatedCards, [])

            await api
              .put('/api/decks/1?update=cards')
              .send(changesInCards)

            const deckCardsAfterInDb = await sequelize
              .query(
                `SELECT 
                  deck_cards.n_in_deck,
                  deck_cards.sideboard,
                  cards.id,
                  cards.name,
                  cards.card_number,
                  cards.mana_cost,
                  cards.price,
                  cards.rules_text,
                  cards.rarity
                FROM deck_cards
                JOIN cards
                ON deck_cards.card_id = cards.id
                WHERE deck_id = 1`,
                { type: QueryTypes.SELECT }
              )

            const deckCardsAfterInDbCamelCase = deckCardsAfterInDb
              .map(card => transformPropertiesFromSnakecaseToCamelCase(card))

            const firstUpdatedCard = updatedCards[0]
            const secondUpdatedCard = updatedCards[1]

            expect(deckCardsAfterInDbCamelCase).toContainEqual(firstUpdatedCard)
            expect(deckCardsAfterInDbCamelCase).toContainEqual(secondUpdatedCard)
          })
        })
        describe('when cards are added', () => {
          const firstAddedCard = transformPropertiesFromSnakecaseToCamelCase(testCardsWithId[24])
          const secondAddedCard = transformPropertiesFromSnakecaseToCamelCase(testCardsWithId[25])

          delete firstAddedCard.cardSetId
          firstAddedCard.nInDeck = 2
          firstAddedCard.sideboard = true

          delete secondAddedCard.cardSetId
          secondAddedCard.nInDeck = 3
          secondAddedCard.sideboard = false

          const addedCards = [{ ...firstAddedCard }, { ...secondAddedCard }]

          const changesInCards = getDeckCardUpdateObject(addedCards, [] , [])

          test('right number of card objects are returned', async () => {
            const responseData = await api
              .put('/api/decks/1?update=cards')
              .send(changesInCards)

            const returnedAddedCards = responseData.body.updated

            expect(returnedAddedCards).toHaveLength(2)
          })

          test('returned objects have expected properties', async () => {
            const responseData = await api
              .put('/api/decks/1?update=cards')
              .send(changesInCards)

            const returnedAddedCards = responseData.body.updated

            for (const card of returnedAddedCards) {
              const propertyNames = Object.keys(card)

              expect(propertyNames).toHaveLength(9)

              expect(card).toHaveProperty('id')
              expect(card).toHaveProperty('name')
              expect(card).toHaveProperty('cardNumber')
              expect(card).toHaveProperty('manaCost')
              expect(card).toHaveProperty('price')
              expect(card).toHaveProperty('rulesText')
              expect(card).toHaveProperty('rarity')
              expect(card).toHaveProperty('nInDeck')
              expect(card).toHaveProperty('sideboard')
            }
          })

          test('returned objects have expected values', async () => {
            const responseData = await api
              .put('/api/decks/1?update=cards')
              .send(changesInCards)

            const returnedAddedCards = responseData.body.updated

            const firstSentCard = addedCards[0]
            const secondSentCard = addedCards[1]

            expect(returnedAddedCards).toContainEqual(firstSentCard)
            expect(returnedAddedCards).toContainEqual(secondSentCard)
          })

          test('information on added cards is saved in the database', async () => {
            await api
              .put('/api/decks/1?update=cards')
              .send(changesInCards)

            const addedDeckCardEntries = await sequelize
              .query(
                `SELECT 
                    deck_cards.n_in_deck,
                    deck_cards.sideboard,
                    deck_cards.deck_id,
                    deck_cards.card_id
                  FROM deck_cards
                  WHERE deck_id = :deckId
                  AND (card_id = :firstCardId OR card_id = :secondCardId)`,
                {
                  replacements: {
                    deckId: 1,
                    firstCardId: 25,
                    secondCardId: 26
                  },
                  type: QueryTypes.SELECT
                }
              )

            expect(addedDeckCardEntries).toHaveLength(2)
          })
        })
        describe('when cards are deleted', () => {
          test('responds with an integer', async () => {
            const firstCardToBeDeleted = deckFromDb.cards[0]
            const secondCardToBeDeleted = deckFromDb.cards[1]

            const cardsToBeDeleted = [ { ...firstCardToBeDeleted }, { ...secondCardToBeDeleted } ]

            const changesInCards = getDeckCardUpdateObject([], [], cardsToBeDeleted)

            const responseData = await api
              .put('/api/decks/1?update=cards')
              .send(changesInCards)

            const nOfDeletedCards = responseData.body.deleted

            expect(typeof nOfDeletedCards).toBe('number')
          })

          test('information on how many cards were deleted is returned', async () => {
            const firstCardToBeDeleted = deckFromDb.cards[0]
            const secondCardToBeDeleted = deckFromDb.cards[1]

            const cardsToBeDeleted = [ { ...firstCardToBeDeleted }, { ...secondCardToBeDeleted } ]

            const changesInCards = getDeckCardUpdateObject([], [], cardsToBeDeleted)

            const responseData = await api
              .put('/api/decks/1?update=cards')
              .send(changesInCards)

            const nOfDeletedCards = responseData.body.deleted

            expect(nOfDeletedCards).toBe(2)
          })

          test('cards are deleted from the database', async () => {
            const firstCardToBeDeleted = deckFromDb.cards[0]
            const secondCardToBeDeleted = deckFromDb.cards[1]

            const cardsToBeDeleted = [ { ...firstCardToBeDeleted }, { ...secondCardToBeDeleted } ]

            const changesInCards = getDeckCardUpdateObject([], [], cardsToBeDeleted)

            await api
              .put('/api/decks/1?update=cards')
              .send(changesInCards)

            const deckAfterDelete = await sequelize
              .query(
                `SELECT 
                    deck_cards.card_id
                  FROM deck_cards
                  WHERE deck_id = :deckId`,
                {
                  replacements: {
                    deckId: 1,
                  },
                  type: QueryTypes.SELECT
                }
              )

            const cardIdsAfterDelete = deckAfterDelete.map(deckcard => deckcard.card_id)

            expect(cardIdsAfterDelete).not.toContain(firstCardToBeDeleted.id)
            expect(cardIdsAfterDelete).not.toContain(secondCardToBeDeleted.id)
          })
        })
      })
    })

    describe('if unsuccesful', () => {
      describe('when deck info is updated', () => {
        describe('when invalid id', () => {
          test('responds with 400', async () => {
            deckFromDb.name = 'Red draft deck'
            delete deckFromDb.cards

            await api
              .put('/api/decks/1er?update=information')
              .send(deckFromDb)
              .expect(400)
          })

          test('responds with expected message', async () => {
            deckFromDb.name = 'Red draft deck'
            delete deckFromDb.cards

            const receivedData = await api
              .put('/api/decks/1er?update=information')
              .send(deckFromDb)

            const errorInfo = receivedData.body

            expect(errorInfo.error).toMatch(/Invalid id type/)
            expect(errorInfo.expectedType).toBe('INTEGER')
          })
        })

        describe('when non-existing id', () => {
          test('responds with 404', async () => {
            deckFromDb.name = 'Red draft deck'
            delete deckFromDb.cards

            await api
              .put('/api/decks/1234?update=information')
              .send(deckFromDb)
              .expect(404)
          })
        })

        describe('when invalid value in information properties', () => {
          test('responds with 400', async () => {
            deckFromDb.name = 'Red draft deck'
            delete deckFromDb.cards
            deckFromDb.name = []

            await api
              .put('/api/decks/1?update=information')
              .send(deckFromDb)
              .expect(400)
          })

          test('responds with expected error info', async () => {
            deckFromDb.name = 'Red draft deck'
            delete deckFromDb.cards
            deckFromDb.name = []

            const receivedData = await api
              .put('/api/decks/1?update=information')
              .send(deckFromDb)
              .expect(400)

            const errorResponse = receivedData.body

            expect(errorResponse).toHaveProperty('error', 'Invalid or missing data')
            expect(errorResponse.invalidProperties).toHaveProperty('name', 'INVALID')
          })
        })
      })

      describe('when cards are updated', () => {
        describe('when invalid id', () => {
          test('responds with 400', async () => {
            const cardNS = [0, 3]
            const updatedCards = cardNS.map(i => deckFromDb.cards[i])

            updatedCards[0].nInDeck = 3
            updatedCards[1].nInDeck = 0

            const changesInCards = getDeckCardUpdateObject([], updatedCards, [])

            await api
              .put('/api/decks/1er?update=cards')
              .send(changesInCards)
              .expect(400)
          })

          test('responds with expected message', async () => {
            const cardNS = [0, 3]
            const updatedCards = cardNS.map(i => deckFromDb.cards[i])

            updatedCards[0].nInDeck = 3
            updatedCards[1].nInDeck = 0

            const changesInCards = getDeckCardUpdateObject([], updatedCards, [])

            const receivedData = await api
              .put('/api/decks/1er?update=cards')
              .send(changesInCards)

            const errorInfo = receivedData.body

            expect(errorInfo.error).toMatch(/Invalid id type/)
            expect(errorInfo.expectedType).toBe('INTEGER')
          })
        })

        describe('when non-existing id', () => {
          test('responds with 404', async () => {
            const cardNS = [0, 3]
            const updatedCards = cardNS.map(i => deckFromDb.cards[i])

            updatedCards[0].nInDeck = 3
            updatedCards[1].nInDeck = 0

            const changesInCards = getDeckCardUpdateObject([], updatedCards, [])

            await api
              .put('/api/decks/1234?update=cards')
              .send(changesInCards)
              .expect(404)
          })
        })

        describe('when updated card has invalid property', () => {
          test('responds with 400', async () => {
            const cardNS = [0]
            const updatedCards = cardNS.map(i => deckFromDb.cards[i])

            updatedCards[0].nInDeck = []

            const changesInCards = getDeckCardUpdateObject([], updatedCards, [])

            await api
              .put('/api/decks/1?update=cards')
              .send(changesInCards)
              .expect(400)
          })

          test('responds with expected number of errors information', async () => {
            const cardNS = [0]
            const updatedCards = cardNS.map(i => deckFromDb.cards[i])

            updatedCards[0].nInDeck = []

            const changesInCards = getDeckCardUpdateObject([], updatedCards, [])

            const receivedData = await api
              .put('/api/decks/1?update=cards')
              .send(changesInCards)

            const errorInfo = receivedData.body

            const { added, updated, deleted } = errorInfo.invalidProperties

            expect(added).toHaveLength(0)
            expect(updated).toHaveLength(1)
            expect(deleted).toHaveLength(0)
          })

          test('responds with expected information about the errors', async () => {
            const cardNS = [0, 3]
            const updatedCards = cardNS.map(i => deckFromDb.cards[i])

            updatedCards[0].nInDeck = []
            delete updatedCards[0].rulesText
            updatedCards[1].extra = 'this is extra'

            const changesInCards = getDeckCardUpdateObject([], updatedCards, [])

            const receivedData = await api
              .put('/api/decks/1?update=cards')
              .send(changesInCards)

            const errorInfo = receivedData.body

            const invalidUpdatedCards = errorInfo.invalidProperties.updated

            const firstInvalidInfo = invalidUpdatedCards[0]
            const secondInvalidInfo = invalidUpdatedCards[1]

            expect(errorInfo).toHaveProperty('error', 'Invalid or missing data')
            expect(firstInvalidInfo).toHaveProperty('nInDeck', 'INVALID')
            expect(firstInvalidInfo).toHaveProperty('rulesText', 'MISSING')
            expect(secondInvalidInfo).toHaveProperty('extra', 'UNEXPECTED')
          })
        })
        describe('when added cards have invalid properties', () => {
          beforeAll(async () => {
            expectedErrorsOnCards = [
              {
                index: '0',
                nInDeck: 'INVALID'
              },
              {
                index: '1',
                sideboard: 'INVALID'
              }
            ]

            const firstAddedCard = transformPropertiesFromSnakecaseToCamelCase(testCardsWithId[24])
            const secondAddedCard = transformPropertiesFromSnakecaseToCamelCase(testCardsWithId[25])

            delete firstAddedCard.cardSetId
            firstAddedCard.nInDeck = []
            firstAddedCard.sideboard = true

            delete secondAddedCard.cardSetId
            secondAddedCard.nInDeck = 3
            secondAddedCard.sideboard = 'hello'

            const addedCards = [{ ...firstAddedCard }, { ...secondAddedCard }]

            const changesInCards = getDeckCardUpdateObject(addedCards, [] , [])

            serverResponse = await putDataToEndPoint('/api/decks/1?update=cards', changesInCards)
          })

          test('responds with 400', () => {
            expect(serverResponse.statusCode).toBe(400)
          })

          test('responds with expected number of errors information', () => {
            const errorInfo = serverResponse.body
            const infoOnCardErrors = errorInfo.invalidProperties.added

            expect(infoOnCardErrors).toHaveLength(2)
          })

          test('responds with expected information about the errors', () => {
            const errorInfo = serverResponse.body
            const infoOnCardErrors = errorInfo.invalidProperties.added

            for (const expectedErrors of expectedErrorsOnCards) {
              expect(infoOnCardErrors).toContainEqual(expectedErrors)
            }
          })
        })
        describe('when deleted cards have invalid properties', () => {
          beforeAll(async () => {
            expectedErrorsOnCards = [
              {
                index: '0',
                id: 'INVALID'
              },
              {
                index: '1',
                id: 'MISSING'
              }
            ]

            const firstDeletedCard = transformPropertiesFromSnakecaseToCamelCase(testCardsWithId[24])
            const secondDeletedCard = transformPropertiesFromSnakecaseToCamelCase(testCardsWithId[25])

            delete firstDeletedCard.cardSetId
            firstDeletedCard.id = []
            firstDeletedCard.nInDeck = 1
            firstDeletedCard.sideboard = true

            delete secondDeletedCard.cardSetId
            delete secondDeletedCard.id
            secondDeletedCard.nInDeck = 3
            secondDeletedCard.sideboard = true

            const deletedCards = [{ ...firstDeletedCard }, { ...secondDeletedCard }]

            const changesInCards = getDeckCardUpdateObject([], [], deletedCards)

            serverResponse = await deleteDataToEndPoint('/api/decks/1?update=cards', changesInCards)
          })

          test('returns 400', () => {
            expect(serverResponse.statusCode).toBe(400)
          })

          test('returns expected number of error infos on cards', () => {
            const errorInfo = serverResponse.body
            const infoOnCardErrors = errorInfo.invalidProperties.deleted

            expect(infoOnCardErrors).toHaveLength(2)
          })

          test('responds with expected information about the errors', () => {
            const errorInfo = serverResponse.body
            const infoOnCardErrors = errorInfo.invalidProperties.deleted

            for (const expectedErrors of expectedErrorsOnCards) {
              expect(infoOnCardErrors).toContainEqual(expectedErrors)
            }
          })
        })
      })
    })
  })
})