const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class CardSet extends Model {}

CardSet.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  timestamps: false,
  underscored: true,
  modelName: 'cardSet'
})

module.exports = CardSet