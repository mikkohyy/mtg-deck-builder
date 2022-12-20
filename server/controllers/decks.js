const decksRouter = require('express').Router()
const { sequelize } = require('../utils/db')
const { QueryTypes } = require('sequelize')
const { Deck, Card, DeckCard } = require('../models')
const {
  validateIdWhichIsInteger,
  validateUpdatedDeckObject,
  validateNewDeckObject
} = require('../utils/validation_middleware')
const { extractToken, extractUserIdFromToken } = require('../utils/token')

const {
  extractInformationOnUpdatedObject,
  extractFoundDataFromQuery
} = require('../utils/query_handling')

decksRouter.post('/',
  extractToken,
  extractUserIdFromToken,
  validateNewDeckObject,
  async (request, response, next) => {
    const newDeck = request.body
    const userId = request.userId

    try {
      const { name, notes, cards } = newDeck
      let addedCards = {
        added: [],
        deleted: [],
        updated: []
      }

      const newDeckObject = {
        userId: userId,
        name: name,
        notes: notes
      }

      const createdDeck = await Deck.create(newDeckObject)

      if (areThereCardsInModifiedCardsObject(cards) === true) {
        const deckId = createdDeck.id
        addedCards = await modifyCardsInDeck(deckId, cards)
      }

      createdDeck.setDataValue('cards', addedCards)

      return response.status(201).json(createdDeck)
    } catch(error) {
      next(error)
    }
  })

decksRouter.get('/:id', validateIdWhichIsInteger, async (request, response, next) => {
  const deckId = request.params.id

  try {
    const queryResults = await Deck.findByPk(deckId, {
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

    if (wasDeckFound(queryResults) === true) {
      const deckData = extractFoundDataFromQuery(queryResults)

      const foundDeck = {
        ...deckData,
        cards: moveCardDeckPropertiesToCardProperties(deckData.cards)
      }

      response.json(foundDeck)
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
    const queryResults = await Deck.destroy({
      where: {
        id: deckId
      }
    })

    if (wasDeckDeleted(queryResults) === true) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }

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
    const updatedContent = request.body
    const { cards, ...deckInformation } = updatedContent

    const queryResult = await Deck.findByPk(deckId)

    if (wasDeckFound(queryResult) === false) {
      return response.status(404).end()
    }

    try {
      const updatedDeckInformation = await updateDeckInformation(deckId, deckInformation)
      const changesInCards = await modifyCardsInDeck(deckId, cards)

      const updateResults = {
        ...updatedDeckInformation,
        cards: changesInCards
      }
      response.json(updateResults)
    } catch(error) {
      next(error)
    }
  })

const wasDeckDeleted = (queryResults) => {
  let deckWasDestroyed = false

  if (queryResults > 0) {
    deckWasDestroyed = true
  }

  return deckWasDestroyed
}

const wasDeckFound = (queryResults) => {
  let deckWasFound = false

  if (queryResults !== null) {
    deckWasFound = true
  }

  return deckWasFound
}


const areThereCardsInModifiedCardsObject = (modifiedCardsObject) => {
  let hasCards = false

  for (const cardArray of Object.values(modifiedCardsObject)) {
    if (areThereCards(cardArray) === true) {
      hasCards = true
      break
    }
  }

  return hasCards
}

const areThereCards = (cards) => {
  let hasCards = false

  if (cards.length > 0) {
    hasCards = true
  }

  return hasCards
}

const formatToDeckCardsTableData = (deckId,cards) => {
  const formattedData = cards.map(card => (
    {
      cardId: card.id,
      nInDeck: card.nInDeck,
      sideboard: card.sideboard,
      deckId: deckId
    })
  )

  return formattedData
}

const moveCardDeckPropertiesToCardProperties = (cards) => {
  const formattedCards = cards.map(card => moveContentOfCardDeckPropertyOneDown(card))
  return formattedCards
}

const moveContentOfCardDeckPropertyOneDown = (card) => {
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

const getFullCardInfoOnCardsOnDeck = async (deckId, cardIds) => {
  const fullCardsInDeckInfo = await sequelize
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
          updatedCardsIds: cardIds
        },
        type: QueryTypes.SELECT
      }
    )

  return fullCardsInDeckInfo
}

const updateDeckInformation = async (deckId, updatedContent) => {
  let updatedDeckInformation

  const queryResults = await Deck.update(
    updatedContent,
    {
      where: { id: deckId },
      returning: true
    }
  )

  if (wasRowUpdated(queryResults) === true) {
    updatedDeckInformation = extractInformationOnUpdatedObject(queryResults)
  }

  return updatedDeckInformation
}

const wasRowUpdated = (updateQueryResults) => {
  let rowWasUpdated = false
  const nOfUpdatedRows = updateQueryResults[0]

  if (nOfUpdatedRows > 0) {
    rowWasUpdated = true
  }

  return rowWasUpdated
}

const modifyCardsInDeck = async (deckId, cards) => {
  const { added, updated, deleted } = cards

  const changesInCards = {
    added: [],
    updated: [],
    deleted: []
  }

  if (areThereCards(added) === true) {
    const cardsAsPartOfDeck = await addCardsToDeck(deckId, added)
    changesInCards.added = [...cardsAsPartOfDeck]
  }

  if (areThereCards(deleted) === true) {
    const nOfDeletedRows = await deleteCardsFromDeck(deckId, deleted)
    changesInCards.deleted = nOfDeletedRows
  }

  if (areThereCards(updated) === true) {
    const cardsAsPartOfDeck = await updateCardsInDeck(deckId, updated)
    changesInCards.updated = [...cardsAsPartOfDeck]
  }
  return changesInCards
}

const addCardsToDeck = async (deckId, cards) => {
  const idsOfAddedCards = await modifyDeckCardsTable(deckId, cards, 'add')
  const cardsAsPartOfDeck = await getFullCardInfoOnCardsOnDeck(deckId, idsOfAddedCards)

  return cardsAsPartOfDeck
}

const deleteCardsFromDeck = async (deckId, cards) => {
  const dataWithDeleteCardIds = cards.map(card => (card.id))

  const nOfDeletedRows = await DeckCard.destroy(({
    where: {
      cardId: dataWithDeleteCardIds,
      deckId: deckId
    }
  }))

  return nOfDeletedRows
}

const updateCardsInDeck = async (deckId, cards) => {
  const idsOfUpdatedCards = await modifyDeckCardsTable(deckId, cards, 'update')
  const cardsAsPartOfDeck = await getFullCardInfoOnCardsOnDeck(deckId, idsOfUpdatedCards)

  return cardsAsPartOfDeck
}

const modifyDeckCardsTable = async (deckId, cards, howToModify) => {
  let returnedModificationInformation
  const dataForDeckCardsTable = formatToDeckCardsTableData(deckId, cards)

  if (howToModify === 'add') {
    returnedModificationInformation = await DeckCard.bulkCreate(dataForDeckCardsTable)
  } else if (howToModify === 'update') {
    returnedModificationInformation = await DeckCard.bulkCreate(dataForDeckCardsTable, {
      updateOnDuplicate: ['nInDeck', 'sideboard'],
    })
  }

  const idsOfAddedCards = returnedModificationInformation.map(info => info.dataValues.cardId)

  return idsOfAddedCards
}

module.exports = decksRouter