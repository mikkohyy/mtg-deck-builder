const { testUsers, testUsersWithId, testDecksWithId } = require('./test_data')
const { sequelize } = require('../utils/db')
const { getHashedString } = require('../utils/general')
const queryInterface = sequelize.getQueryInterface()

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

let response

const hashPasswords = async(userData) => {
  const users = []

  for (const user of userData) {
    const hashedPassword = await getHashedString(user.password, 5)

    const userWithHashedPassword = {
      id: user.id,
      username: user.username,
      password: hashedPassword
    }

    users.push(userWithHashedPassword)
  }

  return users
}


beforeAll(async () => {
  const usersWithHashedPassword = await hashPasswords(testUsersWithId)

  await queryInterface.bulkDelete('decks')
  await queryInterface.bulkDelete('users')
  await sequelize.query('ALTER SEQUENCE "users_id_seq" RESTART WITH 4')
  await sequelize.query('ALTER SEQUENCE "decks_id_seq" RESTART WITH 4')
  await queryInterface.bulkInsert('users', usersWithHashedPassword)
  await queryInterface.bulkInsert('decks', testDecksWithId)
})

afterAll(async () => {
  sequelize.close()
})

describe('Login route', () => {
  describe('when user logs in', () => {
    describe('with valid credentials', () => {
      const usernameAndPassword = { ...testUsers[0] }

      beforeAll(async () => {
        response = await api
          .post('/api/login')
          .send(usernameAndPassword)
      })

      test('responds with 200', () => {
        expect(response.statusCode).toBe(200)
      })

      test('returned object has right number of properties', () => {
        const returnedBody = response.body
        const propertyNames = Object.keys(returnedBody)

        expect(propertyNames).toHaveLength(3)
      })

      test('returned object has expected properties', () => {
        const expectedPropertyNames = ['token', 'username', 'decks']

        const returnedBody = response.body
        const returnedProperyNames = Object.keys(returnedBody)

        for (const propertyName of expectedPropertyNames) {
          expect(returnedProperyNames).toContain(propertyName)
        }
      })

      test('returned object has expected values', () => {
        const expectedObject = {
          username: 'zerocool',
          token: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
          decks: [
            {
              id: 1,
              name: 'Blue/Green ramp',
              notes: 'A very basic Blue/Green ramp deck',
            },
            {
              id: 2,
              name: 'White weenie deck',
              notes: 'A very basic white weenie aggro deck'
            }
          ]
        }

        const returnedObject = response.body
        expect(returnedObject).toEqual(expectedObject)
      })

      test('returns expected object when user does not have saved decks', async () => {
        const usernameAndPassword = {
          username: 'acidburn',
          password: 'nrubdica'
        }

        response = await api
          .post('/api/login')
          .send(usernameAndPassword)

        const responseObject = response.body

        expect(responseObject).toHaveProperty('decks', [])
      })
    })

    describe('with invalid credentials', () => {
      const expectedResponse = {
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid username or password'
      }

      test('responds with 401', async () => {
        const invalidUserCredentials = { ...testUsers[0] }
        invalidUserCredentials.username = 'theplague'

        const response = await api
          .post('/api/login')
          .send(invalidUserCredentials)

        expect(response.statusCode).toEqual(401)
      })

      test('responds with error when invalid username', async () => {
        const invalidUserCredentials = { ...testUsers[0] }
        invalidUserCredentials.username = 'theplague'

        const response = await api
          .post('/api/login')
          .send(invalidUserCredentials)

        const responseObject = response.body

        expect(responseObject).toEqual(expectedResponse)
      })

      test('responds with error when invalid password', async () => {
        const invalidUserCredentials = { ...testUsers[0] }
        invalidUserCredentials.password = 'eugalpeht'

        const response = await api
          .post('/api/login')
          .send(invalidUserCredentials)

        const responseObject = response.body

        expect(responseObject).toEqual(expectedResponse)
      })

      test('responds with error when invalid username and password', async () => {
        const invalidUserCredentials = {
          username: 'theplague',
          password: 'eugalpeht'
        }

        response = await api
          .post('/api/login')
          .send(invalidUserCredentials)

        const responseObject = response.body

        expect(responseObject).toEqual(expectedResponse)
      })
    })
  })
})