const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = { errorHandler }