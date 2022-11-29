import { useState } from 'react'

const useCardSetRowSelection = () => {
  const [selectedCardSet, setSelectedCardSet] = useState(null)

  const selectThisCardSetRow = (selected) => {
    if (selectedCardSet === null) {
      setSelectedCardSet(selected)
    } else if (selected.id === selectedCardSet.id) {
      setSelectedCardSet(null)
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