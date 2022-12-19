const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const { User, Deck } = require('../models')

loginRouter.post('/', async (request, response, next) => {
  const { username, password } = request.body

  try {
    const foundUser = await User.findOne( { where: { username: username } })

    const passwordCorrect = foundUser === null
      ? false
      : await bcrypt.compare(password, foundUser.password)

    if (!(foundUser && passwordCorrect)) {
      return response.status(401).json({
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid username or password'
      })
    }

    const usersDecks = await Deck.findAll({
      where: { user_id: foundUser.id },
      attributes: ['id', 'name', 'notes']
    })

    const userForToken = {
      username: foundUser.username,
      id: foundUser.id
    }

    const token = jwt.sign(userForToken, process.env.JWT_SECRET)

    const returnedUserInfo = {
      username: foundUser.username,
      token: token,
      decks: usersDecks
    }

    response.status(200).json(returnedUserInfo)
  } catch(error) {
    next(error)
  }
})

module.exports = loginRouter