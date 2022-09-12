const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../utils/db')

class DeckCard extends Model {}

DeckCard.init({
  deckId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'decks', key: 'id' }
  },
  cardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'cards', key: 'id' }
  },
  nInDeck: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sideboard: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'deckCard'
})

module.exports = DeckCard