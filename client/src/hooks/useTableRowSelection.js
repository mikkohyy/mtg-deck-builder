import { useState } from 'react'

const useTableRowSelection = () => {
  const [selectedTableRow, setSelectedTableRow] = useState(undefined)

  const selectThisTableRow = (selected) => {
    if (selectedTableRow === undefined) {
      setSelectedTableRow(selected)
    } else if (selected.id === selectedTableRow.id) {
      setSelectedTableRow(undefined)
    } else if (selected.id !== selectedTableRow.id) {
      setSelectedTableRow(selected)
    }
  }

  return {
    selectThisTableRow,
    selectedTableRow
  }
}

export default useTableRowSelection