import axios from 'axios'
const baseRoute ='/api/card_sets'

const getAllCardSets = async () => {
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

export default { getAllCardSets }