import { useState, useEffect } from 'react'
import styled from 'styled-components'
import ButtonWithPopUpBox from '../../Generic/ButtonWithPopUpBox'

const TableCell = styled.td`
  padding: 0.5em 4em 0.5em 4em;
  text-align: center;
`
const TableRow = styled.tr`
  background: ${props => props.isSelected
    ? props.theme.basicPalette.dark
    : props.background };
`

const CardSetsTableRow = ({ cardSet, selectThisCardSetRow, selectedCardSet, backgroundColor }) => {
  const [isSelected, setIsSelected] = useState(false)

  useEffect(() => {
    let thisSetIsSelected = false

    if (userHasSelectedThisRow() === true) {
      thisSetIsSelected = true
    }

    setIsSelected(thisSetIsSelected)
  }, [selectedCardSet])

  const userHasSelectedThisRow = () => {
    let isSelected = false

    if ((selectedCardSet !== undefined && selectedCardSet.id === cardSet.id)) {
      isSelected = true
    }

    return isSelected
  }

  const selectRow = () => {
    selectThisCardSetRow(cardSet)
  }

  return(
    <TableRow isSelected={isSelected} background={backgroundColor}>
      <TableCell onClick={selectRow}>
        {cardSet.name}
      </TableCell>
      <TableCell onClick={selectRow}>{cardSet.date.toLocaleDateString()}</TableCell>
      <TableCell>
        <div>
          <ButtonWithPopUpBox
            buttonTextWhenHiddenBox='Show'
            buttonTextWhenVisibleBox='Hide'
            boxText={cardSet.description}
            width='4em'
          />
        </div>
      </TableCell>
    </TableRow>
  )
}

export default CardSetsTableRow