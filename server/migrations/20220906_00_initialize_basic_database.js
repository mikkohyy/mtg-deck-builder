// A sketch of the database that is intialized in this migration can be found
// from ../documentation/basic-database.png

const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('card_sets', {
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
    }),
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }),
    await queryInterface.createTable('decks', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      notes: {
        type: DataTypes.TEXT
      }
    })
    await queryInterface.createTable('cards', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      card_set_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'card_sets', key: 'id' },
        onDelete: 'cascade'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      card_number: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      mana_cost: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      rules_text: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      rarity: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }),
    await queryInterface.createTable('deck_cards', {
      deck_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'decks', key: 'id' },
        onDelete: 'cascade'
      },
      card_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'cards', key: 'id' },
        onDelete: 'cascade'
      },
      n_in_deck: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sideboard: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('deck_cards')
    await queryInterface.dropTable('cards')
    await queryInterface.dropTable('decks')
    await queryInterface.dropTable('card_sets')
    await queryInterface.dropTable('users')
  }
}