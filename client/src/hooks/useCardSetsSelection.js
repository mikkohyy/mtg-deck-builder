import { useState } from 'react'
import cardSetServices from '../services/card_sets'

const useCardSetsSelection = () => {
  // NOTE: Fetches the card set list each time clickOpenCardSets() is run
  // perhaps could be improved by fetching it only once

  const [ isOpen, setIsOpen ] = useState(false)
  const [ cardSetsList, setCardSetsList ] = useState([])

  const fetchCardSetList = async () => {
    let fetchedCardSets

    try {
      fetchedCardSets = await cardSetServices.getAllCardSets()
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
    setIsOpen(!isOpen)
  }

  return {
    setIsOpen,
    isOpen,
    cardSetsList,
    clickOpenCardSets
  }
}

export default useCardSetsSelection