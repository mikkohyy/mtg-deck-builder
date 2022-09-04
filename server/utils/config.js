require('dotenv').config()

const getPostgresqlUri = (environment) => {
  if (environment === 'development') {
    return process.env.DEV_DB
  } else if (environment === 'test') {
    return process.env.TEST_DB
  } else if (environment === 'production') {
    return process.env.PRODUCTION_DB
  }
}

const POSTGRES_URI = getPostgresqlUri(process.env.NODE_ENV)

const PORT = process.env.PORT || 3001

module.exports = {
  POSTGRES_URI,
  PORT
}