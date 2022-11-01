class MockResponse {
  constructor() {
    this.statusValue = null
    this.jsonValue = null
  }

  status(statusCode) {
    this.statusValue = statusCode
    return this
  }

  json(object) {
    this.jsonValue = object
    return this
  }
}

class MockRequest {
  constructor(data) {
    this.body = data
  }
}

module.exports = {
  MockResponse,
  MockRequest
}