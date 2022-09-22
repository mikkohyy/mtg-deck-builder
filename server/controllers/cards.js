const cardsRouter = require('express').Router()
const { validateIdWhichIsInteger } = require('../utils/middleware')
const { Card } = require('../models')

cardsRouter.get('/:id', validateIdWhichIsInteger, async (request, response, next) => {
  const cardId = request.params.id

  try {
    const foundCard = await Card.findOne({ where: { id: cardId } })
    foundCard ? response.json(foundCard) : response.send(404).end()
  } catch(error) {
    next(error)
  }
})

module.exports = cardsRouter