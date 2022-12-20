const {
  transformKeysFromSnakeCaseToCamelCase,
  queryTableContent,
  getTokenFromIdAndUsername
} = require('./test_helpers')

const {
  testDecksWithId,
  testCardDeckCombinations,
  testCardSetsWithId,
  testCardsWithId,
  testUsersWithId,
  newDeck,
  newDeckCards,
  testCardUpdatesOnDeckWithIdOne,
  testDeckCardsTableRowsWithIdOne
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
    const decksUserId = 1
    const decksUsername = 'zerocool'
    const userToken = getTokenFromIdAndUsername(decksUserId, decksUsername)
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
            cards: {
              added: [],
              deleted: [],
              updated: []
            }
          }

          decksTableBeforeAdd = await queryTableContent('decks')
          deckCardsTableBeforeAdd = await queryTableContent('deck_cards')

          responseData = await api
            .post('/api/decks')
            .send(newDeckWithoutCards)
            .set({ Authorization: userToken })

          decksTableAfterAdd = await queryTableContent('decks')
          deckCardsTableAfterAdd = await queryTableContent('deck_cards')
        })

        test('responds with 201', () => {
          expect(responseData.statusCode).toBe(201)
        })

        test('returns expected object', () => {
          const expectedObject = {
            id: 4,
            name: newDeck.name,
            notes: newDeck.notes,
            userId: decksUserId,
            cards: {
              added: [],
              deleted: [],
              updated: []
            }
          }

          const responseObject = responseData.body

          expect(responseObject).toEqual(expectedObject)
        })

        describe('in database', () => {
          const expectedDeck = {
            id: 4,
            user_id: decksUserId,
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
            cards: {
              added: newDeck.cards.map(card => ({ ...card })),
              deleted: [],
              updated: []
            }
          }

          decksTableBeforeAdd = await queryTableContent('decks')
          deckCardsTableBeforeAdd = await queryTableContent('deck_cards')

          responseData = await api
            .post('/api/decks')
            .send(newDeckWithCards)
            .set({ Authorization: userToken })

          decksTableAfterAdd = await queryTableContent('decks')
          deckCardsTableAfterAdd = await queryTableContent('deck_cards')
        })

        test('responds with 201', () => {
          expect(responseData.statusCode).toBe(201)
        })

        test('returns expected object', () => {
          const expectedObject = {
            id: 4,
            userId: decksUserId,
            name: newDeck.name,
            notes: newDeck.notes,
            cards: {
              added: newDeck.cards.map(card => ({ ...card }) ),
              deleted: [],
              updated: []
            }
          }

          const responseObject = responseData.body

          expect(responseObject).toEqual(expectedObject)
        })

        describe('in database', () => {
          const expectedAddedDeck = {
            id: 4,
            user_id: decksUserId,
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
            .set({ Authorization: userToken })
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

        const invalidDeck = {
          ...newDeck,
          cards: {
            added: newDeck.cards.map(card => ({ ...card })),
            deleted: [],
            updated: []
          }
        }
        invalidDeck.cards.added[0].name = ['invalid']
        invalidDeck.cards.added[0].extra = 'extra'
        delete invalidDeck.cards.added[2].name

        beforeAll(async () => {
          responseData = await api
            .post('/api/decks')
            .send(invalidDeck)
            .set({ Authorization: userToken })
        })

        test('responds with 400', () => {
          expect(responseData.statusCode).toBe(400)
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
                    name: 'INVALID',
                    extra: 'UNEXPECTED'
                  },
                  {
                    index: '2',
                    name: 'MISSING'
                  }
                ],
                deleted: [],
                updated: []
              }
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
        const updatedDeck = {
          ...transformKeysFromSnakeCaseToCamelCase(testDecksWithId[deckId - 1]),
          cards: {
            added: [],
            deleted: [],
            updated: []
          }
        }
        updatedDeck.name = 'Updated name'

        beforeAll(async () => {
          await prepareDatabase()
          receivedData = await api
            .delete('/api/decks/1234?update=information')
        })

        test('responds with 404', () => {
          expect(receivedData.statusCode).toEqual(404)
        })
      })
    })
  })
  describe('When user updates deck', () => {
    const deckId = 1
    describe('if successful', () => {
      let receivedData
      let decksTableBeforeUpdate
      let decksTableAfterUpdate
      let deckCardsTableBeforeUpdate
      let deckCardsTableAfterUpdate

      const originalDeck = { ...testDecksWithId[deckId - 1] }
      const updatedDeckSnakeCase = { ...testDecksWithId[deckId - 1] }
      updatedDeckSnakeCase.name = 'Updated name'
      const copyOfUpdatedDeck = { ...updatedDeckSnakeCase }
      delete copyOfUpdatedDeck.user_id
      const { added, deleted, updated } = testCardUpdatesOnDeckWithIdOne

      const updatedDeck = {
        ...transformKeysFromSnakeCaseToCamelCase(copyOfUpdatedDeck),
        cards: {
          added: added.map(card => ({ ...card })),
          deleted: deleted.map(card => ({ ...card })),
          updated: updated.map(card => ({ ...card }))
        }
      }

      beforeAll(async () => {
        await prepareDatabase()

        decksTableBeforeUpdate = await queryTableContent('decks')
        deckCardsTableBeforeUpdate = await queryTableContent('deck_cards')

        receivedData = await api
          .put(`/api/decks/${deckId}`)
          .send(updatedDeck)

        decksTableAfterUpdate = await queryTableContent('decks')
        deckCardsTableAfterUpdate = await queryTableContent('deck_cards')
      })

      test('responds with 200', () => {
        expect(receivedData.statusCode).toBe(200)
      })

      test('responds with expected object', () => {
        const expectedObject = {
          id: 1,
          name: 'Updated name',
          notes: 'A very basic Blue/Green ramp deck',
          userId: 1,
          cards: {
            added: added.map(card => ({ ...card })),
            deleted: 2,
            updated: updated.map(card => ({ ...card })),
          }
        }

        const receivedObject = receivedData.body

        expect(receivedObject).toEqual(expectedObject)
      })

      describe('in database', () => {
        describe('in \'decks\' table', () => {
          test('number of rows stays the same', () => {
            expect(decksTableAfterUpdate).toHaveLength(decksTableBeforeUpdate.length)
          })
          test('expected row is updated', () => {
            expect(decksTableAfterUpdate).not.toContainEqual(originalDeck)
            expect(decksTableAfterUpdate).toContainEqual(updatedDeckSnakeCase)
          })
        })
        describe('in \'deck_cards\' table', () => {
          test('number of rows increases by one (3 added, 2 deleted, 2 updated)', () => {
            expect(deckCardsTableAfterUpdate).toHaveLength(deckCardsTableBeforeUpdate.length + 1)
          })
          test('expected cards are added', () => {
            for (const card of testDeckCardsTableRowsWithIdOne.added) {
              expect(deckCardsTableBeforeUpdate).not.toContainEqual(card)
            }

            for (const card of testDeckCardsTableRowsWithIdOne.added) {
              expect(deckCardsTableAfterUpdate).toContainEqual(card)
            }

          })
          test('expected cards are deleted', () => {
            for (const card of testDeckCardsTableRowsWithIdOne.deleted) {
              expect(deckCardsTableBeforeUpdate).toContainEqual(card)
            }

            for (const card of testDeckCardsTableRowsWithIdOne.deleted) {
              expect(deckCardsTableAfterUpdate).not.toContainEqual(card)
            }
          })
          test('expected cards are updated', () => {
            const identificationInDatabase = deckCardsTableBeforeUpdate.map(card => (
              {
                deck_id: card.deck_id,
                card_id: card.card_id
              }
            ))

            for (const card of testDeckCardsTableRowsWithIdOne.updated) {
              const identificationInCard = {
                deck_id: card.deck_id,
                card_id: card.card_id
              }

              expect(identificationInDatabase).toContainEqual(identificationInCard)
              expect(deckCardsTableBeforeUpdate).not.toContainEqual(card)
            }

            for (const card of testDeckCardsTableRowsWithIdOne.updated) {
              expect(deckCardsTableAfterUpdate).toContainEqual(card)
            }
          })
        })
      })
    })
    describe('if unsuccesful', () => {
      describe('when invalid id', () => {
        let receivedData
        const updatedDeck = {
          ...transformKeysFromSnakeCaseToCamelCase(testDecksWithId[deckId - 1]),
          cards: {
            added: [],
            deleted: [],
            updated: []
          }
        }
        updatedDeck.name = 'Updated name'

        beforeAll(async () => {
          await prepareDatabase()
          receivedData = await api
            .put('/api/decks/1_invalid')
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
      describe('when non-existing id', () => {
        let receivedData

        const { added, deleted, updated } = testCardUpdatesOnDeckWithIdOne
        const updatedDeckSnakeCase = { ...testDecksWithId[deckId - 1] }
        updatedDeckSnakeCase.name = 'Updated name'
        delete updatedDeckSnakeCase.user_id

        const updatedDeck = {
          ...transformKeysFromSnakeCaseToCamelCase(updatedDeckSnakeCase),
          cards: {
            added: added.map(card => ({ ...card })),
            deleted: deleted.map(card => ({ ...card })),
            updated: updated.map(card => ({ ...card }))
          }
        }

        beforeAll(async () => {
          await prepareDatabase()
          receivedData = await api
            .put('/api/decks/1234')
            .send(updatedDeck)
        })
        test('responds with 404', () => {
          expect(receivedData.statusCode).toBe(404)
        })
      })
      describe('when sent data is invalid', () => {
        let receivedData
        let decksTableBeforeUpdate
        let decksTableAfterUpdate
        let deckCardsTableBeforeUpdate
        let deckCardsTableAfterUpdate

        const updatedDeckSnakeCase = { ...testDecksWithId[deckId - 1] }
        updatedDeckSnakeCase.name = 'Updated name'
        delete updatedDeckSnakeCase.user_id
        const { added, deleted, updated } = testCardUpdatesOnDeckWithIdOne

        const updatedDeck = {
          ...transformKeysFromSnakeCaseToCamelCase(updatedDeckSnakeCase),
          cards: {
            added: added.map(card => ({ ...card })),
            deleted: deleted.map(card => ({ ...card })),
            updated: updated.map(card => ({ ...card }))
          }
        }

        delete updatedDeck.name
        updatedDeck.extra = 'this is extra'
        updatedDeck.notes = ['this is invalid', 'notes']

        delete updatedDeck.cards.added[0].name
        updatedDeck.cards.added[1].extra = 'this is unnecessary'
        updatedDeck.cards.deleted[0].name = ['this', 'is', 'invalid']
        updatedDeck.cards.deleted[0].extra = 'this is unnecessary'

        beforeAll(async () => {
          await prepareDatabase()

          decksTableBeforeUpdate = await queryTableContent('decks')
          deckCardsTableBeforeUpdate = await queryTableContent('deck_cards')

          receivedData = await api
            .put(`/api/decks/${deckId}`)
            .send(updatedDeck)

          decksTableAfterUpdate = await queryTableContent('decks')
          deckCardsTableAfterUpdate = await queryTableContent('deck_cards')
        })
        test('responds with 400', () => {
          expect(receivedData.statusCode).toBe(400)
        })

        test('returns expected information', () => {
          const expectedObject = {
            error: 'Invalid or missing data',
            invalidProperties: {
              name: 'MISSING',
              notes: 'INVALID',
              cards: 'INVALID',
              extra: 'UNEXPECTED',
              cardObjects: {
                added: [
                  {
                    index: '0',
                    name: 'MISSING'
                  },
                  {
                    index: '1',
                    extra: 'UNEXPECTED'
                  }
                ],
                deleted: [
                  {
                    index: '0',
                    name: 'INVALID',
                    extra: 'UNEXPECTED'
                  }
                ],
                updated: []
              }
            }
          }

          const receivedObject = receivedData.body

          expect(receivedObject).toEqual(expectedObject)
        })
        describe('in database', () => {
          test('nothing changes in \'decks\' table', () => {
            expect(decksTableAfterUpdate).toEqual(decksTableBeforeUpdate)
          })
          test('nothing changes in \'deck_cards\' table', () => {
            expect(deckCardsTableAfterUpdate).toEqual(deckCardsTableBeforeUpdate)
          })

        })
      })
    })
  })
})