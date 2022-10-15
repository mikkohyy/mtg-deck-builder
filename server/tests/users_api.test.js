const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { sequelize } = require('../utils/db')
const { QueryTypes } = require('sequelize')
const queryInterface = sequelize.getQueryInterface()

const { queryTableContent } = require('./test_helpers')
const { testUsers } = require('./test_data')
const { getHashedString } = require('../utils/general')

sequelize.options.logging = false

let receivedData
let receivedObject

const addNewUserToDatabaseWithQuery = async (username, password) => {
  const hashedPassword = await getHashedString(password, 10)
  await sequelize
    .query(`INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}')`)
}

const prepareUsersTable = async () => {
  await queryInterface.bulkDelete('users')
  await sequelize.query('ALTER SEQUENCE "users_id_seq" RESTART WITH 1')
}

const queryUserWithId = async (id) => {
  const queryResponse = await sequelize
    .query(
      `SELECT * FROM "users" WHERE id = ${id}`,
      { type: QueryTypes.SELECT }
    )
  return queryResponse
}

beforeAll(async () => {
  await queryInterface.bulkDelete('deck_cards')
  await queryInterface.bulkDelete('decks')
  await queryInterface.bulkDelete('users')
})

afterAll(async () => {
  sequelize.close()
})

describe('/api/users', () => {
  describe.only('when new user is added', () => {
    describe('if successful', () => {
      beforeAll(async () => {
        await prepareUsersTable()
        const newUser = { ...testUsers[0] }

        receivedData = await api
          .post('/api/users')
          .send(newUser)

        receivedObject = receivedData.body
      })

      test('responds with 201', () => {
        expect(receivedData.statusCode).toBe(201)
      })

      test('returns object with expected number of properties', async () => {
        const propertyNames = Object.keys(receivedObject)
        expect(propertyNames).toHaveLength(2)
      })

      test('returns object with expected properties', async () => {
        const expectedObject = {
          id: 1,
          username: 'zerocool'
        }

        expect(receivedObject).toEqual(expectedObject)
      })

      test('user\'s password is saved in hashed form', async () => {
        const userInDatabase = await queryUserWithId(1)
        const createdUser = userInDatabase[0]

        expect(createdUser).not.toHaveProperty('password', 'password')
      })
    })

    describe('if unsuccessful', () => {
      describe('when sent user object is invalid', () => {
        beforeAll(async () => {
          await prepareUsersTable()

          const newUser = {
            username: 'zerocool'
          }

          receivedData = await api
            .post('/api/users')
            .send(newUser)

          receivedObject = receivedData.body
        })

        test('responds with 400', async () => {
          expect(receivedData.statusCode).toBe(400)
        })

        test('responds with expected information', async () => {
          const expectedObject = {
            error: 'Invalid or missing data',
            invalidProperties: {
              password: 'MISSING'
            }
          }

          expect(receivedObject).toEqual(expectedObject)
        })
      })
      describe('when username already exists', () => {
        test('returns expected error information', async () => {
          await prepareUsersTable()
          await addNewUserToDatabaseWithQuery(testUsers[0].username, testUsers[0].password)

          const expectedObject = {
            error: 'Validation error',
            invalidProperties: {
              username: 'EXISTS'
            }
          }

          const newUser = {
            username: testUsers[0].username,
            password: 'password'
          }

          const receivedData = await api
            .post('/api/users')
            .send(newUser)

          const receivedObject = receivedData.body

          expect(receivedObject).toEqual(expectedObject)
        })
      })
    })
  })

  describe('When existing user is deleted', () => {
    beforeEach(async () => {
      await queryInterface.bulkInsert(
        'users',
        [
          { ...testUsers[0], id: 1 },
          { ...testUsers[1], id: 2 },
          { ...testUsers[2], id: 3 }
        ])
    })
    test('responds with 204', async () => {
      await sequelize.query('SELECT * FROM "users"')
      await api
        .delete('/api/users/3')
        .expect(204)
    })

    test('the user is deleted', async () => {
      const beforeDelete = await queryTableContent('users')
      const deletedUser = beforeDelete[1]

      await api
        .delete('/api/users/2')

      const afterDelete = await queryTableContent('users')

      expect(afterDelete).toHaveLength(beforeDelete.length - 1)
      expect(afterDelete).not.toContain(deletedUser)
    })

    test('returns 400 if invalid user id', async () => {
      await api
        .delete('/api/users/not_valid_2')
        .expect(400)
    })

    test('returns expected error if invalid user id', async () => {
      const receivedData = await api
        .delete('/api/users/not_valid_2')

      const errorInfo = receivedData.body

      expect(errorInfo.error).toBe('Invalid id type')
      expect(errorInfo.expectedType).toBe('INTEGER')
    })

    test('returns 404 if id does not exist', async () => {
      await api
        .delete('/api/users/234')
        .expect(404)
    })
  })
  describe('when existing user is updated', () => {
    beforeEach(async () => {
      await addNewUserToDatabaseWithQuery(newUser.username, newUser.password)
    })

    test('returns 200 when successful', async () => {
      const updatedObject = {
        username: 'acidburn'
      }

      await api
        .put('/api/users/1')
        .send(updatedObject)
        .expect(200)
    })

    test('returns updated object when successful', async () => {
      const updatedObject = {
        username: 'acidburn'
      }

      const responseData = await api
        .put('/api/users/1')
        .send(updatedObject)

      const updatedUser = responseData.body

      expect(updatedUser).toHaveProperty('username', 'acidburn')
      expect(updatedUser).not.toHaveProperty('username', newUser.username)
      expect(updatedUser).toHaveProperty('id', 1)
      expect(updatedUser).not.toHaveProperty('password')
    })

    test('user in the database is updated', async () => {
      const updatedObject = {
        username: 'acidburn'
      }

      await api
        .put('/api/users/1')
        .send(updatedObject)

      const databaseResponse = await queryUserWithId(1)
      const userInDatabase = databaseResponse[0]

      expect(userInDatabase).toHaveProperty('username', 'acidburn')
      expect(userInDatabase).not.toHaveProperty('username', newUser.username)
    })

    test('user\'s password is changed', async () => {
      const updatedObject = {
        password: 'new_password'
      }

      const databaseBeforePasswordChange = await queryUserWithId(1)
      const userBefore = databaseBeforePasswordChange[0]

      await api
        .put('/api/users/1')
        .send(updatedObject)

      const databaseAfterPasswordChange = await queryUserWitd(1)
      const userAfter = databaseAfterPasswordChange[0]

      expect(userAfter.password).not.toBe(userBefore.password)
    })

    it('user\'s updated password is not saved in raw form', async () => {
      const updatedObject = {
        password: 'new_password'
      }

      await api
        .put('/api/users/1')
        .send(updatedObject)

      const databaseAfterPasswordChange = await queryUserWithId(1)
      const userAfter = databaseAfterPasswordChange[0]

      expect(userAfter.password).not.toBe(updatedObject.password)
    })

    test('returns 400 when invalid id', async () => {
      const updatedObject = {
        username: 'acidburn'
      }

      await api
        .put('/api/users/not_a_valid_id_2')
        .send(updatedObject)
        .expect(400)
    })

    test('returns 404 when non existing id', async () => {
      const updatedObject = {
        username: 'acidburn'
      }

      await api
        .put('/api/users/1234')
        .send(updatedObject)
        .expect(404)
    })

    test('returns 400 when sent data is invalid', async () => {
      const updatedObject = {
        username: []
      }

      await api
        .put('/api/users/1')
        .send(updatedObject)
        .expect(400)
    })

    test('returns expected error information when sent data is invalid', async () => {
      const updatedObject = {
        username: []
      }

      const receivedData = await api
        .put('/api/users/1')
        .send(updatedObject)

      const errorResponse = receivedData.body

      const propertyNames = Object.keys(errorResponse.invalidProperties)

      expect(propertyNames).toHaveLength(1)
      expect(errorResponse).toHaveProperty('error', 'Invalid or missing data')
      expect(errorResponse.invalidProperties).toHaveProperty('username', 'INVALID')
    })
  })
})