import axios from 'axios'
const baseRoute ='/api/card_sets'
import { getCardsWithCardColorAndManaSymbols } from '../utils/card_property_utils'

const getAllCardSets = async() => {
  let fetchedDataWithDate

  try {
    const requestResponse = await axios.get(baseRoute)
    const fetchedData = requestResponse.data

    fetchedDataWithDate = fetchedData.map(cardSet => ({ ...cardSet, date: new Date(cardSet.date) }))
  } catch(error) {
    console.log('ERR', error)
  }

  return fetchedDataWithDate
}

const getCardSetWithId = async(id) => {
  let fetchedCardSet

  try {
    const requestResponse = await axios.get(`${baseRoute}/${id}`)
    const fetchedData = requestResponse.data
    const cardsWithColor = getCardsWithCardColorAndManaSymbols(fetchedData.cards)

    fetchedCardSet = {
      ...fetchedData,
      date: new Date(fetchedData.date),
      cards: cardsWithColor
    }
  } catch(error) {
    console.log(error)
  }

  return fetchedCardSet
}

const addCardSet = async (newCardSet) => {
  const requestResponse = await axios.post(baseRoute, newCardSet)
  const returnedData = requestResponse.data
  const cardsWithColor = getCardsWithCardColorAndManaSymbols(returnedData.cards)

  const addedCardSet = {
    ...returnedData,
    date: new Date(returnedData.date),
    cards: cardsWithColor
  }

  return addedCardSet
}

const deleteCardSet = async (cardSetId) => {
  await axios.delete(`${baseRoute}/${cardSetId}`)
}

export {
  getAllCardSets,
  getCardSetWithId,
  addCardSet,
  deleteCardSet
}