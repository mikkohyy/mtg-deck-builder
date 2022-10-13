const {
  testCardSetsWithId,
  testCardsWithId,
  testCards
} = require('./test_data')
const { transformSnakeCaseCardFieldsToCamelCase } = require('./test_helpers')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const { sequelize } = require('../utils/db')
const queryInterface = sequelize.getQueryInterface()

sequelize.options.logging = false

const firstTestCardSetWithId = [testCardSetsWithId[0]]
const firstTenCardsWithId = testCardsWithId.slice(0, 10)

const testCardWithCardSetId = { ...testCards[0], cardSetId: 1 }

beforeAll(async () => {
  await queryInterface.bulkDelete('deck_cards')
})

afterAll(async () => {
  sequelize.close()
})

describe('When user asks for individual card the server', () => {
  beforeEach(async () => {
    await queryInterface.bulkDelete('card_sets')
    await queryInterface.bulkDelete('cards')
    await sequelize.query('ALTER SEQUENCE "cards_id_seq" RESTART WITH 11')
    await queryInterface.bulkInsert('card_sets', firstTestCardSetWithId)
    await queryInterface.bulkInsert('cards', firstTenCardsWithId)
  })

  test('responds with 200', async () => {
    await api
      .get('/api/cards/3')
      .expect(200)
  })

  test('responds with json', async () => {
    await api
      .get('/api/cards/3')
      .expect('Content-Type', /application\/json/)
  })

  test('expected card has the right number of properties', async () => {
    const response = await api.get('/api/cards/3')
    const propertyNames = Object.keys(response.body)

    expect(propertyNames).toHaveLength(8)
  })

  test('expected card is returned', async () => {
    const expectedCard = { ...firstTenCardsWithId[2] }
    const response = await api.get('/api/cards/3')
    const receivedData = response.body

    expect(receivedData).toHaveProperty('id', expectedCard.id)
    expect(receivedData).toHaveProperty('cardSetId', expectedCard.card_set_id)
    expect(receivedData).toHaveProperty('name', expectedCard.name)
    expect(receivedData).toHaveProperty('cardNumber', expectedCard.card_number)
    expect(receivedData).toHaveProperty('manaCost', expectedCard.mana_cost)
    expect(receivedData).toHaveProperty('rulesText', expectedCard.rules_text)
    expect(receivedData).toHaveProperty('price', expectedCard.price)
    expect(receivedData).toHaveProperty('rarity', expectedCard.rarity)
  })

  test('returns 400 when invalid id', async () => {
    await api.get('/api/cards/3_not_valid_id').expect(400)
  })

  test('returns expected error message when invalid id', async () => {
    const { body } = await api.get('/api/cards/3_not_valid_id')

    expect(body.error).toMatch(/Invalid id type/)
    expect(body.expectedType).toBe('INTEGER')
  })

  test('returns 404 when id does not exist', async () => {
    await api
      .get('/api/cards/12345')
      .expect(404)
  })
})

describe('When user updates a card the server', () => {
  beforeEach(async() => {
    await queryInterface.bulkDelete('card_sets')
    await queryInterface.bulkDelete('cards')
    await sequelize.query('ALTER SEQUENCE "cards_id_seq" RESTART WITH 11')
    await queryInterface.bulkInsert('card_sets', firstTestCardSetWithId)
    await queryInterface.bulkInsert('cards', firstTenCardsWithId)
  })

  test('responds with 200', async () => {
    const updatedCard = transformSnakeCaseCardFieldsToCamelCase(testCardsWithId[0])
    updatedCard.price = 24.5

    await api
      .put('/api/cards/1')
      .send(updatedCard)
      .expect(200)
  })

  test('returned card has the right number of properties', async () => {
    const updatedCard = transformSnakeCaseCardFieldsToCamelCase(testCardsWithId[0])
    updatedCard.price = 24.5

    const receivedData = await api
      .put('/api/cards/1')
      .send(updatedCard)
      .expect(200)

    const { body } = receivedData
    const propertyNames = Object.keys(body)

    expect(propertyNames).toHaveLength(8)
  })

  test('expected card is returned', async () => {
    const originalCard = transformSnakeCaseCardFieldsToCamelCase(testCardsWithId[0])
    const updatedCard = { ...originalCard, price: 24.5 }

    const response = await api
      .put('/api/cards/1')
      .send(updatedCard)
      .expect(200)

    const receivedData = response.body

    expect(receivedData).toHaveProperty('id', originalCard.id)
    expect(receivedData).toHaveProperty('cardSetId', originalCard.cardSetId)
    expect(receivedData).toHaveProperty('name', originalCard.name)
    expect(receivedData).toHaveProperty('cardNumber', originalCard.cardNumber)
    expect(receivedData).toHaveProperty('manaCost', originalCard.manaCost)
    expect(receivedData).toHaveProperty('price')
    expect(receivedData.price).not.toBe(0.09)
    expect(receivedData.price).toBe(24.5)
    expect(receivedData).toHaveProperty('rulesText', originalCard.rulesText)
    expect(receivedData).toHaveProperty('rarity', originalCard.rarity)
  })

  test('card in the database is updated', async () => {
    const cardInCamelCase = transformSnakeCaseCardFieldsToCamelCase(testCardsWithId[0])
    const updatedCard = { ...cardInCamelCase, price: 24.5 }

    const response = await api
      .put('/api/cards/1')
      .send(updatedCard)

    const receivedData = response.body

    const dataFromDatabase = await sequelize
      .query(`SELECT * FROM "cards" WHERE id = ${receivedData.id}`)

    const cardInDatabase = dataFromDatabase[0][0]

    expect(cardInDatabase).toHaveProperty('id', updatedCard.id)
    expect(cardInDatabase).toHaveProperty('card_set_id', updatedCard.cardSetId)
    expect(cardInDatabase).toHaveProperty('name', updatedCard.name)
    expect(cardInDatabase).toHaveProperty('card_number', updatedCard.cardNumber)
    expect(cardInDatabase).toHaveProperty('mana_cost', updatedCard.manaCost)
    expect(cardInDatabase).toHaveProperty('price', updatedCard.price)
    expect(cardInDatabase).toHaveProperty('rules_text', updatedCard.rulesText)
    expect(cardInDatabase).toHaveProperty('rarity', updatedCard.rarity)
  })

  test('returns 400 when invalid id', async () => {
    const cardInCamelCase = transformSnakeCaseCardFieldsToCamelCase(testCardsWithId[0])
    const updatedCard = { ...cardInCamelCase, price: 24.5 }

    await api
      .put('/api/cards/3_not_valid_id')
      .send(updatedCard)
      .expect(400)
  })

  test('returns expected error message when invalid id', async () => {
    const cardInCamelCase = transformSnakeCaseCardFieldsToCamelCase(testCardsWithId[0])
    const updatedCard = { ...cardInCamelCase, price: 24.5 }

    const response = await api
      .put('/api/cards/3_not_valid_id')
      .send(updatedCard)

    const receivedData = response.body

    expect(receivedData.error).toMatch(/Invalid id type/)
    expect(receivedData.expectedType).toBe('INTEGER')
  })

  test('returns 404 when id does not exist', async () => {
    const cardInCamelCase = transformSnakeCaseCardFieldsToCamelCase(testCardsWithId[0])
    const updatedCard = { ...cardInCamelCase, price: 24.5 }

    await api
      .put('/api/cards/12345')
      .send(updatedCard)
      .expect(404)
  })

  test('returns 400 when updated card is invalid', async () => {
    const cardInCamelCase = transformSnakeCaseCardFieldsToCamelCase(testCardsWithId[0])
    cardInCamelCase.name = [1, 2, 3]

    await api
      .put('/api/cards/4')
      .send(cardInCamelCase)
      .expect(400)
  })
})

describe('When user deletes a card from the server', () => {
  beforeEach(async() => {
    await queryInterface.bulkDelete('card_sets')
    await queryInterface.bulkDelete('cards')
    await sequelize.query('ALTER SEQUENCE "cards_id_seq" RESTART WITH 11')
    await queryInterface.bulkInsert('card_sets', firstTestCardSetWithId)
    await queryInterface.bulkInsert('cards', firstTenCardsWithId)
  })

  test('when successful responds with 204', async () => {
    await api
      .delete('/api/cards/3')
      .expect(204)
  })

  test('when invalid id responds with 400', async () => {
    await api
      .delete('/api/cards/3_not_valid')
      .expect(400)
  })

  test('when non existing id responds with 404', async () => {
    await api
      .delete('/api/cards/12345')
      .expect(404)
  })

  test('the card is deleted', async () => {
    const databaseBeforeDelete = await sequelize.query('SELECT * FROM "cards"')
    const cardsBeforeDelete = databaseBeforeDelete[0]

    await api
      .delete('/api/cards/1')

    const databaseAfterDelete = await sequelize.query('SELECT * FROM "cards"')
    const cardsAfterDelete = databaseAfterDelete[0]

    const cardIdsAfterDelete = cardsAfterDelete.map(card => card.id)

    expect(cardsAfterDelete).not.toHaveLength(cardsBeforeDelete.length)
    expect(cardIdsAfterDelete).not.toContain(1)
  })

  test('nothing changes in the database when non-existing id', async () => {
    const databaseBeforeDelete = await sequelize.query('SELECT * FROM "cards"')
    const cardsBeforeDelete = databaseBeforeDelete[0]

    await api
      .delete('/api/cards/123')

    const databaseAfterDelete = await sequelize.query('SELECT * FROM "cards"')
    const cardsAfterDelete = databaseAfterDelete[0]

    expect(cardsAfterDelete).toHaveLength(cardsBeforeDelete.length)

    for (const card of cardsAfterDelete) {
      expect(cardsBeforeDelete).toContainEqual(card)
    }
  })
})

describe('When user adds an individual card', () => {
  beforeEach(async() => {
    await queryInterface.bulkDelete('card_sets')
    await queryInterface.bulkDelete('cards')
    await sequelize.query('ALTER SEQUENCE "cards_id_seq" RESTART WITH 11')
    await queryInterface.bulkInsert('card_sets', firstTestCardSetWithId)
    await queryInterface.bulkInsert('cards', firstTenCardsWithId)
  })

  describe('when successful', () => {
    test('responds with 201', async () => {
      await api
        .post('/api/cards')
        .send(testCardWithCardSetId)
        .expect(201)
    })

    test('responds with json', async () => {
      await api
        .post('/api/cards')
        .send(testCardWithCardSetId)
        .expect('Content-Type', /application\/json/)
    })

    test('returns expected object', async () => {
      const receivedData = await api
        .post('/api/cards')
        .send(testCardWithCardSetId)

      const addedCard = receivedData.body

      expect(addedCard).toHaveProperty('id', 11)
      expect(addedCard).toHaveProperty('cardSetId', testCardWithCardSetId.cardSetId)
      expect(addedCard).toHaveProperty('name', testCardWithCardSetId.name)
      expect(addedCard).toHaveProperty('cardNumber', testCardWithCardSetId.cardNumber)
      expect(addedCard).toHaveProperty('manaCost', testCardWithCardSetId.manaCost)
      expect(addedCard).toHaveProperty('price', testCardWithCardSetId.price)
      expect(addedCard).toHaveProperty('rulesText', testCardWithCardSetId.rulesText)
      expect(addedCard).toHaveProperty('rarity', testCardWithCardSetId.rarity)
    })
  })

  describe('when unsuccessful', () => {
    test('returns 400 when sent card object is invalid', async() => {
      const modifiedCard = { ...testCardWithCardSetId }

      modifiedCard.rulesText = ['not', 'a', 'valid', 'value']

      await api
        .post('/api/cards')
        .send(modifiedCard)
        .expect(400)
    })

    test('returns expected error message when card is invalid', async() => {
      const modifiedCard = { ...testCardWithCardSetId }

      modifiedCard.rulesText = ['not', 'a', 'valid', 'value']

      const receivedData = await api
        .post('/api/cards')
        .send(modifiedCard)

      const errorResponse = receivedData.body

      expect(errorResponse).toHaveProperty('error', 'Invalid or missing data')
      expect(errorResponse.invalidProperties).toHaveProperty('rulesText', 'INVALID')
    })
  })
})