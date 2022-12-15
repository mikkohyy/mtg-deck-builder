import axios from 'axios'
const baseRoute ='/api/decks'

const addDeck = async (deck) => {
  const newDeck = {
    ...deck,
    cards: {
      ...deck.cards,
      added: removeUnnecessaryDataFromCards(deck.cards.added)
    }
  }

  const requestResponse = await axios.post(baseRoute, newDeck)

  console.log(requestResponse)
}

const removeUnnecessaryDataFromCards = (cards) => {
  const unnecessaryFields = ['manaSymbols', 'cardColor', 'cardSetId']
  const cardsInBackendForm = cards.map(card => filterCardKeys(card, unnecessaryFields))

  return cardsInBackendForm
}

const filterCardKeys = (card, unnecessaryField) => {
  const filteredCard = {}

  for (const key of Object.keys(card)){
    if (unnecessaryField.includes(key) === false) {
      filteredCard[key] = card[key]
    }
  }

  return filteredCard
}

export {
  addDeck
}