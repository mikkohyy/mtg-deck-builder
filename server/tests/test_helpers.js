const {
  testCardSetsWithId,
  testCardsWithId,
  testUsersWithId,
  testCardDeckCombination
} = require('./test_data')
const { sequelize } = require('../utils/db')
const queryInterface = sequelize.getQueryInterface()

const transformSnakeCaseCardFieldsToCamelCase = (card) => {
  const dbCompatibleCard = {
    'id': card.id,
    'cardSetId': card.card_set_id,
    'name': card.name,
    'cardNumber': card.card_number,
    'manaCost': card.mana_cost,
    'price': card.price,
    'rulesText': card.rules_text,
    'rarity': card.rarity
  }

  return dbCompatibleCard
}

const transformPropertiesFromSnakecaseToCamelCase = (snakecaseObject) => {
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

const addInfoRelatedToDeckToCard = (cards) => {
  const maxId = Math.max(...testCardDeckCombination.map(card => card.card_id))
  const deckCardInfoById = Array(maxId+1).fill(null)

  for (const combination of testCardDeckCombination) {
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

const getTableContentWithSQLQuery = async (tableName) => {
  const queryResponse = await sequelize.query(`SELECT * FROM ${tableName}`)
  const tableContent = queryResponse[0]

  return tableContent
}

const getFilteredTableContentWithSQLQuery = async (tableName, fieldName, value) => {
  // tähän querytype?
  // https://doc.esdoc.org/github.com/sequelize/sequelize/manual/raw-queries.html
  const queryResponse = await sequelize
    .query(`SELECT * FROM ${tableName} WHERE ${fieldName}=${value}`)
  const tableContent = queryResponse[0]

  return tableContent
}

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
  transformSnakeCaseCardFieldsToCamelCase,
  fillDatabaseForDecksAPITests,
  addInfoRelatedToDeckToCard,
  transformPropertiesFromSnakecaseToCamelCase,
  getTableContentWithSQLQuery,
  getFilteredTableContentWithSQLQuery,
  getDeckCardUpdateObject,
  removePropertiesFromObject,
  getAllInvalidCardsFromUpdatedCards
}