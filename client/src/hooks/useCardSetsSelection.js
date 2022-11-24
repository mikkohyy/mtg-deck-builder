import { useState } from 'react'
import { getAllCardSets } from '../services/card_sets'

const useCardSetsSelection = () => {
  // NOTE: Fetches the card set list each time clickOpenCardSets() is run
  // perhaps could be improved by fetching it only once

  const [ cardSetIsOpen, setCardSetIsOpen ] = useState(false)
  const [ cardSetsList, setCardSetsList ] = useState([])

  const fetchCardSetList = async () => {
    let fetchedCardSets

    try {
      fetchedCardSets = await getAllCardSets()
    } catch(error) {
      console.log(error)
    }

    return fetchedCardSets
  }

  const clickOpenCardSets = async () => {
    changeOpenCardSetActivity()
    const foundCardSets = await fetchCardSetList()
    setCardSetsList(foundCardSets)
  }

  const changeOpenCardSetActivity = () => {
    setCardSetIsOpen(!cardSetIsOpen)
  }

  return {
    setCardSetIsOpen,
    cardSetIsOpen,
    cardSetsList,
    clickOpenCardSets
  }
}

export default useCardSetsSelection