const jwt = require('jsonwebtoken')
const { TokenError } = require('./errors')

const extractUserIdFromToken = (request, response, next) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

  if (!decodedToken.id) {
    throw new TokenError('Invalid token')
  } else {
    request.userId = decodedToken.id
    next()
  }
}

const extractToken = (request, response, next) => {
  const authorization = request.get('authorization')
  const extractedToken = getToken(authorization)

  if (extractedToken === undefined) {
    throw new TokenError('Missing token')
  } else {
    request.token = extractedToken
    next()
  }
}

const getToken = (authorization) => {
  let token = undefined

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)
  }

  return token
}

module.exports = { extractToken, extractUserIdFromToken }