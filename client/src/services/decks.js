import axios from 'axios'
import { createBearerToken } from '../utils/general'
const baseRoute ='/api/decks'

const addDeckToDatabase = async (token, deck) => {
  const config = {
    headers: { Authorization: createBearerToken(token) }
  }

  const newDeck = {
    ...deck,
    cards: {
      ...deck.cards,
      added: removeUnnecessaryDataFromCards(deck.cards.added)
    }
  }

  const requestResponse = await axios.post(baseRoute, newDeck, config)

  return requestResponse
}

const getDeckFromDatabase = async (token, deckId) => {
  const config = {
    headers: { Authorization: createBearerToken(token) }
  }

  const requestResponse  = await axios.get(`${baseRoute}/${deckId}`, config)

  return requestResponse
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
  addDeckToDatabase,
  getDeckFromDatabase
}