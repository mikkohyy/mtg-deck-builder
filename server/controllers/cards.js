const cardsRouter = require('express').Router()
const {
  validateIdWhichIsInteger,
  validateUpdatedCardObject,
  validateNewCardObject
} = require('../utils/validation_middleware')
const { extractInformationOnUpdatedObject } = require('../utils/query_handling')
const { Card } = require('../models')

/**
 * Object that represents a card that is not in the database
 * @typedef {Object} NewCard Information about card
 * @property {number} cardSetId Id of set of cards it belongs to
 * @property {string} name Name of the card
 * @property {number} cardNumber Number of the card
 * @property {string} manaCost Mana cost of the card
 * @property {float} price Price of the card
 * @property {string} rulesText Rules text of the card
 * @property {string} rarity Rarity of the card
 */

/**
 * Object that represents a card that exists in the database
 * @typedef {Object} Card Information about card
 * @property {number} id Id of the card
 * @property {number} cardSetId Id of set of cards it belongs to
 * @property {string} name Name of the card
 * @property {number} cardNumber Number of the card
 * @property {string} manaCost Mana cost of the card
 * @property {float} price Price of the card
 * @property {string} rulesText Rules text of the card
 * @property {string} rarity Rarity of the card
 */

/**
 * Endpoint for getting a card which id is defined as paremeter
 * @returns {Card} Card defined by the id
 */
cardsRouter.get('/:id', validateIdWhichIsInteger, async(request, response, next) => {
  const cardId = request.params.id

  try {
    const foundCard = await Card.findOne({ where: { id: cardId } })
    foundCard ? response.json(foundCard) : response.status(404).end()
  } catch(error) {
    next(error)
  }
})

/**
 * Endpoint for adding a new card
 * @property {NewCard} Card Card that user wants to add in the body of the request
 * @returns {Card} The created card in the body of the response
 */

cardsRouter.post('/', validateNewCardObject, async(request, response, next) => {
  try {
    const newCard = request.body
    const addedCard = await Card.create(newCard)

    response.status(201).json(addedCard)
  } catch(error) {
    next(error)
  }
})

/**
 * Endpoint for updating a card
 * @property {Card} Card Card that user wants to update in the body of the request
 * @returns {Card} Updated card in the body of the response
 */
cardsRouter.put(
  '/:id',
  validateIdWhichIsInteger,
  validateUpdatedCardObject,
  async (request, response, next) => {
    try {
      const cardId = request.params.id
      const card = request.body

      delete card.id

      const updateInfo = await Card.update(
        card,
        {
          where: { id: cardId },
          returning: true
        }
      )

      const updatedObject = extractUpdatedObject(updateInfo)

      updatedObject ? response.json(updatedObject) : response.status(404).end()
    } catch(error) {
      next(error)
    }
  }
)

/**
 * Endpoint for deleting a card that is defined in the parameters
 */
cardsRouter.delete('/:id', validateIdWhichIsInteger, async (request, response) => {
  const card = await Card.findByPk(request.params.id)

  if (card) {
    await card.destroy()
    response.status(204).end()
  } else {
    response.status(404).end()
  }
})

/**
 * @param {object} updateInfo Response for update request
 * @returns {object|null} If update was succesful returns updated object, otherwise null
 */
const extractUpdatedObject = (updateInfo) => {
  let updatedObject = null

  if (cardWasUpdated(updateInfo)) {
    updatedObject = extractInformationOnUpdatedObject(updateInfo)
  }

  return updatedObject
}

/**
 * @param {object} updateInfo Response for update request
 * @returns {boolean} Returns true if a card was updated
 */

const cardWasUpdated = (updateInfo) => {
  let wasUpdated = false
  const updatedRows = getChangedRowsN(updateInfo)

  if (updatedRows) {
    wasUpdated = true
  }

  return wasUpdated
}

/**
 * @param {object} updateInfo Response for update request
 * @returns {number} Number of updated rows
 */

const getChangedRowsN = (updateInfo) => {
  return updateInfo[0]
}

module.exports = cardsRouter