const { errorHandler } = require('../utils/error_middleware')
const { MockResponse } = require('./test_mocks')

describe('Error handling responds', () => {
  describe('if SequelizeValidationError', () => {
    let receivedData
    let error

    beforeAll(() => {
      const mockResponse = new MockResponse()

      error = {
        name: 'SequelizeValidationError',
        message: 'validation failed'
      }

      receivedData = errorHandler(error, null, mockResponse)
    })

    test('with 400', () => {
      expect(receivedData.statusValue).toBe(400)
    })

    test('with expected error information', () => {
      const errorInformation = receivedData.jsonValue
      expect(errorInformation).toMatchObject({ error: error.message })
    })
  })

  describe('if SequelizeDatabaseError', () => {
    let receivedData
    let error

    beforeAll(() => {
      const mockResponse = new MockResponse()

      error = {
        name: 'SequelizeValidationError',
        message: 'validation failed'
      }

      receivedData = errorHandler(error, null, mockResponse)
    })

    test('with 400', () => {
      expect(receivedData.statusValue).toBe(400)
    })

    test('with expected error message', () => {
      const errorInformation = receivedData.jsonValue
      expect(errorInformation).toMatchObject({ error: error.message })
    })
  })

  describe('if SequelizeUniqueConstraintError', () => {
    let receivedData
    let error

    beforeAll(() => {
      const mockResponse = new MockResponse()

      error = {
        name: 'SequelizeUniqueConstraintError',
        message: 'Validation error',
        fields: { field: 'duplicate' }
      }

      receivedData = errorHandler(error, null, mockResponse)
    })

    test('with 400', () => {
      expect(receivedData.statusValue).toBe(400)
    })

    test('with expected error information', () => {
      const expectedObject = {
        error: 'Validation error',
        invalidProperties: {
          field: 'EXISTS'
        }
      }

      const errorInformation = receivedData.jsonValue
      expect(errorInformation).toEqual(expectedObject)
    })
  })

  describe('if RequestParameterError', () => {
    let receivedData
    let error

    beforeAll(() => {
      const mockResponse = new MockResponse()

      error = {
        name: 'RequestParameterError',
        message: 'Request parameter error',
        missingParameters: 'Should have parameters'
      }

      receivedData = errorHandler(error, null, mockResponse)
    })

    test('with 400', () => {
      expect(receivedData.statusValue).toBe(400)

    })

    test('with expected object', () => {
      const expectedObject = {
        error: 'Request parameter error',
        missingParameters: 'Should have parameters'
      }

      const receivedObject = receivedData.jsonValue

      expect(receivedObject).toEqual(expectedObject)
    })
  })

  describe('if InvalidDataError', () => {
    let receivedData
    let error

    beforeAll(() => {
      const mockResponse = new MockResponse()

      error = {
        name: 'InvalidDataError',
        message: 'Invalid or missing data',
        invalidProperties: {
          name: 'INVALID',
          id: 'MISSING'
        }
      }

      receivedData = errorHandler(error, null, mockResponse)
    })

    test('with 400', () => {
      expect(receivedData.statusValue).toBe(400)
    })

    test('with expected object', () => {
      const expectedObject = {
        error: 'Invalid or missing data',
        invalidProperties: {
          name: 'INVALID',
          id: 'MISSING'
        }
      }

      const receivedObject = receivedData.jsonValue

      expect(receivedObject).toEqual(expectedObject)
    })
  })

  describe('if InvalidResourceId', () => {
    let receivedData
    let error

    beforeAll(() => {
      const mockResponse = new MockResponse()

      error = {
        name: 'InvalidResourceId',
        message: 'Invalid id type',
        expectedType: 'INTEGER'
      }

      receivedData = errorHandler(error, null, mockResponse)
    })

    test('with 400', () => {
      expect(receivedData.statusValue).toBe(400)
    })

    test('with expected object', () => {
      const expectedObject = {
        error: 'Invalid id type',
        expectedType: 'INTEGER'
      }

      const receivedObject = receivedData.jsonValue

      expect(receivedObject).toEqual(expectedObject)
    })
  })
})