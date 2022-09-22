class InvalidDataError extends Error {
  constructor(message, invalidProperties, invalidCards) {
    super(message)
    this.name = 'InvalidDataError'
    this.invalidProperties = invalidProperties
    this.invalidCards = invalidCards
  }
}

module.exports = {
  InvalidDataError
}