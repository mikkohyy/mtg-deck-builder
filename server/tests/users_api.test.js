const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const newUser = {
  username: 'zerocool',
  password: 'password'
}

describe('User endpoint', () => {
  describe('When new user is created', () => {
    test('responds with 200', () => {
      api
        .post('/')
        .send(newUser)
        .expect(200)
    })
  })
})