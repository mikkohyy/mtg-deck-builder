const {
  testCardSetsWithId,
  testCardsWithId,
  newCard
} = require('./test_data')

const {
  transformKeysFromSnakeCaseToCamelCase,
  queryTableContentWithId,
  queryTableContent
} = require('./test_helpers')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const { sequelize } = require('../utils/db')
const queryInterface = sequelize.getQueryInterface()

sequelize.options.logging = false

const TEST_CARD_ID = 3
const NON_EXISTING_CARD_ID = 234
const INVALID_ID = '3_not_valid'

beforeAll(async () => {
  await queryInterface.bulkDelete('deck_cards')
  await queryInterface.bulkDelete('cards')
})

afterAll(async () => {
  sequelize.close()
})

const prepareDatabase = async () => {
  await queryInterface.bulkDelete('card_sets')
  await queryInterface.bulkDelete('cards')
  await sequelize.query('ALTER SEQUENCE "cards_id_seq" RESTART WITH 31')
  await queryInterface.bulkInsert('card_sets', testCardSetsWithId)
  await queryInterface.bulkInsert('cards', testCardsWithId)
}

describe('/api/cards', () => {
  describe('When user asks for an individual card', () => {
    beforeAll(async () => {
      await prepareDatabase()
    })

    describe('if successful', () => {
      let receivedData
      beforeAll(async () => {
        receivedData = await api
          .get(`/api/cards/${TEST_CARD_ID}`)
      })

      test('responds with 200', () => {
        expect(receivedData.statusCode).toBe(200)
      })

      test('responds with json', () => {
        expect(receivedData.type).toBe('application/json')
      })

      test('returns expected card', () => {
        const expectedObject = {
          'id': 3,
          'cardSetId': 1,
          'name': 'Ludevic, Necrogenius',
          'cardNumber': 233,
          'manaCost': 'blue black',
          'price': 0.4,
          'rulesText': 'Whenever Ludevic, Necrogenius enters the battlefield or attacks, mill a card.\n{X}{U}{U}{B}{B}, Exile X creature cards from your graveyard: Transform Ludevic. X can\'t be 0. Activate only as a sorcery.\n\n//\n\nAs this creature transforms into Olag, Ludevic\'s Hubris, it becomes a copy of a creature card exiled with it, except its name is Olag, Ludevic\'s Hubris, it\'s 4/4, and it\'s a legendary blue and black Zombie in addition to its other colors and types. Put a number of +1/+1 counters on Olag equal to the number of creature cards exiled with it.',
          'rarity': 'rare'
        }

        const returnedObject = receivedData.body

        expect(returnedObject).toEqual(expectedObject)
      })
    })
    describe('if unsuccessful', () => {
      describe('when invalid id', () => {
        let receivedData
        beforeAll(async () => {
          receivedData = await api
            .get('/api/cards/3_not_valid')
        })

        test('returns 400', () => {
          expect(receivedData.statusCode).toBe(400)
        })

        test('returns expected error information', () => {
          const expectedObject = {
            error: 'Invalid id type',
            expectedType: 'INTEGER'
          }
          const receivedObject = receivedData.body

          expect(receivedObject).toEqual(expectedObject)
        })
      })

      describe('when card does not exist', () => {
        let receivedData
        beforeAll(async () => {
          receivedData = await api
            .get(`/api/cards/${NON_EXISTING_CARD_ID}`)
        })

        test('returns 404', () => {
          expect(receivedData.statusCode).toBe(404)
        })
      })
    })
  })

  describe('When user updates a card', () => {
    const updatedCard = transformKeysFromSnakeCaseToCamelCase(testCardsWithId[2])
    updatedCard.price = 50.356

    beforeAll(async () => {
      await prepareDatabase()
    })

    describe('when successful', () => {
      let receivedData
      beforeAll(async () => {
        receivedData = await api
          .put(`/api/cards/${TEST_CARD_ID}`)
          .send(updatedCard)
      })

      test('responds with 200', () => {
        expect(receivedData.statusCode).toBe(200)
      })

      test('expected object (updated card) is returned', () => {
        const expectedObject = {
          'id': 3,
          'cardSetId': 1,
          'name': 'Ludevic, Necrogenius',
          'cardNumber': 233,
          'manaCost': 'blue black',
          'price': 50.356,
          'rulesText': 'Whenever Ludevic, Necrogenius enters the battlefield or attacks, mill a card.\n{X}{U}{U}{B}{B}, Exile X creature cards from your graveyard: Transform Ludevic. X can\'t be 0. Activate only as a sorcery.\n\n//\n\nAs this creature transforms into Olag, Ludevic\'s Hubris, it becomes a copy of a creature card exiled with it, except its name is Olag, Ludevic\'s Hubris, it\'s 4/4, and it\'s a legendary blue and black Zombie in addition to its other colors and types. Put a number of +1/+1 counters on Olag equal to the number of creature cards exiled with it.',
          'rarity': 'rare'
        }
        const receivedObject = receivedData.body

        expect(receivedObject).toEqual(expectedObject)
      })

      test('card in the database is updated', async () => {
        const expectedCard = {
          'id': 3,
          'card_set_id': 1,
          'name': 'Ludevic, Necrogenius',
          'card_number': 233,
          'mana_cost': 'blue black',
          'price': 50.356,
          'rules_text': 'Whenever Ludevic, Necrogenius enters the battlefield or attacks, mill a card.\n{X}{U}{U}{B}{B}, Exile X creature cards from your graveyard: Transform Ludevic. X can\'t be 0. Activate only as a sorcery.\n\n//\n\nAs this creature transforms into Olag, Ludevic\'s Hubris, it becomes a copy of a creature card exiled with it, except its name is Olag, Ludevic\'s Hubris, it\'s 4/4, and it\'s a legendary blue and black Zombie in addition to its other colors and types. Put a number of +1/+1 counters on Olag equal to the number of creature cards exiled with it.',
          'rarity': 'rare'
        }
        const queryResponse = await queryTableContentWithId('cards', TEST_CARD_ID)
        const cardInDatabase = queryResponse[0]

        expect(cardInDatabase).toEqual(expectedCard)
      })
    })
    describe('if unsuccessful', () => {
      describe('when invalid id', () => {
        let receivedData
        beforeAll(async () => {
          receivedData = await api
            .put(`/api/cards/${INVALID_ID}`)
            .send(updatedCard)
        })

        test('returns 400', () => {
          expect(receivedData.statusCode).toBe(400)
        })

        test('returns expected error message', () => {
          const expectedObject = {
            error: 'Invalid id type',
            expectedType: 'INTEGER'
          }

          const returnedObject = receivedData.body

          expect(returnedObject).toEqual(expectedObject)
        })
      })
      describe('when card does not exist', () => {
        let receivedData
        beforeAll(async () => {
          receivedData = await api
            .put(`/api/cards/${NON_EXISTING_CARD_ID}`)
            .send(updatedCard)
        })

        test('returns 404', () => {
          expect(receivedData.statusCode).toBe(404)
        })
      })
      describe('when received card object is invalid', () => {
        let receivedData
        beforeAll(async () => {
          const invalidUpdatedCard = { ...updatedCard }
          invalidUpdatedCard.name = ['Ludevic, Necrogenius']
          delete invalidUpdatedCard.cardNumber

          receivedData = await api
            .put(`/api/cards/${TEST_CARD_ID}`)
            .send(invalidUpdatedCard)
        })
        test('returns 400', () => {
          expect(receivedData.statusCode).toBe(400)
        })

        test('returns expected error information', () => {
          const expectedObject = {
            error: 'Invalid or missing data',
            invalidProperties: {
              name: 'INVALID',
              cardNumber: 'MISSING'
            }
          }
          const receivedObject = receivedData.body

          expect(receivedObject).toEqual(expectedObject)
        })
      })
    })
  })

  describe('When user deletes a card from the server', () => {
    describe('if successful', () => {
      let cardsTableAfterDelete
      let cardsTableBeforeDelete
      let receivedData

      beforeAll(async () => {
        await prepareDatabase()
        cardsTableBeforeDelete = await queryTableContent('cards')

        receivedData = await api
          .delete(`/api/cards/${TEST_CARD_ID}`)
        cardsTableAfterDelete = await queryTableContent('cards')
      })

      test('responds with 204', () => {
        expect(receivedData.statusCode).toBe(204)
      })

      test('card is deleted from the database', async () => {
      })

      test('the card is deleted', async () => {
        const cardIdsAfterDelete = cardsTableAfterDelete.map(card => card.id)

        expect(cardsTableAfterDelete).not.toHaveLength(cardsTableBeforeDelete.length)
        expect(cardIdsAfterDelete).not.toContain(TEST_CARD_ID)
      })
    })

    describe('if unsuccessful', () => {
      beforeAll(async () => {
        await prepareDatabase()
      })
      describe('when invalid id', () => {
        let cardsTableAfterDelete
        let cardsTableBeforeDelete
        let receivedData

        beforeAll(async () => {
          cardsTableBeforeDelete = await queryTableContent('cards')

          receivedData = await api
            .delete(`/api/cards/${INVALID_ID}`)

          cardsTableAfterDelete = await queryTableContent('cards')
        })

        test('responds with 400', () => {
          expect(receivedData.statusCode).toBe(400)
        })

        test('responds with expected error information', () => {
          const expectedObject = {
            error: 'Invalid id type',
            expectedType: 'INTEGER'
          }

          const receivedObject = receivedData.body

          expect(receivedObject).toEqual(expectedObject)
        })

        test('nothing changes in the database', () => {
          expect(cardsTableAfterDelete).toHaveLength(cardsTableBeforeDelete.length)
        })
      })

      describe('when non existing id', () => {
        let cardsTableAfterDelete
        let cardsTableBeforeDelete
        let receivedData

        beforeAll(async () => {
          cardsTableBeforeDelete = await queryTableContent('cards')

          receivedData = await api
            .delete(`/api/cards/${NON_EXISTING_CARD_ID}`)

          cardsTableAfterDelete = await queryTableContent('cards')
        })

        test('responds with 404', () => {
          expect(receivedData.statusCode).toBe(404)
        })

        test('nothing changes in the database', () => {
          expect(cardsTableAfterDelete).toHaveLength(cardsTableBeforeDelete.length)
        })
      })
    })
  })

  describe('When user adds an individual card', () => {
    describe('if successful', () => {
      let receivedData
      beforeAll(async() => {
        await prepareDatabase()
        receivedData = await api
          .post('/api/cards')
          .send(newCard)

      })

      test('responds with 201', () => {
        expect(receivedData.statusCode).toBe(201)
      })

      test('responds with json', async () => {
        expect(receivedData.type).toBe('application/json')
      })

      test('returns expected object', async () => {
        const expectedObject = {
          'id': 31,
          'cardSetId': 1,
          'name': 'Bladestitched Skaab',
          'cardNumber': 212,
          'manaCost': 'blue black',
          'price': 0.13,
          'rulesText': 'Other Zombies you control get +1/+0.',
          'rarity': 'uncommon'
        }

        const receivedObject = receivedData.body

        expect(receivedObject).toEqual(expectedObject)
      })
    })

    describe('if unsuccessful', () => {
      let receivedData
      beforeAll(async() => {
        await prepareDatabase()

        const invalidCard = { ...newCard }

        invalidCard.name = ['not valid']
        delete invalidCard.rulesText

        receivedData = await api
          .post('/api/cards')
          .send(invalidCard)
      })

      test('returns 400', async() => {
        expect(receivedData.statusCode).toBe(400)
      })

      test('returns json', async() => {
        expect(receivedData.type).toBe('application/json')
      })

      test('returns expected error information', async() => {
        const expectedObject = {
          error: 'Invalid or missing data',
          invalidProperties: {
            'name': 'INVALID',
            'rulesText': 'MISSING'
          }
        }

        const receivedObject = receivedData.body

        expect(receivedObject).toEqual(expectedObject)
      })
    })
  })
})