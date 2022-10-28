const {
  testCardSetsWithId,
  testCardsWithId,
  testUsersWithId,
  testCardDeckCombinations
} = require('./test_data')
const { QueryTypes } = require('sequelize')
const { sequelize } = require('../utils/db')
const queryInterface = sequelize.getQueryInterface()

const transformKeysFromSnakeCaseToCamelCase = (snakecaseObject) => {
  const camelCaseObject = {}

  for (const [key, value] of Object.entries(snakecaseObject)) {
    const keyAsArray = key.split('_')

    let newKey = keyAsArray[0]

    if (keyAsArray.length > 1) {
      const withoutFirstIndex = keyAsArray.slice(1)
      const withCapitalLetter = withoutFirstIndex
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      newKey = newKey.concat(withCapitalLetter.join(''))
    }

    camelCaseObject[newKey] = value
  }

  return camelCaseObject
}

const transformKeysFromCamelCaseToSnakeCase = (camelCaseObject) => {
  let snakeCaseObject = {}

  for (const [key, value] of Object.entries(camelCaseObject)) {
    const splittedKey = key.split(/(?=[A-Z])/)
    const splittedKeyInLowerCase = splittedKey.map(word => word.toLowerCase())
    const keyInSnakeCase = splittedKeyInLowerCase.join('_')
    snakeCaseObject[keyInSnakeCase] = value
  }

  return snakeCaseObject
}



const addInfoRelatedToDeckToCard = (cards) => {
  const maxId = Math.max(...testCardDeckCombinations.map(card => card.card_id))
  const deckCardInfoById = Array(maxId+1).fill(null)
  for (const combination of testCardDeckCombinations) {
    const cardInfo = {
      nInDeck: combination.n_in_deck,
      sideboard: combination.sideboard,
      deckCardTableId: combination.id
    }
    deckCardInfoById[combination.card_id] = cardInfo
  }

  const cardsWithNOfCardsAndRemovedCardSetId = cards
    .map(card => addNOfCardsAndRemoveCardSetId(card, deckCardInfoById))

  return cardsWithNOfCardsAndRemovedCardSetId
}

const addNOfCardsAndRemoveCardSetId = (card, deckCardInfoById) => {
  delete card.cardSetId

  const cardWithNInDeck = {
    ...card,
    nInDeck: deckCardInfoById[card.id].nInDeck,
    sideboard: deckCardInfoById[card.id].sideboard,
    deckCardTableId: deckCardInfoById[card.id].deckCardTableId
  }

  return cardWithNInDeck
}

const fillDatabaseForDecksAPITests = async () => {
  await queryInterface.bulkDelete('deck_cards')
  await queryInterface.bulkDelete('cards')
  await queryInterface.bulkDelete('card_sets')
  await queryInterface.bulkDelete('decks')
  await queryInterface.bulkDelete('users')

  await sequelize.query('ALTER SEQUENCE "cards_id_seq" RESTART WITH 31')
  await sequelize.query('ALTER SEQUENCE "card_sets_id_seq" RESTART WITH 4')
  await sequelize.query('ALTER SEQUENCE "users_id_seq" RESTART WITH 4')

  await queryInterface.bulkInsert('card_sets', testCardSetsWithId)
  await queryInterface.bulkInsert('cards', testCardsWithId)
  await queryInterface.bulkInsert('users', testUsersWithId)
}

const queryTableContent = async (tableName) => {
  const tableContent = await sequelize
    .query(
      `SELECT * FROM ${tableName}`,
      { type: QueryTypes.SELECT }
    )
  return tableContent
}

const queryTableContentWithId = async (tableName, id) => {
  const queryResponse = await sequelize
    .query(
      `SELECT * FROM "${tableName}"  WHERE id = ${id}`,
      { type: QueryTypes.SELECT }
    )
  return queryResponse
}

const queryTableContentWithFieldValue = async (tableName, field, value) => {
  const queryResponse = await sequelize
    .query(
      `SELECT * FROM "${tableName}" WHERE ${field}=${value}`,
      { type: QueryTypes.SELECT }
    )
  return queryResponse
}

const getFilteredTableContentWithSQLQuery = async (tableName, fieldName, value) => {
  const queryResponse = await sequelize
    .query(`SELECT * FROM "${tableName}" WHERE ${fieldName}=${value}`)
  const tableContent = queryResponse[0]

  return tableContent
}

/**
 * @typedef {Object} Modified cards object
 * @param {Array} addedCards Card objects
 * @param {Array} updatedCards Card objects
 * @param {Array} deletedCards Card objects
 */

/**
 * Method that adds given array to object which represents changes in card set's cards
 * @param {array} addedCards
 * @param {array} updatedCards
 * @param {array} deletedCards
 * @returns {object} Object with keys 'added', 'updated' and 'deleted'
 */
const getDeckCardUpdateObject = (addedCards, updatedCards, deletedCards) => {
  const updatedDeckCardObject = {
    added: addedCards,
    updated: updatedCards,
    deleted: deletedCards
  }

  return updatedDeckCardObject
}

const removePropertiesFromObject = (object, attributesToBeRemoved) => {
  const objectWithRemovedAttributes = {}

  for (const key of Object.keys(object)) {
    if (!attributesToBeRemoved.includes(key)) {
      objectWithRemovedAttributes[key] = object[key]
    }
  }

  return objectWithRemovedAttributes
}

const getAllInvalidCardsFromUpdatedCards = (invalidCardsInfo) => {
  let invalidCards = []
  for (const invalidInfo of Object.values(invalidCardsInfo)) {
    invalidCards.push(...invalidInfo)
  }

  return invalidCards
}

module.exports = {
  transformKeysFromSnakeCaseToCamelCase,
  transformKeysFromCamelCaseToSnakeCase,
  fillDatabaseForDecksAPITests,
  addInfoRelatedToDeckToCard,
  queryTableContent,
  getFilteredTableContentWithSQLQuery,
  getDeckCardUpdateObject,
  removePropertiesFromObject,
  getAllInvalidCardsFromUpdatedCards,
  queryTableContentWithId,
  queryTableContentWithFieldValue
}