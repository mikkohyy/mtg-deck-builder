class InvalidDataError extends Error {
  constructor(message, invalidProperties) {
    super(message)
    this.name = 'InvalidDataError'
    this.invalidProperties = invalidProperties
  }
}

class InvalidResourceId extends Error {
  constructor(message, expectedType) {
    super(message)
    this.name = 'InvalidResourceId'
    this.expectedType = expectedType
  }
}

class RequestParameterError extends Error {
  constructor(message, missingParameters) {
    super(message)
    this.name = 'RequestParameterError'
    this.missingParameters = missingParameters
  }
}

class TokenError extends Error {
  constructor(message) {
    super(message)
    this.name = 'TokenError'
  }
}

module.exports = {
  InvalidDataError,
  InvalidResourceId,
  RequestParameterError,
  TokenError
}