const { POSTGRES_URI } = require('./config')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(POSTGRES_URI, {
  dialect: 'postgres'
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connected to database')
  } catch (error) {
    console.log(`Connection to database failed: ${error}`)
    return process.exit(1)
  }

  return null
}

module.exports =  {
  sequelize,
  connectToDatabase
}