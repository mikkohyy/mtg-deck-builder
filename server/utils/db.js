const { POSTGRES_URI } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')
const Sequelize = require('sequelize')

console.log(POSTGRES_URI)

const sequelize = new Sequelize(POSTGRES_URI, {
  dialect: 'postgres'
})

const migrationConfig = {
  migrations: {
    glob: 'migrations/*.js'
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConfig)

  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name)
  })
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConfig)
  await migrator.down()
}

const connectToDatabase = async () => {
  try {
    await runMigrations()
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
  connectToDatabase,
  rollbackMigration
}