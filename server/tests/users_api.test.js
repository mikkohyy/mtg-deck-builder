const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const { sequelize } = require('../utils/db')
const { QueryTypes } = require('sequelize')
const queryInterface = sequelize.getQueryInterface()

const { queryTableContent, queryTableContentWithId } = require('./test_helpers')
const { testUsers, testUsersWithId } = require('./test_data')
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
  describe('when new user is added', () => {
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

  describe('when user is deleted', () => {
    let usersBeforeDelete
    let usersAfterDelete

    describe('when successful', () => {
      beforeAll(async () => {
        await prepareUsersTable()
        await queryInterface.bulkInsert('users', testUsersWithId)

        usersBeforeDelete = await queryTableContent('users')

        receivedData = await api
          .delete('/api/users/2')

        usersAfterDelete = await queryTableContent('users')

      })

      test('responds with 204', async () => {
        expect(receivedData.statusCode).toBe(204)
      })

      test('the user is deleted', async () => {
        const deletedUser = testUsersWithId[1]

        expect(usersAfterDelete).toHaveLength(usersBeforeDelete.length - 1)
        expect(usersAfterDelete).not.toContain(deletedUser)
      })
    })

    describe('if unsuccessful', () => {
      describe('when invalid id', () => {
        beforeAll(async () => {
          await prepareUsersTable()
          await queryInterface.bulkInsert('users', testUsersWithId)

          receivedData = await api
            .delete('/api/users/not_valid_2')
        })

        test('returns 400 if invalid user id', async () => {
          expect(receivedData.statusCode).toBe(400)
        })

        test('returns expected error if invalid user id', async () => {
          const expectedError = {
            error: 'Invalid id type',
            expectedType: 'INTEGER'
          }

          const errorInfo = receivedData.body

          expect(errorInfo).toEqual(expectedError)
        })
      })

      describe('when user does not exist', () => {
        beforeAll(async () => {
          await prepareUsersTable()
          await queryInterface.bulkInsert('users', testUsersWithId)

          receivedData = await api
            .delete('/api/users/15')
        })

        test('returns 404', async () => {
          expect(receivedData.statusCode).toBe(404)
        })
      })
    })
  })

  describe('when user is updated', () => {
    describe('if successful', () => {
      describe('when username is updated', () => {
        beforeAll(async () => {
          await prepareUsersTable()
          await queryInterface.bulkInsert('users', testUsersWithId)

          const updatedObject = {
            username: 'icecold'
          }

          receivedData = await api
            .put('/api/users/1')
            .send(updatedObject)
        })

        test('returns 200 when successful', () => {
          expect(receivedData.statusCode).toBe(200)
        })

        test('returns updated object when successful', () => {
          const expectedObject = {
            id: 1,
            username: 'icecold'
          }

          receivedObject = receivedData.body

          expect(receivedObject).toEqual(expectedObject)
        })

        test('user in the database is updated', async () => {
          const databaseResponse = await queryTableContentWithId('users', 1)
          const foundUser = databaseResponse[0]

          expect(foundUser.username).not.toBe('zerocool')
          expect(foundUser.username).toBe('icecold')
        })
      })

      describe('when password is updated', () => {
        let userBeforeUpdate
        let userAfterUpdate
        const newPassword = 'new_password'
        beforeAll(async () => {
          await prepareUsersTable()
          await queryInterface.bulkInsert('users', testUsersWithId)

          const updatedObject = {
            password: newPassword
          }

          const userInDatabaseBeforeChange = await queryTableContentWithId('users', 1)
          userBeforeUpdate = userInDatabaseBeforeChange[0]

          receivedData = await api
            .put('/api/users/1')
            .send(updatedObject)

          const userInDatabaseAfterChange = await queryTableContentWithId('users', 1)
          userAfterUpdate = userInDatabaseAfterChange[0]
        })
        test('user\'s password is changed', async () => {
          expect(userAfterUpdate.password).not.toBe(userBeforeUpdate.password)
        })

        test('user\'s updated password is not saved in raw form', async () => {
          expect(userAfterUpdate.password).not.toBe(newPassword)
        })
      })
    })
    describe('if unsuccessful', () => {
      describe('when invalid id', () => {
        beforeAll(async () => {
          const updatedObject = {
            username: 'icecold'
          }
          receivedData = await api
            .put('/api/users/not_a_valid_id_2')
            .send(updatedObject)
        })
        test('returns 400', async () => {
          expect(receivedData.statusCode).toBe(400)
        })
        test('returns expected error information', () => {
          const expectedError = {
            error: 'Invalid id type',
            expectedType: 'INTEGER'
          }

          const errorInfo = receivedData.body

          expect(errorInfo).toEqual(expectedError)
        })

      })

      describe('when non existing id', () => {
        test('returns 404 when non existing id', async () => {
          const updatedObject = {
            username: 'acidburn'
          }

          await api
            .put('/api/users/1234')
            .send(updatedObject)
            .expect(404)
        })
      })

      describe('when sent data is invalid', () => {
        beforeAll(async () => {
          const updatedObject = {
            username: ['icecold']
          }
          receivedData = await api
            .put('/api/users/not_a_valid_id_2')
            .send(updatedObject)
        })

        test('returns 400', async () => {
          expect(receivedData.statusCode).toBe(400)
        })

        test('returns expected error information when sent data is invalid', async () => {
          const expectedErrorObject = {
            error: 'Invalid id type',
            expectedType: 'INTEGER'
          }

          const errorObject = receivedData.body

          expect(errorObject).toEqual(expectedErrorObject)
        })
      })
    })
  })
})