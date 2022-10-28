const { InvalidDataError, InvalidResourceId, RequestParameterError } = require('./errors')
const Validator = require('./validator')

const NAMES_OF_NEW_CARD_SET_PROPERTIES = ['cards', 'name', 'description']
const NAMES_OF_UPDATED_CARD_SET_PROPERTIES = ['id', 'date', 'cards', 'name', 'description']

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
    response.status(500).json({ error: error.errorInfo })
  }

  next(error)
}

const validateNewCardSetObject = (request, response, next) => {
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

  invalidProperties = checkIfNewCardSetHasUnnecessaryProperties(invalidProperties, body)

  if (Object.keys(invalidProperties).length !== 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

const validateUpdatedCardSetObject = (request, response, next) => {  const { body } = request
  let invalidProperties = {}
  let invalidCards = {}

  if (!Validator.checkIfString(body.name)) {
    invalidProperties['name'] = getMissingOrInvalid(body.name)
  }

  if (!Validator.checkIfString(body.description)) {
    invalidProperties['description'] = getMissingOrInvalid(body.name)
  }

  if (!Validator.checkIfDate(new Date(body.date))) {
    invalidProperties['date'] = getMissingOrInvalid(body.date)
  }

  if (!Validator.checkIfModifiedCardsObjectIsValid(body.cards)) {
    invalidProperties['cards'] = getMissingOrInvalid(body.cards)
  } else {
    invalidCards = validateCardsAsPartOfUpdatedCardSet(body.cards)
    invalidProperties = addCardsIntoInvalidPropertiesIfInvalidCards(invalidCards, invalidProperties)
  }

  invalidProperties = checkIfUpdatedCardSetHasUnnecessaryProperties(invalidProperties, body)

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

  let invalidProperties = Validator.checkIfDeckIsValid(deck, 'new')

  if (deck.cards !== undefined && deck.cards.length > 0) {
    const invalidCards = checkIfInvalidCards([], deck.cards, 'partOfDeck')
    if (invalidCards.length > 0) {
      invalidProperties.cards = 'INVALID'
      invalidProperties.cardObject = [...invalidCards]
    }
  }

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
  const whatToUpdate = request.query?.update

  if (whatToUpdate === undefined) {
    const neededParameter = { update: 'information or cards' }
    throw new RequestParameterError('A request parameter is needed', neededParameter)
  } else if (whatToUpdate === 'information') {
    invalidProperties = Validator.checkIfDeckIsValid(deck, whatToUpdate)
    nOfInvalidProperties = Object.keys(invalidProperties).length
  } else if (whatToUpdate === 'cards') {
    invalidProperties = validateCardsAsPartOfUpdatedDeck(deck)
    for (const invalidInformation of Object.values(invalidProperties)) {
      nOfInvalidProperties = nOfInvalidProperties + invalidInformation.length
    }
  } else {
    const expectedParameter = { update: 'should be information or cards' }
    throw new RequestParameterError('Invalid parameter', expectedParameter)
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

const validateCardsAsPartOfUpdatedCardSet = (cards) => {
  const { added, updated, deleted } = cards

  const invalidProperties = {
    'added': checkIfInvalidCards([], added, 'addedToCardSet'),
    'updated': checkIfInvalidCards([], updated, 'existing'),
    'deleted': checkIfInvalidCards([], deleted, 'existing')
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


const checkIfNewCardSetHasUnnecessaryProperties = (invalidProperties, data) => {
  const propertyNames = Object.keys(data)

  for (const name of propertyNames) {
    !NAMES_OF_NEW_CARD_SET_PROPERTIES.includes(name) && (invalidProperties[name] = 'UNEXPECTED')
  }

  return invalidProperties
}

const checkIfUpdatedCardSetHasUnnecessaryProperties = (invalidProperties, data) => {
  const propertyNames = Object.keys(data)

  for (const name of propertyNames) {
    !NAMES_OF_UPDATED_CARD_SET_PROPERTIES.includes(name) && (invalidProperties[name] = 'UNEXPECTED')
  }

  return invalidProperties
}

const addCardsIntoInvalidPropertiesIfInvalidCards = (invalidCards, invalidProperties) => {
  for (const cards of Object.values(invalidCards)) {
    if (cards.length > 0) {
      invalidProperties['cardObjects'] = invalidCards
      invalidProperties['cards'] = 'INVALID'
      break
    }
  }

  return invalidProperties
}

const getMissingOrInvalid = (data) => {
  return !data ? 'MISSING' : 'INVALID'
}


module.exports = {
  errorHandler,
  validateNewCardSetObject,
  validateUpdatedCardSetObject,
  validateIdWhichIsInteger,
  validateExistingCardObject,
  validateCardObjectAddedToCardSet,
  validateNewUserObject,
  validateUpdatedUserObject,
  validateUpdatedDeckObject,
  validateNewDeckObject
}