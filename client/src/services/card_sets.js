import axios from 'axios'
const baseRoute ='/api/card_sets'

const getAllCardSets = async () => {
  let fetchedData

  try {
    const requestResponse = await axios.get(baseRoute)
    fetchedData = requestResponse.data
  } catch(error) {
    console.log(error)
    fetchedData = error
  }

  return fetchedData
}

export default { getAllCardSets }