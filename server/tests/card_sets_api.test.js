const {
  testCardSetsWithId,
  testCardSets,
  invalidCardSet,
  testCardsWithId,
  testCards
} = require('./test_data')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { sequelize } = require('../utils/db')
const queryInterface = sequelize.getQueryInterface()

sequelize.options.logging = false

const getAllCardSetsQueryString = 'SELECT id, name, description, date FROM card_sets'
const cardSetWithCards = { ...testCardSets[0], cards: testCards }

const invalidCardSetWithCards = { ...invalidCardSet, cards: testCards }

beforeAll(async () => {
  await queryInterface.bulkDelete('deck_cards')
})

afterAll(async () => {
  sequelize.close()
})

describe('When user asks for the card sets from the server', () => {
  beforeEach(async () => {
    await queryInterface.bulkDelete('card_sets')
    await queryInterface.bulkInsert('card_sets', testCardSetsWithId)
  })

  test('responds with 200', async () => {
    await api
      .get('/api/card_sets')
      .expect(200)
  })

  test('returns a json', async () => {
    await api
      .get('/api/card_sets')
      .expect('Content-Type', /application\/json/)
  })

  test('all existing sets are returned', async () => {
    const { body } = await api.get('/api/card_sets')
    expect(body).toHaveLength(3)
  })

  describe('an element of the returned json', () => {
    test('has right number of properties', async () => {
      const { body } = await api.get('/api/card_sets')
      const firstCardSet = body[0]
      const keys = Object.keys(firstCardSet)
      expect(keys).toHaveLength(4)
    })

    test('has the expected properties', async () => {
      const { body } = await api.get('/api/card_sets')
      const secondCardSet = body[1]

      expect(secondCardSet).toHaveProperty('id')
      expect(secondCardSet).toHaveProperty('name')
      expect(secondCardSet).toHaveProperty('description')
      expect(secondCardSet).toHaveProperty('date')
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

describe('When user adds a new card set to the server', () => {
  beforeEach(async () => {
    await queryInterface.bulkDelete('card_sets')
    await sequelize.query('ALTER SEQUENCE "card_sets_id_seq" RESTART WITH 4')
    await sequelize.query('ALTER SEQUENCE "cards_id_seq" RESTART WITH 1')
    await queryInterface.bulkInsert('card_sets', testCardSetsWithId)
  })

  describe('server responds', () => {
    test('with json', async () => {
      await api.post('/api/card_sets')
        .send(cardSetWithCards)
        .expect('Content-Type', /application\/json/)
    })

    test('with status 201 when successful', async () => {
      await api.post('/api/card_sets')
        .send(cardSetWithCards)
        .expect(201)
    })

    test('with status 400 when name is missing', async () => {
      await api.post('/api/card_sets').send(invalidCardSetWithCards).expect(400)
    })

    test('with status 400 when cards property is missing', async () => {
      await api.post('/api/card_sets').send(testCardSets[0]).expect(400)
    })

    test('with proper error message when the name is missing', async() => {
      const { body } = await api.post('/api/card_sets').send(invalidCardSetWithCards)
      expect(body.error).toMatch(/Invalid or missing data/)
    })

    test('with proper error message when cards property is missing', async () => {
      const { body } = await api.post('/api/card_sets').send(testCardSets[0])
      expect(body.error).toMatch(/Invalid or missing data/)
    })

    test('with proper info on which field is missing', async() => {
      const { body } = await api.post('/api/card_sets').send(invalidCardSetWithCards)

      const invalidPropertyNames = Object.keys(body.invalidProperties)

      expect(invalidPropertyNames).toHaveLength(1)
      expect(body.invalidProperties).toHaveProperty('name')
      expect(body.invalidProperties).not.toHaveProperty('description')
      expect(body.invalidProperties).not.toHaveProperty('cards')
    })
  })

  describe('number of sets', () => {
    test('increases when one card set is added', async () => {
      const beforePost = await sequelize.query(getAllCardSetsQueryString)
      const testCardSetsBeforePost = beforePost[0]

      await api.post('/api/card_sets').send(cardSetWithCards)

      const afterPost = await sequelize.query(getAllCardSetsQueryString)
      const testCardSetsAfterPost = afterPost[0]

      expect(testCardSetsAfterPost).toHaveLength(testCardSetsBeforePost.length + 1)
    })

    test('increases when three new card sets are added', async () => {
      const beforePost = await sequelize.query(getAllCardSetsQueryString)
      const testCardSetsBeforePost = beforePost[0]

      await api
        .post('/api/card_sets')
        .send({ ...testCardSets[0], cards: [0,1,2].map(i => testCards[i]) })

      await api
        .post('/api/card_sets')
        .send({ ...testCardSets[1], cards: [3,4,5].map(i => testCards[i]) })

      await api
        .post('/api/card_sets')
        .send({ ...testCardSets[2], cards: [6,7,8].map(i => testCards[i]) })

      const afterPost = await sequelize.query(getAllCardSetsQueryString)
      const testCardSetsAfterPost = afterPost[0]

      expect(testCardSetsAfterPost).toHaveLength(testCardSetsBeforePost.length + 3)
    })

    test('does not change when the sent object is not valid', async () => {
      const beforePost = await sequelize.query(getAllCardSetsQueryString)
      const testCardSetsBeforePost = beforePost[0]

      await api.post('/api/card_sets').send(invalidCardSetWithCards)

      const afterPost = await sequelize.query(getAllCardSetsQueryString)
      const testCardSetsAfterPost = afterPost[0]

      expect(testCardSetsBeforePost).toHaveLength(testCardSetsAfterPost.length)
    })
  })

  describe('the returned added card set', () => {
    test('has the right number of properties', async () => {
      const { body } = await api.post('/api/card_sets').send(cardSetWithCards)
      const keys = Object.keys(body)
      expect(keys).toHaveLength(5)
    })

    test('has the expected properties', async () => {
      const { body } = await api.post('/api/card_sets').send(cardSetWithCards)

      expect(body).toHaveProperty('id')
      expect(body).toHaveProperty('name')
      expect(body).toHaveProperty('description')
      expect(body).toHaveProperty('date')
      expect(body).toHaveProperty('cards')
    })

    test('has the expected values', async () => {
      const { body } = await api.post('/api/card_sets').send(cardSetWithCards)

      expect(body.id).toBe(4)
      expect(body.name).toBe(testCardSets[0].name)
      expect(body.description).toBe(testCardSets[0].description)
    })

    it('has the right number of cards', async () => {
      const { body } = await api.post('/api/card_sets').send(cardSetWithCards)
      expect(body.cards).toHaveLength(10)
    })

    test('the first card has expected number of properties', async () => {
      const { body } = await api.post('/api/card_sets').send(cardSetWithCards)
      const addedCard = body.cards[0]
      const cardObjectKeys = Object.keys(addedCard)

      expect(cardObjectKeys).toHaveLength(8)
    })

    test('the first card has expected properties', async () => {
      const { body } = await api.post('/api/card_sets').send(cardSetWithCards)
      const addedCard = body.cards[0]

      expect(addedCard).toHaveProperty('id')
      expect(addedCard).toHaveProperty('name')
      expect(addedCard).toHaveProperty('cardNumber')
      expect(addedCard).toHaveProperty('manaCost')
      expect(addedCard).toHaveProperty('price')
      expect(addedCard).toHaveProperty('rulesText')
      expect(addedCard).toHaveProperty('rarity')
      expect(addedCard).toHaveProperty('cardSetId')
    })

    test('the first card has the expected values', async () => {
      const { body } = await api.post('/api/card_sets').send(cardSetWithCards)
      const originalCard = cardSetWithCards.cards[0]
      const addedCard = body.cards[0]

      expect(addedCard.name).toEqual(originalCard.name)
      expect(addedCard.cardNumber).toEqual(originalCard.cardNumber)
      expect(addedCard.manaCost).toEqual(originalCard.manaCost)
      expect(addedCard.price).toEqual(originalCard.price)
      expect(addedCard.rulesText).toEqual(originalCard.rulesText)
      expect(addedCard.rarity).toEqual(originalCard.rarity)
      expect(addedCard.cardSet).toEqual()
    })
  })
})

describe('When user deletes a card set from the server', () => {
  beforeEach(async () => {
    await queryInterface.bulkDelete('card_sets')
    await queryInterface.bulkInsert('card_sets', testCardSetsWithId)
  })

  test('wanted card set is deleted', async () => {
    await api.delete('/api/card_sets/2')
    const testCardSets = await sequelize.query(getAllCardSetsQueryString)

    expect(testCardSets[0]).not.toContainEqual(testCardSetsWithId[1])
  })

  describe('server responds', () => {
    test('with 204 when existing id', async () => {
      await api.delete('/api/card_sets/3')
    })

    test('with 404 when id does not exist', async () => {
      await api.delete('/api/card_sets/5')
    })

    test('with 400 when id is not a valid id', async () => {
      await api.delete('/api/card_sets/a4bb')
    })

    test('with proper error message when id is not valid', async () => {
      const { body } = await api.delete('/api/card_sets/a4bb')
      expect(body.error).toMatch(/Invalid id type/)
    })
  })

  describe('number of card sets', () => {
    test('decreases by one when one card set is deleted', async () => {
      const beforeDelete = await sequelize.query(getAllCardSetsQueryString)
      const testCardSetsBeforeDelete = beforeDelete[0]

      await api.delete('/api/card_sets/3')

      const afterDelete = await sequelize.query(getAllCardSetsQueryString)
      const testCardSetsAfterDelete = afterDelete[0]

      expect(testCardSetsAfterDelete).toHaveLength(testCardSetsBeforeDelete.length - 1)
    })

    test('decreases by three when three card sets are deleted', async () => {
      const beforeDelete = await sequelize.query(getAllCardSetsQueryString)
      const testCardSetsBeforeDelete = beforeDelete[0]

      await api.delete('/api/card_sets/3')
      await api.delete('/api/card_sets/1')
      await api.delete('/api/card_sets/2')

      const afterDelete = await sequelize.query(getAllCardSetsQueryString)
      const testCardSetsAfterDelete = afterDelete[0]

      expect(testCardSetsAfterDelete).toHaveLength(testCardSetsBeforeDelete.length - 3)
    })

    test('does not decrease if id does not exist', async () => {
      const beforeDelete = await sequelize.query(getAllCardSetsQueryString)
      const testCardSetsBeforeDelete = beforeDelete[0]

      await api.delete('/api/card_sets/5')

      const afterDelete = await sequelize.query(getAllCardSetsQueryString)
      const testCardSetsAfterDelete = afterDelete[0]

      expect(testCardSetsAfterDelete).toHaveLength(testCardSetsBeforeDelete.length)
    })
  })

})

describe('When user updates a card set', () => {
  beforeEach(async () => {
    await queryInterface.bulkDelete('card_sets')
    await queryInterface.bulkInsert('card_sets', testCardSetsWithId)
  })

  describe('server responds', () => {
    test('with json', async () => {
      const updated = { ...testCardSetsWithId[1], description: 'updated description' }

      await api
        .put('/api/card_sets/2')
        .send(updated)
        .expect('Content-Type', /application\/json/)
    })

    test('with 200 when successful', async () => {
      const updated = { ...testCardSetsWithId[1], description: 'updated description' }

      await api.put('/api/card_sets/2')
        .send(updated)
        .expect(200)
    })

    test('with 404 when id does not exist', async () => {
      const updated = { ...testCardSetsWithId[1], description: 'updated description' }

      await api.put('/api/card_sets/8')
        .send(updated)
        .expect(404)
    })

    test('with 400 when id is not a valid id', async () => {

      const updated = { ...testCardSetsWithId[1], description: 'updated description' }

      await api.put('/api/card_sets/a4bb')
        .send(updated)
        .expect(400)
    })

    test('with proper error message when id is not valid', async () => {
      const { body } = await api.delete('/api/card_sets/a4bb')
      expect(body.error).toMatch(/Invalid id type/)
    })
  })

  describe('the returned object', () => {
    test('has the right number of properties', async () => {
      const updated = {
        ...testCardSetsWithId[1],
        description: 'updated description',
        name: 'Visions'
      }

      const { body } = await api.put('/api/card_sets/2')
        .send(updated)

      const properties = Object.keys(body)

      expect(properties).toHaveLength(4)
    })

    test('as the right properties', async () => {
      const updated = {
        ...testCardSetsWithId[1],
        description: 'updated description',
        name: 'Visions'
      }

      const { body } = await api.put('/api/card_sets/2')
        .send(updated)

      expect(body).toHaveProperty('id')
      expect(body).toHaveProperty('name')
      expect(body).toHaveProperty('description')
      expect(body).toHaveProperty('date')
    })

    test('has changed when one value was updated', async () => {
      const updated = { ...testCardSetsWithId[1], description: 'updated description' }

      const { body } = await api.put('/api/card_sets/2')
        .send(updated)

      expect(body.id).toBe(testCardSetsWithId[1].id)
      expect(body.name).toBe(testCardSetsWithId[1].name)
      expect(body.description).not.toBe(testCardSetsWithId[1].description)
      expect(body.date).toBe(testCardSetsWithId[1].date.toISOString())
    })

    test('has changed when two values were updated', async () => {
      const updated = {
        ...testCardSetsWithId[1],
        description: 'updated description',
        name: 'Visions'
      }

      const { body } = await api.put('/api/card_sets/2')
        .send(updated)

      expect(body.id).toBe(testCardSetsWithId[1].id)
      expect(body.name).not.toBe(testCardSetsWithId[1].name)
      expect(body.description).not.toBe(testCardSetsWithId[1].description)
      expect(body.date).toBe(testCardSetsWithId[1].date.toISOString())
    })
  })
})

describe('When user asks for a specific card set', () => {
  beforeEach(async () => {
    await queryInterface.bulkDelete('card_sets')
    await queryInterface.bulkDelete('cards')
    await queryInterface.bulkInsert('card_sets', testCardSetsWithId)
    await queryInterface.bulkInsert('cards', testCardsWithId)
  })

  describe('the server responds', () => {
    test('with json', async () => {
      await api.get('/api/card_sets/2')
        .expect('Content-Type', /application\/json/)
    })

    test('with the status code 200 when successful', async () => {
      await api.get('/api/card_sets/2')
        .expect(200)
    })

    test('with the status code 404 if the id does not exist', async () => {
      await api.get('/api/card_sets/8')
        .expect(404)
    })

    test('with the status code 400 if id is invalid', async () => {
      await api.get('/api/card_sets/8a4')
        .expect(400)
    })

    test('with proper error message when id is not valid', async () => {
      const { body } = await api.delete('/api/card_sets/a4bb')
      expect(body.error).toMatch(/Invalid id type/)
    })

  })

  describe('the returned object', () => {
    test('has the right number of properties', async () => {
      const { body } = await api.get('/api/card_sets/3')
      const nOfKeys = Object.keys(body).length
      expect(nOfKeys).toBe(5)
    })

    test('has the property cards', async () => {
      const { body } = await api.get('/api/card_sets/3')
      expect(body).toHaveProperty('cards')
    })

    test('has the expected number of cards', async () => {
      const { body } = await api.get('/api/card_sets/3')
      expect(body.cards.length).toBe(10)
    })

    test('has cards that belong to the card set', async ()  => {
      const setId = 3

      const { body } = await api.get(`/api/card_sets/${setId}`)
      const setIdsMatch = body.cards.every((card) => card.cardSetId === setId)

      expect(setIdsMatch).toBe(true)
    })

    describe('first of the cards has', () => {
      test('expected number of properties', async () => {
        const { body } = await api.get('/api/card_sets/3')
        const properties = Object.keys(body.cards[0])

        expect(properties).toHaveLength(8)
      })

      test('expected properties', async () => {
        const { body } = await api.get('/api/card_sets/3')
        const firstCard = body.cards[0]

        expect(firstCard).toHaveProperty('id')
        expect(firstCard).toHaveProperty('cardSetId')
        expect(firstCard).toHaveProperty('name')
        expect(firstCard).toHaveProperty('cardNumber')
        expect(firstCard).toHaveProperty('manaCost')
        expect(firstCard).toHaveProperty('price')
        expect(firstCard).toHaveProperty('rulesText')
        expect(firstCard).toHaveProperty('rarity')
      })

      test('expected values', async () => {
        const expectedFirstCard = testCardsWithId[20]

        const { body } = await api.get('/api/card_sets/3')
        const receivedFirstCard = body.cards[0]

        expect(receivedFirstCard.id).toBe(expectedFirstCard.id)
        expect(receivedFirstCard.cardSetId).toBe(expectedFirstCard.card_set_id)
        expect(receivedFirstCard.name).toBe(expectedFirstCard.name)
        expect(receivedFirstCard.cardNumber).toBe(expectedFirstCard.card_number)
        expect(receivedFirstCard.manaCost).toBe(expectedFirstCard.mana_cost)
        expect(receivedFirstCard.price).toBe(expectedFirstCard.price)
        expect(receivedFirstCard.rulesText).toBe(expectedFirstCard.rules_text)
        expect(receivedFirstCard.rarity).toBe(expectedFirstCard.rarity)
      })
    })
  })
})