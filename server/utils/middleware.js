const { InvalidDataError, InvalidResourceId } = require('./errors')
const Validator = require('./validator')

const NAMES_OF_CARD_SET_PROPERTIES = ['cards', 'name', 'description']

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

    console.log(errorInfo)

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
    response.status(500).json({ error: error.errorInfo })
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
    invalidCards = checkIfInvalidCards(invalidCards, body.cards, 'new')
    invalidCards.length !== 0 && (invalidProperties['cardObjects'] = invalidCards)
  }

  if (!Validator.checkIfString(body.name)) {
    invalidProperties['name'] = getMissingOrInvalid(body.name)
  }

  if (!Validator.checkIfString(body.description)) {
    invalidProperties['description'] = getMissingOrInvalid(body.description)
  }

  invalidProperties = checkIfCardHasUnnecessaryProperties(invalidProperties, body)

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

const validateCardObjectAddedToCardSet = (request, response, next) => {
  const card = request.body

  const invalidProperties = Validator.checkIfCardIsValid(card, 'addedToCardSet')

  if (Object.keys(invalidProperties).length !== 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

const validateNewUserObject = (request, respons, next) => {
  const user = request.body

  const invalidProperties = Validator.checkIfUserIsValid(user, 'new')

  if (Object.keys(invalidProperties).length !== 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

const validateUpdatedUserObject = (request, respons, next) => {
  const user = request.body

  const invalidProperties = Validator.checkIfUserIsValid(user, 'updated')

  if (Object.keys(invalidProperties).length !== 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

const validateNewDeckObject = (request, response, next) => {
  const deck = request.body

  const invalidProperties = Validator.checkIfDeckIsValid(deck, 'new')

  if (Object.keys(invalidProperties).length !== 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

const validateUpdatedDeckObject = (request, response, next) => {
  let invalidProperties
  let nOfInvalidProperties = 0
  const deck = request.body
  const whatToUpdate = request.query.update

  if (whatToUpdate === 'information') {
    invalidProperties = Validator.checkIfDeckIsValid(deck, 'update')
    nOfInvalidProperties = Object.keys(invalidProperties).length
  } else if (whatToUpdate === 'cards') {
    invalidProperties = validateCardsAsPartOfUpdatedDeck(deck)
    for (const invalidInformation of Object.values(invalidProperties)) {
      nOfInvalidProperties = nOfInvalidProperties + invalidInformation.length
    }
  }

  if (nOfInvalidProperties !== 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

const validateCardsAsPartOfUpdatedDeck = (cards) => {
  const { added, updated, deleted } = cards

  const invalidProperties = {
    'added': checkIfInvalidCards([], added, 'partOfDeck'),
    'updated': checkIfInvalidCards([], updated, 'partOfDeck'),
    'deleted': checkIfInvalidCards([], deleted, 'partOfDeck')
  }

  return invalidProperties
}

const checkIfInvalidCards = (invalidCards, cards, cardStatus) => {

  for (const [i, card] of Object.entries(cards)) {
    const invalidProperties = Validator.checkIfCardIsValid(card, cardStatus)

    if (Object.keys(invalidProperties).length !== 0) {
      invalidCards.push({ ...invalidProperties, index: i })
    }
  }

  return invalidCards
}

const checkIfCardHasUnnecessaryProperties = (invalidProperties, data) => {
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
  validateExistingCardObject,
  validateCardObjectAddedToCardSet,
  validateNewUserObject,
  validateUpdatedUserObject,
  validateUpdatedDeckObject,
  validateNewDeckObject
}