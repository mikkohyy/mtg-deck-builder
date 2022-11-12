import axios from 'axios'
const baseRoute ='/api/card_sets'

const getAllCardSets = async() => {
  let fetchedDataWithDate

  try {
    const requestResponse = await axios.get(baseRoute)
    const fetchedData = requestResponse.data

    fetchedDataWithDate = fetchedData.map(cardSet => ({ ...cardSet, date: new Date(cardSet.date) }))
  } catch(error) {
    console.log(error)
  }

  return fetchedDataWithDate
}

const getCardSetWithId = async(id) => {
  let fetchedCardSet

  try {
    const requestResponse = await axios.get(`${baseRoute}/${id}`)
    const fetchedData = requestResponse.data
    fetchedCardSet = { ...fetchedData, date: new Date(fetchedData.date) }
  } catch(error) {
    console.log(error)
  }

  return fetchedCardSet
}

export default { getAllCardSets, getCardSetWithId }