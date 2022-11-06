const BasicValidator = require('./basic_validator')
const ObjectValidator = require('./object_validator')
const { InvalidDataError, InvalidResourceId } = require('./errors')

const validateIdWhichIsInteger = (request, response, next) => {
  if (!BasicValidator.checkIfInteger(request.params.id)) {
    throw new InvalidResourceId('Invalid id type', 'INTEGER')
  } else {
    next()
  }
}

const validateNewCardSetObject = (request, response, next) => {
  const cardSet = request.body

  const invalidProperties = ObjectValidator.checkIfCardSetObjectIsValid(cardSet, 'newCardSet')

  if (Object.keys(invalidProperties).length > 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

const validateUpdatedCardSetObject = (request, response, next) => {
  const cardSet = request.body

  const invalidProperties = ObjectValidator.checkIfCardSetObjectIsValid(cardSet, 'updatedCardSet')

  if (Object.keys(invalidProperties).length > 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

const validateNewUserObject = (request, respons, next) => {
  const user = request.body

  const invalidProperties = ObjectValidator.checkIfUserObjectIsValid(user, 'newUser')

  if (Object.keys(invalidProperties).length !== 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

const validateUpdatedUserObject = (request, respons, next) => {
  const user = request.body

  const invalidProperties = ObjectValidator.checkIfUserObjectIsValid(user, 'updatedUser')

  if (Object.keys(invalidProperties).length !== 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

const validateNewCardObject = (request, response, next) => {
  const card = request.body

  const invalidProperties = ObjectValidator.checkIfCardObjectIsValid(card, 'newCardInCardSet')

  if (Object.keys(invalidProperties).length !== 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

const validateUpdatedCardObject = (request, response, next) => {
  const card = request.body

  const invalidProperties = ObjectValidator.checkIfCardObjectIsValid(card, 'updatedCard')

  if (Object.keys(invalidProperties).length !== 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

const validateNewDeckObject = (request, response, next) => {
  const deck = request.body

  let invalidProperties = ObjectValidator.checkIfDeckObjectIsValid(deck, 'newDeck')

  if (Object.keys(invalidProperties).length > 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

const validateUpdatedDeckObject = (request, response, next) => {
  const deck = request.body

  let invalidProperties = ObjectValidator.checkIfDeckObjectIsValid(deck, 'updatedDeck')

  if (Object.keys(invalidProperties).length > 0) {
    throw new InvalidDataError('Invalid or missing data', invalidProperties)
  } else {
    next()
  }
}

module.exports = {
  validateNewCardSetObject,
  validateUpdatedCardSetObject,
  validateIdWhichIsInteger,
  validateUpdatedCardObject,
  validateNewCardObject,
  validateNewUserObject,
  validateUpdatedUserObject,
  validateUpdatedDeckObject,
  validateNewDeckObject
}