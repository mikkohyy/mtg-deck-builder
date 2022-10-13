const cardData = require('../data/card_set.json')
const { connectToDatabase } = require('./db')
const { CardSet, Card, User, Deck, DeckCard } = require('../models')

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

  await Deck.bulkCreate([
    {
      userId: 1,
      name: 'Green/Blue counter deck',
      notes: 'Created for draft which happened in 24.9.2022'
    },
    {
      userId: 2,
      name: 'White/Red weenie deck',
      notes: 'Created for draft which happened in 22.9.2021'
    },
  ])

  await DeckCard.bulkCreate([
    {
      deckId: 1,
      cardId: 1,
      nInDeck: 3,
      sideboard: true
    },
    {
      deckId: 1,
      cardId: 3,
      nInDeck: 2,
      sideboard: false
    },
    {
      deckId: 1,
      cardId: 5,
      nInDeck: 1,
      sideboard: false
    },
    {
      deckId: 2,
      cardId: 12,
      nInDeck: 1,
      sideboard: false
    },
    {
      deckId: 2,
      cardId: 100,
      nInDeck: 3,
      sideboard: false
    }
  ])
}

addDataToDatabase()