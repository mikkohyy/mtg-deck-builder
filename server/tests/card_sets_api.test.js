const { testCardSets } = require('./test_helpers')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const { sequelize } = require('../utils/db')
const queryInterface = sequelize.getQueryInterface()

afterAll(async () => {
  sequelize.close()
})

describe('when user asks for the card sets from the server', () => {
  beforeEach(async () => {
    await queryInterface.bulkDelete('card_sets')
    await queryInterface.bulkInsert('card_sets', testCardSets)
  })

  test('a json is returned', async () => {
    await api
      .get('/api/card_sets')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all existing sets are returned', async () => {
    const { body } = await api.get('/api/card_sets')
    expect(body.length).toBe(3)
  })

  describe('an element of the returned json', () => {
    test('has right number of properties', async () => {
      const { body } = await api.get('/api/card_sets')
      const firstCardSet = body[0]
      const keys = Object.keys(firstCardSet)
      expect(keys.length).toBe(4)
    })

    test('has the expected properties', async () => {
      const keyChecks = {
        id: false,
        name: false,
        description: false,
        date: false
      }

      const { body } = await api.get('/api/card_sets')
      const secondCardSet = body[1]

      for (const key of Object.keys(secondCardSet)) {
        if (Object.keys(keyChecks).includes(key)) {
          keyChecks[key] = true
        }
      }

      expect(keyChecks.id).toBe(true)
      expect(keyChecks.name).toBe(true)
      expect(keyChecks.description).toBe(true)
      expect(keyChecks.date).toBe(true)
    })

    test('has the expected values', async () => {
      const { body } = await api.get('/api/card_sets')
      const thirdCardSet = body[2]

      expect(thirdCardSet.id).toBe(3)
      expect(thirdCardSet.name).toBe('Dominaria')
      expect(thirdCardSet.description).toBe('A set of cards from Dominaria')
      expect(thirdCardSet.date).toBe('2019-03-13T23:44:12.002Z')
    })
  })
})