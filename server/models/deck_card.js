const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class DeckCard extends Model {}

DeckCard.init({
  deckId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: { model: 'decks', key: 'id' },
    onDelete: 'cascade'
  },
  cardId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: { model: 'cards', key: 'id' },
    onDelete: 'cascade'
  },
  nInDeck: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sideboard: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'deckCard'
})

module.exports = DeckCard