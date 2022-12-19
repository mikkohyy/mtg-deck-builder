const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    const invalidProperties = {}

    for (const duplicate of Object.keys(error.fields)) {
      invalidProperties[duplicate] = 'EXISTS'
    }

    const errorInfo = {
      error: error.message,
      invalidProperties: invalidProperties
    }

    return response.status(400).json(errorInfo)
  } else if (error.name === 'RequestParameterError') {
    const errorInfo = {
      error: error.message,
      missingParameters: error.missingParameters
    }

    return response.status(400).json(errorInfo)
  } else if (error.name === 'InvalidDataError') {
    const errorInfo = {
      error: error.message,
      invalidProperties: error.invalidProperties
    }
    return response.status(400).json(errorInfo)
  } else if (error.name === 'InvalidResourceId') {
    const errorInfo = {
      error: error.message,
      expectedType: error.expectedType
    }

    return response.status(400).json(errorInfo)
  } else {
    console.log(error)
    response.status(500).json({ error: error.errorInfo })
  }

  next(error)
}

module.exports = {
  errorHandler
}