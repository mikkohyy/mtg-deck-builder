const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const { testUsers } = require('./test_data')
const { getHashedString } = require('../utils/general')

const { sequelize } = require('../utils/db')
const queryInterface = sequelize.getQueryInterface()

const newUser = {
  username: 'zerocool',
  password: 'password'
}

afterAll(async () => {
  sequelize.close()
})

const addNewUserToDatabaseWithQuery = async (username, password) => {
  const hashedPassword = await getHashedString(password, 10)
  await sequelize
    .query(`INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}')`)
}

const getContentOfUsersTableWithQuery = async () => {
  const queryResponse = await sequelize
    .query('SELECT * FROM "users"')

  const usersTableState = queryResponse[0]

  return usersTableState
}

const getUserByIdQuery = async (id) => {
  const queryResponse = await sequelize
    .query(`SELECT * FROM "users" WHERE id = ${id}`)

  const userInDb = queryResponse[0]

  return userInDb
}

describe('User endpoint', () => {
  beforeEach(async () => {
    await queryInterface.bulkDelete('users')
    await sequelize.query('ALTER SEQUENCE "users_id_seq" RESTART WITH 1')
  })

  describe('When invalid data', () => {
    test('responds with 400', async () => {
      await api
        .post('/api/users')
        .send({ username: newUser.username })
        .expect(400)
    })

    test('responds with expected information', async () => {
      const invalidUserObject = {
        username: newUser.username,
        password: [1,2]
      }

      const receivedData = await api
        .post('/api/users')
        .send(invalidUserObject)

      const errorResponse = receivedData.body
      const propertyNames = Object.keys(errorResponse.invalidProperties)

      expect(propertyNames).toHaveLength(1)
      expect(errorResponse).toHaveProperty('error', 'Invalid or missing data')
      expect(errorResponse.invalidProperties).toHaveProperty('password', 'INVALID')
    }),

    test('creating new user fails is username already exists and returns expected information', async () => {
      await addNewUserToDatabaseWithQuery('zerocool', 'password')

      const receivedData = await api
        .post('/api/users')
        .send(newUser)

      const errorResponse = receivedData.body
      const propertyNames = Object.keys(errorResponse.alreadyExistingValues)

      expect(propertyNames).toHaveLength(1)
      expect(errorResponse).toHaveProperty('error', 'Validation error')
      expect(errorResponse.alreadyExistingValues).toHaveProperty('username', 'zerocool')
    })
  })

  describe('When new user is created successfully', () => {
    test('responds with 201', async () => {
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
    })

    test('returns object with expected number of properties', async () => {
      const receivedData = await api
        .post('/api/users')
        .send(newUser)

      const addedUser = receivedData.body
      const propertyNames = Object.keys(addedUser)

      expect(propertyNames).toHaveLength(2)
    })

    test('returns object with expected properties', async () => {
      const receivedData = await api
        .post('/api/users')
        .send(newUser)

      const addedUser = receivedData.body

      expect(addedUser).toHaveProperty('username', 'zerocool')
      expect(addedUser).toHaveProperty('id', 1)
      expect(addedUser).not.toHaveProperty('password')
    })

    test('user\'s password is saved in hashed form', async () => {
      await api
        .post('/api/users')
        .send(newUser)

      const userInDatabase = await getUserByIdQuery(1)
      const createdUser = userInDatabase[0]

      expect(createdUser).not.toHaveProperty('password', 'password')
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
      const beforeDelete = await getContentOfUsersTableWithQuery()
      const deletedUser = beforeDelete[1]

      await api
        .delete('/api/users/2')

      const afterDelete = await getContentOfUsersTableWithQuery()

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

      const databaseResponse = await getUserByIdQuery(1)
      const userInDatabase = databaseResponse[0]

      expect(userInDatabase).toHaveProperty('username', 'acidburn')
      expect(userInDatabase).not.toHaveProperty('username', newUser.username)
    })

    test('user\'s password is changed', async () => {
      const updatedObject = {
        password: 'new_password'
      }

      const databaseBeforePasswordChange = await getUserByIdQuery(1)
      const userBefore = databaseBeforePasswordChange[0]

      await api
        .put('/api/users/1')
        .send(updatedObject)

      const databaseAfterPasswordChange = await getUserByIdQuery(1)
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

      const databaseAfterPasswordChange = await getUserByIdQuery(1)
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