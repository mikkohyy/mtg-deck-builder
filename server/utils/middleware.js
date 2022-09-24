const { InvalidDataError, InvalidResourceId } = require('./errors')
const Validator = require('./validator')

const NAMES_OF_CARD_SET_PROPERTIES = ['cards', 'name', 'description']

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'InvalidDataError') {
    const errorInfo = {
      error: error.message,
      invalidProperties: error.invalidProperties
    }

    return response.status(400).json(errorInfo)
  } else if (error.name === 'InvalidResourceId') {
    return response.status(400).json({
      error: error.message,
      expectedType: error.expectedType
    })
  }

  next(error)
}

const validateNewSetCardsObject = (request, response, next) => {
  const { body } = request
  let invalidProperties = {}
  let invalidCards = []

  if (!Validator.checkIfArray(body.cards)) {
    invalidProperties['cards'] = getMissingOrInvalid(body.cards)
  } else {
    invalidCards = checkIfInvalidCards(invalidCards, body.cards)
    invalidCards.length !== 0 && (invalidProperties['cardObjects'] = invalidCards)
  }

  if (!Validator.checkIfString(body.name)) {
    invalidProperties['name'] = getMissingOrInvalid(body.name)
  }

  if (!Validator.checkIfString(body.description)) {
    invalidProperties['description'] = getMissingOrInvalid(body.description)
  }

  invalidProperties = checkIfUnnecessaryProperties(invalidProperties, body)

  if (Object.keys(invalidProperties).length !== 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

const validateIdWhichIsInteger = (request, response, next) => {
  if (!Validator.checkIfInteger(request.params.id)) {
    throw new InvalidResourceId('Invalid id type', 'INTEGER')
  } else {
    next()
  }
}

const validateExistingCardObject = (request, response, next) => {
  const card = request.body

  const invalidProperties = Validator.checkIfCardIsValid(card, 'existing')

  if (Object.keys(invalidProperties).length !== 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

const checkIfInvalidCards = (invalidCards, cards) => {
  for (const [i, card] of Object.entries(cards)) {
    const invalidProperties = Validator.checkIfCardIsValid(card, 'new')

    if (Object.keys(invalidProperties).length !== 0) {
      invalidCards.push({ ...invalidProperties, index: i })
    }
  }

  return invalidCards
}

const checkIfUnnecessaryProperties = (invalidProperties, data) => {
  const propertyNames = Object.keys(data)

  for (const name of propertyNames) {
    !NAMES_OF_CARD_SET_PROPERTIES.includes(name) && (invalidProperties[name] = 'UNEXPECTED')
  }

  return invalidProperties
}

const getMissingOrInvalid = (data) => {
  return !data ? 'MISSING' : 'INVALID'
}

module.exports = {
  errorHandler,
  validateNewSetCardsObject,
  validateIdWhichIsInteger,
  validateExistingCardObject
}