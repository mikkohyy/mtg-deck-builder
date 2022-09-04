const cors = require('cors')
const express = require('express')
const app = express()

const { QueryTypes, DataTypes } = require('sequelize')
const { sequelize, connectToDatabase } = require('./utils/db')
const queryInterface = sequelize.getQueryInterface()

connectToDatabase()

app.use(cors())
app.use(express.static('build'))

if (process.env.NODE_ENV === 'test') {
  app.post('/api/initialize-e2e', async (req, res) => {
    await queryInterface.dropTable('test_table')

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

    res.status(200).end()
  })
}

app.get('/api', async (req, res) => {
  try {
    const users = await sequelize.query('SELECT * FROM test_table', { type: QueryTypes.SELECT })
    res.json(users)
  } catch (error) {
    res.status(404).send({ error: error })
  }
})

module.exports = app