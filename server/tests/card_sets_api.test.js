const { testCardSets, cardSets, invalidCardSet } = require('./test_helpers')
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

describe('when user adds a new card set to the server', () => {
  beforeEach(async () => {
    await queryInterface.bulkDelete('card_sets')
    await sequelize.query('ALTER SEQUENCE "card_sets_id_seq" RESTART WITH 4')
    await queryInterface.bulkInsert('card_sets', testCardSets)
  })

  describe('the server responds', () => {
    test('with json', async () => {
      await api.post('/api/card_sets')
        .send(cardSets[0])
        .expect('Content-Type', /application\/json/)
    })

    test('with status 201 when successful', async () => {
      await api.post('/api/card_sets')
        .send(cardSets[0])
        .expect(201)
    })

    test('with status 400 when name is missing', async () => {
      await api.post('/api/card_sets').send(invalidCardSet).expect(400)
    })

    test('with proper error message when the name is missing', async() => {
      const { body } = await api.post('/api/card_sets').send(invalidCardSet)
      expect(body.error).toMatch(/cardSet.name cannot be null/)
    })
  })

  describe('number of sets', () => {
    test('increases when one card set is added', async () => {
      const beforePost = await sequelize.query('SELECT * FROM card_sets')
      const cardSetsBeforePost = beforePost[0]

      await api.post('/api/card_sets').send(cardSets[0])

      const afterPost = await sequelize.query('SELECT * FROM card_sets')
      const cardSetsAfterPost = afterPost[0]

      expect(cardSetsAfterPost.length).toBe(cardSetsBeforePost.length + 1)
    })

    test('increases when three new card sets are added', async () => {
      const beforePost = await sequelize.query('SELECT * FROM card_sets')
      const cardSetsBeforePost = beforePost[0]

      await api.post('/api/card_sets').send(cardSets[0])
      await api.post('/api/card_sets').send(cardSets[1])
      await api.post('/api/card_sets').send(cardSets[2])

      const afterPost = await sequelize.query('SELECT * FROM card_sets')
      const cardSetsAfterPost = afterPost[0]

      expect(cardSetsAfterPost.length).toBe(cardSetsBeforePost.length + 3)
    })

    test('does not change when the sent object is not valid', async () => {
      const beforePost = await sequelize.query('SELECT * FROM card_sets')
      const cardSetsBeforePost = beforePost[0]

      await api.post('/api/card_sets').send(invalidCardSet)

      const afterPost = await sequelize.query('SELECT * FROM card_sets')
      const cardSetsAfterPost = afterPost[0]

      expect(cardSetsBeforePost.length).toBe(cardSetsAfterPost.length)
    })
  })

  describe('the returned added card set', () => {
    test('has the right number of properties', async () => {
      const { body } = await api.post('/api/card_sets').send(cardSets[0])
      const keys = Object.keys(body)
      expect(keys.length).toBe(4)
    })

    test('has the expected properties', async () => {
      const keyChecks = {
        id: false,
        name: false,
        description: false,
        date: false
      }

      const { body } = await api.post('/api/card_sets').send(cardSets[0])
      for (const key of Object.keys(body)) {
        console.log(key)
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
      const { body } = await api.post('/api/card_sets').send(cardSets[0])

      expect(body.id).toBe(4)
      expect(body.name).toBe(cardSets[0].name)
      expect(body.description).toBe(cardSets[0].description)
    })
  })
})