const { DataTypes } = require('sequelize')
const supertest = require('supertest')
const app = require('../app')
const { sequelize } = require('../utils/db')
const api = supertest(app)
const queryInterface = sequelize.getQueryInterface()

test('1 + 1 = 2', async () => {
  const result = 1 + 1
  expect(result).toBe(2)
})

test('stuff works', async () => {
  await queryInterface.createTable('test_table', {
    user_id: DataTypes.INTEGER,
    username: DataTypes.STRING
  })

  await queryInterface.bulkInsert('test_table', [{
    user_id: 1,
    username: 'eka'
  }, {
    user_id: 2,
    username: 'toka'
  }])

  const response = await api.get('/')

  expect(response.body.length).toBe(2)
  expect(response.body[1]).toEqual({ user_id: 2, username: 'toka' })

})

afterEach(async () => {
  await queryInterface.dropTable('test_table')
})

afterAll(() => {
  sequelize.close()
})