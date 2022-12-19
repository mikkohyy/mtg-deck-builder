const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const { User, Deck } = require('../models')

loginRouter.post('/', async (request, response, next) => {
  const { username, password } = request.body

  try {
    const foundUser = await User.findOne( { where: { username: username } })

    console.log('user was found')

    const passwordCorrect = foundUser === null
      ? false
      : await bcrypt.compare(password, foundUser.password)

    console.log('password was decrypted')

    if (!(foundUser && passwordCorrect)) {
      return response.status(401).json({
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid username or password'
      })
    }

    console.log('password was checked')

    const usersDecks = await Deck.findAll({
      where: { user_id: foundUser.id },
      attributes: ['id', 'name', 'notes']
    })

    console.log('decks were found')

    const userForToken = {
      username: foundUser.username,
      id: foundUser.id
    }

    console.log('token object was created')

    const token = jwt.sign(userForToken, process.env.JWT_SECRET)

    console.log('token was created')

    const returnedUserInfo = {
      username: foundUser.username,
      token: token,
      decks: usersDecks
    }

    console.log('returnedUserInfo was created')

    response.status(200).json(returnedUserInfo)
  } catch(error) {
    next(error)
  }
})

module.exports = loginRouter