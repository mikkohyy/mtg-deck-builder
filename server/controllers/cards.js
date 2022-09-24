const cardsRouter = require('express').Router()
const {
  validateIdWhichIsInteger,
  validateExistingCardObject,
  validateCardObjectAddedToCardSet
} = require('../utils/middleware')
const { extractInformationOnUpdatedObject } = require('../utils/query_handling')
const { Card } = require('../models')

cardsRouter.get('/:id', validateIdWhichIsInteger, async(request, response, next) => {
  const cardId = request.params.id

  try {
    const foundCard = await Card.findOne({ where: { id: cardId } })
    foundCard ? response.json(foundCard) : response.send(404).end()
  } catch(error) {
    next(error)
  }
})

cardsRouter.post('/', validateCardObjectAddedToCardSet, async(request, response, next) => {
  try {
    const newCard = request.body
    const addedCard = await Card.create(newCard)

    response.status(201).json(addedCard)
  } catch(error) {
    next(error)
  }
})

cardsRouter.put(
  '/:id',
  validateIdWhichIsInteger,
  validateExistingCardObject,
  async (request, response, next) => {
    let updatedObject = null

    try {
      const cardId = request.params.id
      const card = request.body

      delete card.id

      const updatedInfo = await Card.update(
        card,
        {
          where: { id: cardId },
          returning: true
        }
      )

      const updatedRows = updatedInfo[0]

      if (updatedRows) {
        updatedObject = extractInformationOnUpdatedObject(updatedInfo)
      }

      updatedObject ? response.json(updatedObject) : response.send(404).end()
    } catch(error) {
      next(error)
    }
  }
)

cardsRouter.delete('/:id', validateIdWhichIsInteger, async (request, response) => {
  const card = await Card.findByPk(request.params.id)

  if (card) {
    await card.destroy()
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

module.exports = cardsRouter