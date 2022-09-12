const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Card extends Model {}

Card.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cardSetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'card_sets', key: 'id' },
    onDelete: 'cascade'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cardNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { isNumeric: true }
  },
  manaCost: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: { isNumeric: true }
  },
  rulesText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rarity: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isIn: [['common', 'uncommon', 'rare', 'mythic']] }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'card'
})

module.exports = Card