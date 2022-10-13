const decksRouter = require('express').Router()
const { sequelize } = require('../utils/db')
const { QueryTypes } = require('sequelize')
const { Deck, Card, DeckCard } = require('../models')
const {
  validateIdWhichIsInteger,
  validateUpdatedDeckObject,
  validateNewDeckObject
} = require('../utils/middleware')
const { extractInformationOnUpdatedObject } = require('../utils/query_handling')

decksRouter.post('/', validateNewDeckObject, async (request, response, next) => {
  const newDeck = request.body

  try {
    const createdDeck = await Deck.create(newDeck)
    createdDeck.setDataValue('cards', [])

    return response.status(201).json(createdDeck)
  } catch(error) {
    next(error)
  }
})

decksRouter.get('/:id', validateIdWhichIsInteger, async (request, response, next) => {
  const deckId = request.params.id

  try {
    const foundDeck = await Deck.findByPk(deckId, {
      include: [
        {
          model: Card,
          attributes: { exclude: ['cardSetId'] },
          through: {
            attributes: ['nInDeck', 'sideboard']
          }
        },
      ]
    })

    if (foundDeck) {
      const deckInPlainForm = foundDeck.get({ plain: true })
      const deck = {
        ...deckInPlainForm,
        cards: moveCardPropertiesToCard(deckInPlainForm.cards)
      }

      response.json(deck)
    } else {
      response.status(404).end()
    }

  } catch(error) {
    next(error)
  }
})

decksRouter.delete('/:id', validateIdWhichIsInteger, async (request, response, next) => {
  const deckId = request.params.id

  try {
    const rowsDestroyed = await Deck.destroy({
      where: {
        id: deckId
      }
    })

    rowsDestroyed !== 0 ? response.status(204).end() : response.status(404).end()
  } catch(error) {
    next(error)
  }
})

decksRouter.put(
  '/:id',
  validateIdWhichIsInteger,
  validateUpdatedDeckObject,
  async (request, response, next) => {
    const deckId = request.params.id
    const whatToUpdate = request.query.update
    const updateData = request.body

    const deckInDb = await Deck.findAll({ where: { id: deckId } })

    if (deckInDb.length === 0) {
      return response.status(404).end()
    }

    if (whatToUpdate === 'information') {
      let updatedDeckInfo
      try {
        const updateInfo = await Deck.update(
          updateData,
          {
            where: { id: deckId },
            returning: true
          }
        )

        const nOfUpdatedRows = updateInfo[0]

        if (nOfUpdatedRows) {
          updatedDeckInfo = extractInformationOnUpdatedObject(updateInfo)
        }

        nOfUpdatedRows !== 0 ? response.json(updatedDeckInfo) : response.status(404).end()
      } catch(error) {
        next(error)
      }

    } else if (whatToUpdate === 'cards') {
      const { added, updated, deleted } = updateData

      const changesInCards = {
        added: [],
        updated: [],
        deleted: []
      }

      if (updated.length > 0) {
        const dataWithAddedDeckId = updated.map(card => (
          {
            cardId: card.id,
            nInDeck: card.nInDeck,
            sideboard: card.sideboard,
            deckId: deckId
          })
        )

        try {
          const updateInfo = await DeckCard.bulkCreate(dataWithAddedDeckId, {
            updateOnDuplicate: ['nInDeck', 'sideboard'],
          })
          const updatedCardsIds = updateInfo.map(info => info.dataValues.cardId)

          const updatedCards = await sequelize
            .query(
              `SELECT 
                  deck_cards.n_in_deck AS "nInDeck",
                  deck_cards.sideboard,
                  cards.id,
                  cards.name,
                  cards.card_number AS "cardNumber",
                  cards.mana_cost AS "manaCost",
                  cards.price,
                  cards.rules_text AS "rulesText",
                  cards.rarity
                FROM deck_cards
                JOIN cards
                ON deck_cards.card_id = cards.id
                WHERE deck_id = :deckId
                AND card_id IN(:updatedCardsIds)`,
              {
                replacements: {
                  deckId: deckId,
                  updatedCardsIds: updatedCardsIds
                },
                type: QueryTypes.SELECT
              }
            )

          changesInCards.updated = [...updatedCards]
        } catch(error) {
          next(error)
        }
      }

      if (added.length > 0) {
        const dataWithAddedDeckId = added.map(card => (
          {
            cardId: card.id,
            nInDeck: card.nInDeck,
            sideboard: card.sideboard,
            deckId: deckId
          })
        )

        try {
          const updateInfo = await DeckCard.bulkCreate(dataWithAddedDeckId)

          const updatedCardsIds = updateInfo.map(info => info.dataValues.cardId)

          const updatedCards = await sequelize
            .query(
              `SELECT 
                  deck_cards.n_in_deck AS "nInDeck",
                  deck_cards.sideboard,
                  cards.id,
                  cards.name,
                  cards.card_number AS "cardNumber",
                  cards.mana_cost AS "manaCost",
                  cards.price,
                  cards.rules_text AS "rulesText",
                  cards.rarity
                FROM deck_cards
                JOIN cards
                ON deck_cards.card_id = cards.id
                WHERE deck_id = :deckId
                AND card_id IN(:updatedCardsIds)`,
              {
                replacements: {
                  deckId: deckId,
                  updatedCardsIds: updatedCardsIds
                },
                type: QueryTypes.SELECT
              }
            )

          changesInCards.updated = [...updatedCards]
        } catch(error) {
          next(error)
        }
      }

      if (deleted.length > 0) {
        const dataWithDeleteCardIds = deleted.map(card => (card.id))

        try {
          const deletedRows = await DeckCard.destroy(({
            where: {
              cardId:dataWithDeleteCardIds,
              deckId: deckId
            }
          }))

          changesInCards.deleted = deletedRows
        } catch(error) {
          error(next)
        }
      }

      response.json(changesInCards)
    }
  })

const moveCardPropertiesToCard = (cards) => {
  const formattedCards = cards.map(card => moveNestedNInDeckOneDown(card))
  return formattedCards
}

const moveNestedNInDeckOneDown = (card) => {
  const nInDeck = card.deckCard.nInDeck
  const sideboard = card.deckCard.sideboard
  delete card.deckCard

  const cardWithNInDeck = {
    ...card,
    nInDeck,
    sideboard,
  }

  return cardWithNInDeck
}

module.exports = decksRouter