import { useState } from 'react'

const useCardSetRowSelection = () => {
  const [selectedCardSet, setSelectedCardSet] = useState(undefined)

  const selectThisCardSetRow = (selected) => {
    if (selectedCardSet === undefined) {
      setSelectedCardSet(selected)
    } else if (selected.id === selectedCardSet.id) {
      setSelectedCardSet(undefined)
    } else if (selected.id !== selectedCardSet.id) {
      setSelectedCardSet(selected)
    }
  }

  return {
    selectThisCardSetRow,
    selectedCardSet
  }
}

export default useCardSetRowSelection