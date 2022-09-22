const cardData = require('../data/card_set.json')
const { connectToDatabase } = require('./db')
const { CardSet, Card, User } = require('../models')

const addDataToDatabase = async () => {
  await connectToDatabase()
  const createdSet = await CardSet.create({
    name: 'Original set',
    description: 'The first ever set',
    date: new Date()
  }, {
    validate: true
  })

  const formattedCardData = cardData.map(card => {
    return {
      cardSetId: createdSet.id,
      name: card.name,
      cardNumber: card.card_number,
      manaCost: card.mana_cost,
      price: card.average_price_30_days,
      rulesText: card.rules_text,
      rarity: card.rarity,
    }
  })

  await Card.bulkCreate(formattedCardData, { validate: true })

  await User.bulkCreate([
    {
      username: 'zerocool',
      password: 'password'
    },
    {
      username: 'acidburn',
      password: 'password'
    }
  ])
}

addDataToDatabase()