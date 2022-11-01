const {
  transformKeysFromSnakeCaseToCamelCase,
  queryTableContent,
} = require('./test_helpers')

const {
  testDecksWithId,
  testCardDeckCombinations,
  testCardSetsWithId,
  testCardsWithId,
  testUsersWithId,
  newDeck,
  newDeckCards,
  testCardUpdatesOnDeckWithIdOne
} = require('./test_data')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { sequelize } = require('../utils/db')
const queryInterface = sequelize.getQueryInterface()

// Logging SQL commands while testing is set off, to enable set this too true
sequelize.options.logging = false

const formatDatabaseForTests = async () => {
  await queryInterface.bulkDelete('deck_cards')
  await queryInterface.bulkDelete('cards')
  await queryInterface.bulkDelete('card_sets')
  await queryInterface.bulkDelete('decks')
  await queryInterface.bulkDelete('users')

  await sequelize.query('ALTER SEQUENCE "cards_id_seq" RESTART WITH 31')
  await sequelize.query('ALTER SEQUENCE "card_sets_id_seq" RESTART WITH 4')
  await sequelize.query('ALTER SEQUENCE "users_id_seq" RESTART WITH 4')

  await queryInterface.bulkInsert('card_sets', testCardSetsWithId)
  await queryInterface.bulkInsert('cards', testCardsWithId)
  await queryInterface.bulkInsert('users', testUsersWithId)
}

const prepareDatabase = async () => {
  await queryInterface.bulkDelete('deck_cards')
  await queryInterface.bulkDelete('decks')
  await sequelize.query('ALTER SEQUENCE "decks_id_seq" RESTART WITH 4')
  await queryInterface.bulkInsert('decks', testDecksWithId)
  await queryInterface.bulkInsert('deck_cards', testCardDeckCombinations)
}

const createDeckWithIdNumberOne = () => {
  const deckInCamelCase = transformKeysFromSnakeCaseToCamelCase({ ...testDecksWithId[0] })
  const cardDeckEntries = testCardDeckCombinations.filter(cardDeck => cardDeck.deck_id === 1)
  const cardIds = cardDeckEntries.map(entry => entry.card_id)
  const cardsInDeckWithoutDeckInfo = testCardsWithId.filter(card => cardIds.includes(card.id))

  const cardsInDeck = []

  for (const card of cardsInDeckWithoutDeckInfo) {
    const cardDeckEntryIndex = cardDeckEntries.findIndex(entry => entry.card_id === card.id)
    const cardDeckEntry = cardDeckEntries[cardDeckEntryIndex]

    const cardInDeck = {
      ...card,
      n_in_deck: cardDeckEntry.n_in_deck,
      sideboard: cardDeckEntry.sideboard
    }

    delete cardInDeck.card_set_id

    const cardInDeckInCamelCase = transformKeysFromSnakeCaseToCamelCase(cardInDeck)

    cardDeckEntries.splice(cardDeckEntryIndex, 1)
    cardsInDeck.push(cardInDeckInCamelCase)
  }

  const createdDeck = {
    ...deckInCamelCase,
    cards: cardsInDeck.map(card => ({ ...card }))
  }

  return createdDeck
}

const deckWithIdNumberOne = createDeckWithIdNumberOne()

beforeAll(async () => {
  await formatDatabaseForTests()
})

afterAll(async() => {
  await sequelize.close()
})

describe('/api/decks', () => {
  describe('When user asks for a deck', () => {
    const deckId = 1
    describe('if successful', () => {
      let responseData

      beforeAll(async () => {
        await prepareDatabase()
        responseData = await api
          .get(`/api/decks/${deckId}`)
      })

      test('responds with 200', () => {
        expect(responseData.statusCode).toBe(200)
      })

      test('returns expected object', () => {
        const responseObject = responseData.body
        expect(responseObject).toEqual(deckWithIdNumberOne)
      })
    })
    describe('if unsuccessful', () => {
      let responseData
      beforeAll(async () => {
        await prepareDatabase()
      })

      describe('when invalid id', () => {
        beforeAll(async () => {
          responseData = await api
            .get('/api/decks/1_invalid')
        })

        test('responds with 400', () => {
          expect(responseData.statusCode).toBe(400)
        })

        test('responds with expeted object', () => {
          const expectedObject = {
            error: 'Invalid id type',
            expectedType: 'INTEGER'
          }

          const responseObject = responseData.body

          expect(responseObject).toEqual(expectedObject)
        })
      })

      describe('when non-existing id', () => {
        beforeAll(async () => {
          responseData = await api
            .get('/api/decks/1234')
        })

        test('responds with 404', () => {
          expect(responseData.statusCode).toBe(404)
        })
      })
    })
  })

  describe('When user adds new deck', () => {
    describe('if successful', () => {
      describe('when no cards', () => {
        let responseData
        let decksTableBeforeAdd
        let deckCardsTableBeforeAdd
        let decksTableAfterAdd
        let deckCardsTableAfterAdd
        beforeAll(async () => {
          await prepareDatabase()
          const newDeckWithoutCards = {
            ...newDeck,
            cards: []
          }

          decksTableBeforeAdd = await queryTableContent('decks')
          deckCardsTableBeforeAdd = await queryTableContent('deck_cards')

          responseData = await api
            .post('/api/decks')
            .send(newDeckWithoutCards)

          decksTableAfterAdd = await queryTableContent('decks')
          deckCardsTableAfterAdd = await queryTableContent('deck_cards')
        })

        test('responds with 201', () => {
          expect(responseData.statusCode).toBe(201)
        })

        test('returns expected object', () => {
          const expectedObject = {
            id: 4,
            userId: newDeck.userId,
            name: newDeck.name,
            notes: newDeck.notes,
            cards: []
          }

          const responseObject = responseData.body

          expect(responseObject).toEqual(expectedObject)
        })

        describe('in database', () => {
          const expectedDeck = {
            id: 4,
            user_id: newDeck.userId,
            name: newDeck.name,
            notes: newDeck.notes
          }

          test('deck is added into the cards table', () => {
            const nOfDecksBefore = decksTableBeforeAdd.length

            expect(decksTableAfterAdd).not.toEqual(decksTableBeforeAdd)
            expect(decksTableAfterAdd).toContainEqual(expectedDeck)
            expect(decksTableAfterAdd).toHaveLength(nOfDecksBefore + 1)
          })

          test('nothing is added to card_decks table', () => {
            expect(deckCardsTableAfterAdd).toEqual(deckCardsTableBeforeAdd)
          })
        })
      })

      describe('when cards', () => {
        let responseData
        let decksTableBeforeAdd
        let deckCardsTableBeforeAdd
        let decksTableAfterAdd
        let deckCardsTableAfterAdd

        beforeAll(async () => {
          await prepareDatabase()
          const newDeckWithCards = {
            ...newDeck,
            cards: newDeck.cards.map(card => ({ ...card }))
          }

          decksTableBeforeAdd = await queryTableContent('decks')
          deckCardsTableBeforeAdd = await queryTableContent('deck_cards')

          responseData = await api
            .post('/api/decks')
            .send(newDeckWithCards)

          decksTableAfterAdd = await queryTableContent('decks')
          deckCardsTableAfterAdd = await queryTableContent('deck_cards')        })

        test('responds with 201', () => {
          expect(responseData.statusCode).toBe(201)
        })

        test('returns expected object', () => {
          const expectedObject = {
            id: 4,
            userId: newDeck.userId,
            name: newDeck.name,
            notes: newDeck.notes,
            cards: newDeck.cards.map(card => ({ ...card }) )
          }

          const responseObject = responseData.body

          expect(responseObject).toEqual(expectedObject)
        })

        describe('in database', () => {
          const expectedAddedDeck = {
            id: 4,
            user_id: newDeck.userId,
            name: newDeck.name,
            notes: newDeck.notes
          }

          test('deck is added to the decks table', () => {
            expect(decksTableAfterAdd).not.toEqual(decksTableBeforeAdd)
            expect(decksTableAfterAdd).toContainEqual(expectedAddedDeck)
            expect(decksTableAfterAdd).toHaveLength(decksTableBeforeAdd.length + 1)
          })

          test('cards are added to the deck_cards table', () => {
            const addedDeckCardRows = [ ...newDeckCards ]

            expect(deckCardsTableAfterAdd).not.toEqual(deckCardsTableBeforeAdd)
            expect(deckCardsTableAfterAdd)
              .toHaveLength(deckCardsTableBeforeAdd.length + addedDeckCardRows.length)

            for (const card of addedDeckCardRows) {
              expect(deckCardsTableAfterAdd).toContainEqual(card)
            }
          })
        })
      })
    })
    describe('if unsuccesful', () => {
      describe('when invalid deck information', () => {
        let responseData

        const invalidDeck = { ...newDeck, cards: newDeck.cards.map(card => ({ ...card })) }
        invalidDeck.name = ['invalid']
        delete invalidDeck.cards

        beforeAll(async () => {
          responseData = await api
            .post('/api/decks')
            .send(invalidDeck)
        })

        test('responds with 400', () => {
          expect(responseData.statusCode).toBe(400)
        })

        test('responds with expected error information', () => {
          const expectedObject = {
            error: 'Invalid or missing data',
            invalidProperties: {
              name: 'INVALID',
              cards: 'MISSING'
            }
          }

          const responseObject = responseData.body

          expect(responseObject).toEqual(expectedObject)
        })
      })

      describe('when invalid cards', () => {
        let responseData

        const invalidDeck = { ...newDeck, cards: newDeck.cards.map(card => ({ ...card })) }
        invalidDeck.cards[0].name = ['invalid']
        invalidDeck.cards[0].extra = 'extra'
        delete invalidDeck.cards[2].name

        beforeAll(async () => {
          responseData = await api
            .post('/api/decks')
            .send(invalidDeck)
        })

        test('responds with 400', () => {
          expect(responseData.statusCode).toBe(400)
        })

        test('responds with expected error information', () => {
          const expectedObject = {
            error: 'Invalid or missing data',
            invalidProperties: {
              cards: 'INVALID',
              cardObject: [
                {
                  index: '0',
                  name: 'INVALID',
                  extra: 'UNEXPECTED'
                },
                {
                  index: '2',
                  name: 'MISSING'
                }
              ]
            }
          }

          const responseObject = responseData.body

          expect(responseObject).toEqual(expectedObject)
        })
      })
    })
  })

  describe('When user deletes a deck', () => {
    const deckId = 1
    const deletedDeckRow = { ...testDecksWithId[deckId-1] }
    const deletedDeckCards = testCardDeckCombinations.filter(cardDeck => cardDeck.deck_id === deckId)

    describe('if successful', () => {
      let responseData
      let decksTableBeforeDelete
      let deckCardsTableBeforeDelete
      let decksTableAfterDelete
      let deckCardsTableAfterDelete

      beforeAll(async () => {
        await prepareDatabase()

        decksTableBeforeDelete = await queryTableContent('decks')
        deckCardsTableBeforeDelete = await queryTableContent('deck_cards')

        responseData = await api
          .delete(`/api/decks/${deckId}`)

        decksTableAfterDelete = await queryTableContent('decks')
        deckCardsTableAfterDelete = await queryTableContent('deck_cards')
      })

      test('responds with 204', () => {
        expect(responseData.statusCode).toBe(204)
      })

      describe('in database', () => {
        test('deck is removed from cards table', () => {
          expect(decksTableBeforeDelete).toContainEqual(deletedDeckRow)
          expect(decksTableAfterDelete).toHaveLength(decksTableBeforeDelete.length - 1)
          expect(decksTableAfterDelete).not.toContainEqual(deletedDeckRow)
        })

        test('deck\'s cards are removed from card_decks table', () => {
          const nOfDeckCardsBeforeDelete = deckCardsTableBeforeDelete.length
          const nOfDeletedCards = deletedDeckCards.length

          expect(deckCardsTableAfterDelete)
            .toHaveLength(nOfDeckCardsBeforeDelete - nOfDeletedCards)

          for (const cardInfo of deletedDeckCards) {
            expect(deckCardsTableAfterDelete).not.toContainEqual(cardInfo)
          }
        })
      })
    })

    describe('if unsuccessful', () => {
      describe('if invalid id', () => {
        let responseData

        beforeAll(async () => {
          await prepareDatabase()
          responseData = await api
            .delete('/api/decks/2_invalid')
        })

        test('responds with 400', () => {
          expect(responseData.statusCode).toBe(400)
        })

        test('responds with expected error information', () => {
          const expectedObject = {
            error: 'Invalid id type',
            expectedType: 'INTEGER'
          }

          const responseObject = responseData.body

          expect(responseObject).toEqual(expectedObject)
        })
      })

      describe('if non-existing id', () => {
        let receivedData
        const updatedDeck = transformKeysFromSnakeCaseToCamelCase(testDecksWithId[deckId - 1])
        updatedDeck.name = 'Updated name'

        beforeAll(async () => {
          await prepareDatabase()
          receivedData = await api
            .put('/api/decks/1234?update=information')
            .send(updatedDeck)
        })

        test('responds with 404', () => {
          expect(receivedData.statusCode).toEqual(404)
        })
      })

      describe('when non-existing id', () => {
        let responseData

        beforeAll(async () => {
          await prepareDatabase()
          responseData = await api
            .delete('/api/decks/1234')
        })

        test('responds with 404', () => {
          expect(responseData.statusCode).toBe(404)
        })
      })
    })
  })

  describe('When user updates deck', () => {
    const deckId = 1
    describe('if invalid id', () => {
      let receivedData
      const updatedDeck = transformKeysFromSnakeCaseToCamelCase(testDecksWithId[deckId - 1])
      updatedDeck.name = 'Updated name'

      beforeAll(async () => {
        await prepareDatabase()
        receivedData = await api
          .put('/api/decks/1_invalid?update=information')
          .send(updatedDeck)
      })

      test('responds with 400', () => {
        expect(receivedData.statusCode).toEqual(400)
      })

      test('responds with expected error information', () => {
        const expectedObject = {
          error: 'Invalid id type',
          expectedType: 'INTEGER'
        }

        const receivedObject = receivedData.body

        expect(receivedObject).toEqual(expectedObject)
      })
    })
    describe('if request parameter on what to update is invalid', () => {
      describe('when missing', () => {
        let receivedData
        const updatedDeck = { ...testDecksWithId[deckId - 1] }
        updatedDeck.name = 'Updated name'

        beforeAll(async () => {
          receivedData = await api
            .put(`/api/decks/${deckId}`)
            .send(updatedDeck)
        })

        test('responds with 400', () => {
          expect(receivedData.statusCode).toBe(400)
        })

        test('responds with expected error information', () => {
          const expectedObject = {
            error: 'A request parameter is required',
            missingParameters: { update: 'information or cards' }
          }

          const receivedObject = receivedData.body

          expect(receivedObject).toEqual(expectedObject)
        })
      })

      describe('when not \'information\' or \'missing\'', () => {
        let receivedData
        const updatedDeck = transformKeysFromSnakeCaseToCamelCase(testDecksWithId[deckId - 1])
        updatedDeck.name = 'Updated name'

        beforeAll(async () => {
          await prepareDatabase()
          receivedData = await api
            .put('/api/decks/1?update=invalid_parameter')
            .send(updatedDeck)
        })

        test('responds with 400', () => {
          expect(receivedData.statusCode).toBe(400)
        })

        test('responds with expected error information', () => {
          const expectedObject = {
            error: 'Invalid request parameter',
            missingParameters: {
              update: 'information or cards'
            }
          }

          const receivedObject = receivedData.body

          expect(receivedObject).toEqual(expectedObject)
        })
      })
    })
    describe('when deck information is changed', () => {
      describe('if successful', () => {
        let receivedData
        let decksTableBeforeUpdate
        let decksTableAfterUpdate
        const originalDeck = { ...testDecksWithId[deckId - 1] }
        const updatedDeckSnakeCase = { ...testDecksWithId[deckId - 1] }
        updatedDeckSnakeCase.name = 'Updated name'

        const updatedDeckCamelCase = transformKeysFromSnakeCaseToCamelCase(updatedDeckSnakeCase)

        beforeAll(async () => {
          await prepareDatabase()

          decksTableBeforeUpdate = await queryTableContent('decks')

          receivedData = await api
            .put(`/api/decks/${deckId}?update=information`)
            .send(updatedDeckCamelCase)

          decksTableAfterUpdate = await queryTableContent('decks')
        })

        test('responds with 200', () => {
          expect(receivedData.statusCode).toBe(200)
        })

        test('returns updated deck info', () => {
          const receivedObject = receivedData.body
          expect(receivedObject).toEqual(updatedDeckCamelCase)
        })

        test('deck table in the database is modified', () => {
          expect(decksTableAfterUpdate).toHaveLength(decksTableBeforeUpdate.length)
          expect(decksTableAfterUpdate).not.toContainEqual(originalDeck)
          expect(decksTableAfterUpdate).toContainEqual(updatedDeckSnakeCase)
        })
      })

      describe('if unsuccessful', () => {
        describe('when invalid value in the update information', () => {
          let receivedData
          const updatedDeck = transformKeysFromSnakeCaseToCamelCase(testDecksWithId[deckId - 1])
          updatedDeck.name = ['Updated name']

          beforeAll(async () => {
            await prepareDatabase()
            receivedData = await api
              .put(`/api/decks/${deckId}?update=information`)
              .send(updatedDeck)
          })

          test('responds with 400', () => {
            expect(receivedData.statusCode).toEqual(400)
          })

          test('responds with expected error information', () => {
            const expectedObject = {
              error: 'Invalid or missing data',
              invalidProperties: {
                name: 'INVALID'
              }
            }

            const receivedObject = receivedData.body

            expect(receivedObject).toEqual(expectedObject)
          })
        })
      })
    })

    describe('when deck\'s cards are modified', () => {
      describe('if successful', () => {
        let receivedData
        let deckCardsTableBeforeModification
        let deckCardsTableAfterModification
        beforeAll(async () => {
          await prepareDatabase()

          deckCardsTableBeforeModification = await queryTableContent('deck_cards')
          receivedData = await api
            .put(`/api/decks/${deckId}?update=cards`)
            .send(testCardUpdatesOnDeckWithIdOne)
          deckCardsTableAfterModification = await queryTableContent('deck_cards')

        })

        test('responds with 200', () => {
          expect(receivedData.statusCode).toBe(200)
        })

        test('returns expected object', () => {
          const expectedObject = {
            added: [
              { ...testCardUpdatesOnDeckWithIdOne.added[0] },
              { ...testCardUpdatesOnDeckWithIdOne.added[1] },
              { ...testCardUpdatesOnDeckWithIdOne.added[2] }
            ],
            deleted: 2,
            updated: [
              { ...testCardUpdatesOnDeckWithIdOne.updated[0] },
              { ...testCardUpdatesOnDeckWithIdOne.updated[1] }
            ]
          }

          const receivedObject = receivedData.body

          expect(receivedObject).toEqual(expectedObject)
        })

        describe('deck_cards table in the database is modified', () => {
          test('number of rows increases by one (3 added, 2 deleted, 2 updated)', () => {
            const expectedNOfDeckCards = deckCardsTableBeforeModification.length + 1
            expect(deckCardsTableAfterModification).toHaveLength(expectedNOfDeckCards)
          })

          test('expected rows are added', () => {
            const expectedAddedRows = [
              {
                deck_id: deckId,
                card_id: testCardUpdatesOnDeckWithIdOne.added[0].id,
                n_in_deck: testCardUpdatesOnDeckWithIdOne.added[0].nInDeck,
                sideboard: testCardUpdatesOnDeckWithIdOne.added[0].sideboard
              },
              {
                deck_id: deckId,
                card_id: testCardUpdatesOnDeckWithIdOne.added[1].id,
                n_in_deck: testCardUpdatesOnDeckWithIdOne.added[1].nInDeck,
                sideboard: testCardUpdatesOnDeckWithIdOne.added[1].sideboard
              },
              {
                deck_id: deckId,
                card_id: testCardUpdatesOnDeckWithIdOne.added[1].id,
                n_in_deck: testCardUpdatesOnDeckWithIdOne.added[1].nInDeck,
                sideboard: testCardUpdatesOnDeckWithIdOne.added[1].sideboard
              }
            ]

            for (const row of expectedAddedRows) {
              expect(deckCardsTableBeforeModification).not.toContainEqual(row)
            }

            for (const row of expectedAddedRows) {
              expect(deckCardsTableAfterModification).toContainEqual(row)
            }
          })

          test('expected rows are deleted', () => {
            const rowsThatShouldNotExist = [
              {
                deck_id: deckId,
                card_id: testCardUpdatesOnDeckWithIdOne.deleted[0].id,
                n_in_deck: testCardUpdatesOnDeckWithIdOne.deleted[0].nInDeck,
                sideboard: testCardUpdatesOnDeckWithIdOne.deleted[0].sideboard
              },
              {
                deck_id: deckId,
                card_id: testCardUpdatesOnDeckWithIdOne.deleted[1].id,
                n_in_deck: testCardUpdatesOnDeckWithIdOne.deleted[1].nInDeck,
                sideboard: testCardUpdatesOnDeckWithIdOne.deleted[1].sideboard
              }
            ]

            for (const row of rowsThatShouldNotExist) {
              expect(deckCardsTableBeforeModification).toContainEqual(row)
            }

            for (const row of rowsThatShouldNotExist) {
              expect(deckCardsTableAfterModification).not.toContainEqual(row)
            }
          })

          test('expected rows are updated', () => {
            const expectedRowsBeforeUpdate = [
              {
                deck_id: 1,
                card_id: 6,
                n_in_deck: 1,
                sideboard: false
              },
              {
                deck_id: 1,
                card_id: 8,
                n_in_deck: 3,
                sideboard: false
              }
            ]

            const expectedRowsAfterUpdate = [
              {
                deck_id: deckId,
                card_id: testCardUpdatesOnDeckWithIdOne.updated[0].id,
                n_in_deck: testCardUpdatesOnDeckWithIdOne.updated[0].nInDeck,
                sideboard: testCardUpdatesOnDeckWithIdOne.updated[0].sideboard
              },
              {
                deck_id: deckId,
                card_id: testCardUpdatesOnDeckWithIdOne.updated[1].id,
                n_in_deck: testCardUpdatesOnDeckWithIdOne.updated[1].nInDeck,
                sideboard: testCardUpdatesOnDeckWithIdOne.updated[1].sideboard
              }
            ]

            for (const row of expectedRowsBeforeUpdate) {
              expect(deckCardsTableAfterModification).not.toContainEqual(row)
            }

            for (const row of expectedRowsAfterUpdate) {
              expect(deckCardsTableAfterModification).toContainEqual(row)
            }
          })
        })
      })
      describe('if unsuccessful', () => {
        let receivedData
        let deckCardsTableBeforeModification
        let deckCardsTableAfterModification

        describe('when invalid values in modified cards', () => {
          const addedCards = testCardUpdatesOnDeckWithIdOne.added.map(card => ({ ...card }))
          delete addedCards[0].nInDeck

          const deletedCards = testCardUpdatesOnDeckWithIdOne.deleted.map(card => ({ ...card }))
          deletedCards[1].id = [12]

          const updatedCards = testCardUpdatesOnDeckWithIdOne.updated.map(card => ({ ...card }))
          updatedCards[0].sideboard = [true]
          updatedCards[1].id = 'moi'

          const invalidCardModifications = {
            added: addedCards,
            deleted: deletedCards,
            updated: updatedCards
          }

          beforeAll(async () => {
            await prepareDatabase()
            deckCardsTableBeforeModification = await queryTableContent('deck_cards')

            receivedData = await api
              .put(`/api/decks/${deckId}?update=cards`)
              .send(invalidCardModifications)

            deckCardsTableAfterModification = await queryTableContent('deck_cards')
          })

          test('responds with 400', () => {
            expect(receivedData.statusCode).toBe(400)
          })

          test('responds with expected error information', () => {
            const expectedObject = {
              error: 'Invalid or missing data',
              invalidProperties: {
                added: [
                  {
                    index: '0',
                    nInDeck: 'MISSING'
                  }
                ],
                deleted: [
                  {
                    index: '1',
                    id: 'INVALID'
                  }
                ],
                updated: [
                  {
                    index: '0',
                    sideboard: 'INVALID'
                  },
                  {
                    index: '1',
                    id: 'INVALID'
                  }
                ]
              }
            }

            const receivedObject = receivedData.body

            expect(receivedObject).toEqual(expectedObject)
          })

          test('deck_cards table in the database is not modified', () => {
            expect(deckCardsTableAfterModification).toEqual(deckCardsTableBeforeModification)
          })
        })
      })
    })
  })
})