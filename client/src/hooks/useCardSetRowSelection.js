import { useState } from 'react'

const useCardSetRowSelection = () => {
  const [selectedCardSet, setSelectedCardSet] = useState(null)

  const selectCardSetRow = (selected) => {
    if (selectedCardSet === null) {
      setSelectedCardSet(selected)
    } else if (selected.id === selectedCardSet.id) {
      setSelectedCardSet(null)
    } else if (selected.id !== selectedCardSet.id) {
      setSelectedCardSet(selected)
    }
  }

  const isRowSelected = (setCard) => {
    let isSelected = false

    if (selectedCardSet !== null && setCard.id === selectedCardSet.id) {
      isSelected = true
    }

    return isSelected
  }

  return {
    selectCardSetRow,
    selectedCardSet,
    isRowSelected
  }
}

export default useCardSetRowSelection