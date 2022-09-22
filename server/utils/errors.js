class InvalidDataError extends Error {
  constructor(message, invalidProperties, invalidCards) {
    super(message)
    this.name = 'InvalidDataError'
    this.invalidProperties = invalidProperties
    this.invalidCards = invalidCards
  }
}

class InvalidResourceId extends Error {
  constructor(message, expectedType) {
    super(message)
    this.name = 'InvalidResourceId'
    this.expectedType = expectedType
  }
}

module.exports = {
  InvalidDataError,
  InvalidResourceId
}