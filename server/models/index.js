const User = require('./user')
const Deck = require('./deck')
const Card = require('./card')
const DeckCard = require('./deck_card')
const CardSet = require('./card_set')

User.hasMany(Deck)
Deck.belongsTo(User)

CardSet.hasMany(Card)
Card.belongsTo(CardSet)

Card.belongsToMany(Deck, { through: DeckCard })
Deck.belongsToMany(Card, { through: DeckCard })

module.exports = {
  User,
  Deck,
  Card,
  DeckCard,
  CardSet
}