const {
  testCardSetsWithId,
  testCardsWithId,
} = require('./test_data')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const { sequelize } = require('../utils/db')
const queryInterface = sequelize.getQueryInterface()

const firstTestCardSetWithId = [testCardSetsWithId[0]]
const firstTenCardsWithId = testCardsWithId.slice(0, 10)

afterAll(async () => {
  sequelize.close()
})

describe('When user asks for a card', () => {
  beforeEach(async () => {
    await queryInterface.bulkDelete('card_sets')
    await queryInterface.bulkDelete('cards')
    await sequelize.query('ALTER SEQUENCE "card_sets_id_seq" RESTART WITH 11')
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
    expect(receivedData).toHaveProperty('price', expectedCard.price)
    expect(receivedData).toHaveProperty('rulesText', expectedCard.rules_text)
    expect(receivedData).toHaveProperty('rarity', expectedCard.rarity)
  })

  test('returns 404 when invalid id', async () => {
    await api.get('/api/cards/3_not_valid_id').expect(400)
  })

  test('returns expected error message when invalid id', async () => {
    const { body } = await api.get('/api/cards/3_not_valid_id')

    expect(body.error).toMatch(/Invalid id type/)
    expect(body.expectedType).toBe('INTEGER')
  })

  test('returns 404 when id does not exist', async () => {
    await api.get('/api/cards/12345').expect(404)
  })
})