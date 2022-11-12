import { useState, useEffect } from 'react'
import styled from 'styled-components'
import CardSetDescriptionBox from './CardSetDescriptionBox'

const TableCell = styled.td`
  padding: 0.5em;
  text-align: center;
`
const TableRow = styled.tr`
  background: ${props => props.isSelected ? '#3AAFA9' : '#DEF2F1'};
`

const CardSetsTableRow = ({ cardSet, selectCardSetRow, selectedCardSet, isRowSelected }) => {
  const [isSelected, setIsSelected] = useState(false)
  const [showDescription, setShowDescription] = useState(false)

  useEffect(() => {
    const selected = isRowSelected(cardSet)
    setIsSelected(selected)
  }, [selectedCardSet])

  const selectThisRow = () => {
    selectCardSetRow(cardSet)
  }

  const toggleDescription = () => {
    setShowDescription(!showDescription)
  }

  return(
    <TableRow isSelected={isSelected}>
      <TableCell onClick={selectThisRow}>
        {cardSet.name}
      </TableCell>
      <TableCell onClick={selectThisRow}>{cardSet.date.toLocaleDateString()}</TableCell>
      <TableCell>
        <button onClick={toggleDescription}>
          { showDescription === true
            ? 'Close'
            : 'Open'
          }
        </button>
        { showDescription === true
          ? <CardSetDescriptionBox description={cardSet.description} />
          : null
        }
      </TableCell>
    </TableRow>
  )
}

export default CardSetsTableRow