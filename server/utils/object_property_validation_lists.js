const BasicValidator = require('./basic_validator')

const userObjectPropertyChecks = {
  id: (data) => BasicValidator.checkfIfInteger(data),
  username: (data) => BasicValidator.checkIfString(data),
  password: (data) => BasicValidator.checkIfString(data)
}

const cardObjectPropertyChecks = {
  id: (data) => BasicValidator.checkIfInteger(data),
  cardSetId: (data) => BasicValidator.checkIfInteger(data),
  name: (data) => BasicValidator.checkIfString(data),
  cardNumber: (data) => BasicValidator.checkIfInteger(data),
  manaCost: (data) => BasicValidator.checkIfManaCost(data),
  price: (data) => BasicValidator.checkIfFloat(data),
  rulesText: (data) => BasicValidator.checkIfString(data),
  rarity: (data) => BasicValidator.checkIfString(data),
  nInDeck: (data) => BasicValidator.checkIfInteger(data),
  sideboard: (data) => BasicValidator.checkIfBoolean(data)
}

const deckObjectPropertyChecks = {
  id: (data) => BasicValidator.checkIfInteger(data),
  userId: (data) => BasicValidator.checkIfInteger(data),
  name: (data) => BasicValidator.checkIfString(data),
  notes: (data) => BasicValidator.checkIfString(data),
  cards: (data) => BasicValidator.checkIfModifiedCardsObject(data),
}

const cardSetObjectPropertyChecks = {
  id: (data) => BasicValidator.checkIfInteger(data),
  name: (data) => BasicValidator.checkIfString(data),
  description: (data) => BasicValidator.checkIfString(data),
  cards: (data) => BasicValidator.checkIfArray(data),
  date: (data) => BasicValidator.checkIfDate(data)
}

module.exports = {
  userObjectPropertyChecks,
  cardObjectPropertyChecks,
  deckObjectPropertyChecks,
  cardSetObjectPropertyChecks
}